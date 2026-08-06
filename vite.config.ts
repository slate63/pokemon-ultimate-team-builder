import { readFileSync, statSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const ROSTER_PATH = fileURLToPath(new URL('./src/data/fullRoster.json', import.meta.url));
const INDEX_ROUTE = '/data/indices/pokedex_index.json';

type GenerationBlock = { moves?: unknown; description?: unknown };
type RosterEntry = {
  sprite_info?: unknown;
  game_sprites?: unknown;
  generations?: Record<string, GenerationBlock>;
};

/**
 * Serves the roster index that `loadFullPokemonList` fetches first.
 *
 * In production scripts/inline_dist.py injects `window.__POKEMON_DATA__` from
 * src/data/fullRoster.json and that fetch never happens. No pokedex_index.json
 * is committed, though, so dev fell through to the flat, generation-less
 * public/data/indices/pokemon_index.json, `resolvePokemon` returned undefined
 * for every entry, and the grid rendered "Showing 0 Pokémon".
 *
 * Deriving the index from the same roster file, stripping the same keys
 * inline_dist.py strips, keeps dev byte-identical to production instead of
 * depending on a hand-run fetch script. Dev only: the production build carries
 * the data inline and never requests this route.
 */
function pokedexIndexPlugin(): Plugin {
  let cached: string | null = null;
  let cachedMtimeMs = 0;

  function buildIndex(): string {
    const { mtimeMs } = statSync(ROSTER_PATH);
    if (cached && mtimeMs === cachedMtimeMs) return cached;

    const roster = JSON.parse(readFileSync(ROSTER_PATH, 'utf-8')) as RosterEntry[];
    for (const pokemon of roster) {
      delete pokemon.sprite_info;
      delete pokemon.game_sprites;
      for (const genData of Object.values(pokemon.generations ?? {})) {
        delete genData.moves;
        delete genData.description;
      }
    }

    cached = JSON.stringify(roster);
    cachedMtimeMs = mtimeMs;
    return cached;
  }

  return {
    name: 'pokedex-index',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || req.url.split('?')[0] !== INDEX_ROUTE) return next();

        try {
          const body = buildIndex();
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'no-cache');
          res.end(body);
        } catch (e) {
          server.config.logger.error(
            `[pokedex-index] failed to build index from ${ROSTER_PATH}: ${e}`
          );
          next(e);
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), pokedexIndexPlugin()],
  base: './', // Ensures relative asset paths for GitHub Pages deployment
  resolve: {
    // Must stay in sync with "paths" in tsconfig.json. Without this, an
    // `@/...` import typechecks cleanly under tsc and then fails at build.
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    cssCodeSplit: false,
    modulePreload: false,
  },
});
