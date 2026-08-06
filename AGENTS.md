# Agent guide — Pokémon Ultimate Team Builder

**Stack:** Vite 6 + React 19 + TypeScript 5.7, vanilla CSS, `lucide-react` for icons.
There is no Next.js, no CSS framework, no state library, and no test runner in this
project. Do not add one without being asked.

Deployed as a fully static site to GitHub Pages at
`https://slate63.github.io/pokemon-ultimate-team-builder/`.

## The data-flow contract

This is the single most important thing to understand, and the easiest to get wrong.

```
scripts/*.py  ──writes──>  public/data/**  ──vite copies──>  dist/data/**  ──fetched at runtime──>  app
                           public/api/v1/**                  dist/api/v1/**
```

- **`public/` is the only directory Vite copies into `dist/`.** Anything the app
  `fetch()`es at runtime must live under `public/`, not `src/`.
- The app fetches with **relative** paths (`./data/...`) because `vite.config.ts`
  sets `base: './'` for Pages. Never use absolute (`/data/...`) paths — they break
  the deployed site, which is served from a subpath.
- **`public/data/**` is the source of truth** and is committed. `public/api/v1/**`
  is generated from it on every build and is gitignored. Never propose deleting or
  regenerating `public/data/**` as if it were build output.
- `src/data/fullRoster.json` (31 MB) is a **tracked build input. Do not untrack or
  delete it.** Two things read it:
  - `scripts/inline_dist.py:42` — the *primary* source of `window.__POKEMON_DATA__`,
    i.e. the entire production dataset. If the file is absent it silently falls
    back to `dist/data/pokemon/*/data.json`, which is thinner (no sprite metadata),
    so a missing file degrades the build instead of failing it.
  - the `pokedex-index` dev plugin in `vite.config.ts`, which serves
    `/data/indices/pokedex_index.json` from it.

  The file is never *served over HTTP* from `dist/` — Vite copies `public/`, not
  `src/` — so any code that tries to `fetch()` it is broken. That is separate from
  it being a build input.

  It is regenerable via `scripts/fetch_version_sprites.py`, but that costs ~1025
  PokeAPI calls, and a fresh clone without it produces a degraded bundle with no
  error. Treat it as required.

## Build pipeline

`npm run build` runs four stages in order:

1. `python3 scripts/build_data_api.py` — generates `public/api/v1/**` (gitignored)
2. `tsc` — typecheck only (`noEmit: true`)
3. `vite build` — bundles to `dist/`
4. `python3 scripts/inline_dist.py` — inlines all CSS, JS, and datasets into a
   single self-contained `dist/index.html`

Stage 4 is why `dist/index.html` is multi-megabyte. **Never commit `dist/`** — it is
gitignored, and past commits of it are the largest single contributor to repo size.

### Python scripts

`scripts/` serves three different lifecycles:

| Group | Files | When |
|---|---|---|
| Build-time | `build_data_api.py`, `inline_dist.py` | every CI deploy |
| One-time fetchers | `fetch_*.py` | manual, hits PokeAPI |
| Maintenance | `cleanup_roster.py`, `verify_availability.py`, `sync_sprites_to_data.py` | manual |

**Build-time scripts must import only the Python standard library.** The deploy
workflow sets up Python but deliberately does *not* `pip install` anything, so a
deploy can never break on a missing package. Adding a third-party import to
`build_data_api.py` or `inline_dist.py` will break production. The manual
`fetch_*.py` scripts may use `requests` (see `requirements.txt`).

`fetchalldata.sh` lives at the repo root **by design** — it does `cd "$(dirname "$0")"`
and then invokes `python3 scripts/*.py`. Moving it into `scripts/` breaks all of its
invocations.

## Conventions

- One type per file in `src/types/`, re-exported through `src/types/index.ts`.
  Follow this when adding types.
- Hooks in `src/hooks/`, barrel-exported via `src/hooks/index.ts`.
- `@/*` is aliased to `./src/*` in **both** `tsconfig.json` and `vite.config.ts`.
  If you change one, change the other — a mismatch typechecks clean and then fails
  at build time.
- Styling is vanilla CSS in `src/index.css` (~1600 lines) using CSS custom
  properties. There are no CSS modules and no utility classes.

## Before you finish

- `npx tsc --noEmit` must pass — this is what CI gates on.
- `npx eslint .` must pass.
- If you touched anything under `public/data/**` or the fetch paths in
  `src/data/pokemonData.ts`, run `npm run build` and confirm `dist/data/` contains
  what the app expects.
