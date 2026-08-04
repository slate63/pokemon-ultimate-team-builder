#!/usr/bin/env python3
"""
Fetch Pokemon data from PokeAPI and save into a per-Pokemon folder structure.

All data for a given Pokemon (across every generation) lives in a single
``<NNN-name>.json`` file in ``src/data/pokemon/``.  The JSON contains only
``id`` and ``name`` at the top level — everything else lives under a
``generations`` dict keyed by generation number:

  {
    "id": 1,
    "name": "bulbasaur",
    "generations": {
      "1": { "types": [...], "stats": {...}, "abilities": [...], ... },
      "2": { ... },
      "3": { ... },
      ...
    }
  }

Each ``generations["<N>"]`` entry holds gen-correct data: stats, types
(resolved via past_types for the target generation), abilities, move list
filtered to that gen's version groups, availability limited to that gen's
games, height, weight, description, and legendary/mythical flags.

Universal + gen-specific sprite images live in a shared ``sprites/``
directory (downloaded once; later gen runs overwrite identical files).

Data is split across two locations:

    src/data/pokemon/              # per-Pokemon JSON files (imported by Vite)
      001-bulbasaur.json
      002-ivysaur.json
      ...

    public/data/pokemon/           # sprite images (served statically)
      001-bulbasaur/
        sprites/
          standard/                  # universal front/back + shiny
          artwork/                   # official artwork + shiny
          showdown/                  # animated GIFs
          home/                      # HOME 2D renders
          red-blue/                  # gen1-specific
          yellow/
          gold/                      # gen2-specific
          silver/
          crystal/
          ...                        # one folder per game/source
      002-ivysaur/
        ...
      ...  (one folder per National-Dex Pokemon)

Each sprite group can be fetched independently via --sprites:

    # Fetch only standard + showdown sprites
    python3 scripts/fetch_pokemon.py --generation 1 --sprites standard,showdown

    # Fetch only yellow game sprites
    python3 scripts/fetch_pokemon.py --id 25 --generation 1 --sprites yellow

After fetching, per-Pokemon JSON files are saved directly to
``src/data/pokemon/`` where the Vite app loads them at build time via
``import.meta.glob``.  No separate compilation or sync step is needed.

Uses only Python standard library (no external dependencies needed).

Usage:
    # Fetch ALL Pokemon (1–151) for the Gen 1 data set with sprites
    python3 scripts/fetch_pokemon.py --generation 1

    # Fetch ALL 9 generations at once (each Pokémon fetched once, processed
    # for every generation 1-9 in a single sequential pass)
    python3 scripts/fetch_pokemon.py --all

    # Fetch a single Pokemon into the Gen N data set (requires --generation)
    python3 scripts/fetch_pokemon.py --id 25 --generation 1

    # Fetch a custom range into the Gen N data set (requires --generation)
    python3 scripts/fetch_pokemon.py --range 1 151 --generation 1

    # Fetch only specific sprite groups
    python3 scripts/fetch_pokemon.py --generation 1 --sprites standard,showdown,home

    # Fetch a single Pokémon with only yellow sprites
    python3 scripts/fetch_pokemon.py --id 25 --generation 1 --sprites yellow

    # Fetch without downloading images
    python3 scripts/fetch_pokemon.py --generation 1 --no-images
"""

import argparse
import json
import os
import re
import ssl
import sys
import time
from pathlib import Path
from typing import Dict, List, Optional, Any, Set
import urllib.request
import urllib.error

from rate_limiter import RateLimiter
from utils import get_generation_by_id, clean_name, print_progress_bar
from pokemon_constants import GENERATION_RANGES, GEN_VERSION_GROUPS, GEN_GAMES, is_pokemon_fully_evolved
from availability import get_pokemon_availability_for_gen, resolve_generation_types, is_trade_evolution_for_gen

BASE_URL = "https://pokeapi.co/api/v2/pokemon"
SPECIES_BASE_URL = "https://pokeapi.co/api/v2/pokemon-species"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

SSL_CONTEXT = ssl._create_unverified_context()

def http_get_json(url: str) -> Optional[Dict]:
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, context=SSL_CONTEXT, timeout=10) as resp:
            if resp.status == 200:
                return json.loads(resp.read().decode("utf-8"))
    except Exception:
        pass
    return None


def fetch_species_data(pokemon_id: int, rate_limiter: RateLimiter) -> Dict[str, Any]:
    try:
        rate_limiter.acquire()
        data = http_get_json(f"{SPECIES_BASE_URL}/{pokemon_id}")
        if data:
            description = ""
            for entry in data.get("flavor_text_entries", []):
                if entry.get("language", {}).get("name") == "en":
                    description = entry.get("flavor_text", "").replace("\n", " ").replace("\f", " ").strip()
                    break

            is_legendary = data.get("is_legendary", False)
            is_mythical = data.get("is_mythical", False)
            evolution_chain_url = data.get("evolution_chain", {}).get("url", "") if data.get("evolution_chain") else ""

            return {
                "description": description,
                "is_legendary": is_legendary,
                "is_mythical": is_mythical,
                "evolution_chain_url": evolution_chain_url
            }
    except Exception:
        pass
    return {"description": "", "is_legendary": False, "is_mythical": False, "evolution_chain_url": ""}


def fetch_raw_pokemon_api_data(pokemon_id: int, rate_limiter: RateLimiter) -> Optional[Dict]:
    """
    Fetch raw Pokemon data from PokeAPI (one API call) without any
    generation-specific processing.

    Returns a dict with all the raw fields needed to build per-generation
    data later via :func:`process_pokemon_for_generation`:

        id, name, types, stat_lookup, height, weight, abilities,
        raw_moves, past_types

    This is the single network call — everything else (stats formatting,
    ability filtering, move filtering) is done locally per generation.
    """
    try:
        rate_limiter.acquire()
        data = http_get_json(f"{BASE_URL}/{pokemon_id}")
        if not data:
            return None

        types = [t["type"]["name"] for t in data.get("types", [])]

        # --- Pull stats by matching stat names (robust, not positional) ---
        # PokeAPI returns each stat with a "stat" sub-object containing the
        # canonical name (e.g. "hp", "attack", "defense", "special-attack",
        # "special-defense", "speed").  Build a lookup so we never rely on
        # the array ordering.
        stat_lookup: Dict[str, int] = {}
        for entry in data.get("stats", []):
            stat_name = entry.get("stat", {}).get("name", "")
            base_value = entry.get("base_stat", 0)
            stat_lookup[stat_name] = base_value

        abilities = [a["ability"]["name"] for a in data.get("abilities", [])]

        # Preserve move → version-group mapping so each generation can
        # filter independently without re-fetching from the API.
        raw_moves: List[Dict[str, Any]] = []
        for m in data.get("moves", []):
            vg_names = [
                vgd.get("version_group", {}).get("name", "")
                for vgd in m.get("version_group_details", [])
            ]
            raw_moves.append({"name": m["move"]["name"], "version_groups": vg_names})

        return {
            "id": data["id"],
            "name": data["name"],
            "types": types,
            "stat_lookup": stat_lookup,
            "height": data.get("height", 0) / 10.0,
            "weight": data.get("weight", 0) / 10.0,
            "abilities": abilities,
            "raw_moves": raw_moves,
            "past_types": data.get("past_types", []),
            "past_stats": data.get("past_stats", []),
        }
    except Exception as e:
        print(f"\n✗ Error fetching Pokemon #{pokemon_id}: {e}")
        return None


def process_pokemon_for_generation(raw_data: Dict, target_generation: int) -> Optional[Dict]:
    """
    Transform raw API data (from :func:`fetch_raw_pokemon_api_data`) into
    generation-specific Pokemon data:

      - Stats are formatted for the target generation (Gen 1 collapses
        special-attack/special-defense into a single ``special`` stat).
      - Abilities are omitted for Gen 1 and Gen 2.
      - Moves are filtered to the target generation's version groups.
      - Types are returned as-is (past_types is preserved for later resolution).

    This function makes **no network calls** — it only reshapes data already
    fetched, so it can be called for every generation (1–9) at no extra cost.
    """
    stat_lookup: Dict[str, int] = dict(raw_data["stat_lookup"])  # copy so we can mutate

    # --- Apply past_stats overrides for the target generation ---
    # PokeAPI returns `past_stats`: a list of entries, each with a
    # `generation` (the *last* generation where those stats applied) and a
    # list of stat overrides.  Only stats that *changed* are listed; all
    # others come from the current (latest-gen) stats.
    #
    # To find the correct entry for a target generation, pick the entry
    # with the smallest generation number G such that target_gen <= G.
    # If no entry satisfies this, the current stats are already correct.
    #
    # Example (Butterfree):
    #   past_stats = [
    #     { generation: "generation-i",  stats: [{special: 80}] },
    #     { generation: "generation-v",  stats: [{special-attack: 80}] },
    #   ]
    #   Gen 1  → matches generation-i  → special = 80
    #   Gen 2-5 → matches generation-v → special-attack = 80
    #   Gen 6+  → no match             → current stats (special-attack = 90)
    past_stats_raw = raw_data.get("past_stats", [])
    _ROMAN = {"i": 1, "ii": 2, "iii": 3, "iv": 4, "v": 5, "vi": 6,
              "vii": 7, "viii": 8, "ix": 9}

    best_entry_gen = None
    best_past_stats = None
    for entry in past_stats_raw:
        gen_name = entry.get("generation", {}).get("name", "")
        # e.g. "generation-i" → 1
        parts = gen_name.split("-")
        if len(parts) != 2:
            continue
        entry_gen = _ROMAN.get(parts[1].lower())
        if entry_gen is None:
            continue
        if target_generation <= entry_gen:
            if best_entry_gen is None or entry_gen < best_entry_gen:
                best_entry_gen = entry_gen
                best_past_stats = entry.get("stats", [])

    if best_past_stats:
        for ps in best_past_stats:
            ps_name = ps.get("stat", {}).get("name", "")
            ps_value = ps.get("base_stat", 0)
            stat_lookup[ps_name] = ps_value

    # Gen 1 uses a single "Special" stat (used for both offense and
    # defense) rather than the split special-attack / special-defense
    # introduced in Gen 2.  If past_stats provided a "special" value for
    # Gen 1, use it; otherwise fall back to the current special-attack.
    if target_generation == 1:
        stats = {
            "hp": stat_lookup.get("hp", 0),
            "attack": stat_lookup.get("attack", 0),
            "defense": stat_lookup.get("defense", 0),
            "special": stat_lookup.get("special", stat_lookup.get("special-attack", 0)),
            "speed": stat_lookup.get("speed", 0),
        }
    else:
        stats = {
            "hp": stat_lookup.get("hp", 0),
            "attack": stat_lookup.get("attack", 0),
            "defense": stat_lookup.get("defense", 0),
            "special_attack": stat_lookup.get("special-attack", 0),
            "special_defense": stat_lookup.get("special-defense", 0),
            "speed": stat_lookup.get("speed", 0),
        }

    # Abilities were introduced in Gen 3; Gen 1 and Gen 2 have none.
    if target_generation <= 2:
        abilities: List[str] = []
    else:
        abilities = raw_data["abilities"]

    # Filter moves to only those available in the target generation's
    # version groups.
    target_vg = GEN_VERSION_GROUPS.get(target_generation, set())
    if target_vg:
        moves = [
            m["name"]
            for m in raw_data["raw_moves"]
            if any(vg in target_vg for vg in m["version_groups"])
        ]
    else:
        # Fallback: include all moves if we can't determine version groups
        moves = [m["name"] for m in raw_data["raw_moves"]]

    return {
        "id": raw_data["id"],
        "name": raw_data["name"],
        "types": raw_data["types"],
        "stats": stats,
        "height": raw_data["height"],
        "weight": raw_data["weight"],
        "abilities": abilities,
        "moves": moves,
        "past_types": raw_data["past_types"],
        "past_stats": raw_data.get("past_stats", []),
    }


def fetch_pokemon_data(pokemon_id: int, rate_limiter: RateLimiter, target_generation: int) -> Optional[Dict]:
    """
    Fetch Pokemon data from PokeAPI and filter it for the target generation.
    (Convenience wrapper — calls fetch_raw_pokemon_api_data then
    process_pokemon_for_generation.)

    Moves are limited to version groups in the target generation.
    Types are returned as-is (past_types is preserved for later resolution).
    """
    raw_data = fetch_raw_pokemon_api_data(pokemon_id, rate_limiter)
    if not raw_data:
        return None
    return process_pokemon_for_generation(raw_data, target_generation)


def download_single_image(url: str, dest_path: Path) -> bool:
    if dest_path.exists() and dest_path.stat().st_size > 0:
        return True
    dest_path.parent.mkdir(parents=True, exist_ok=True)
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, context=SSL_CONTEXT, timeout=8) as resp:
            if resp.status == 200:
                with open(dest_path, "wb") as f:
                    f.write(resp.read())
                return True
    except Exception:
        pass
    return False


# ---------------------------------------------------------------------------
# Sprite group registry — defines every sprite that can be fetched, grouped
# by category.  Each group lives in its own subdirectory inside
# ``sprites/`` (e.g. ``sprites/standard/front_default.png``,
# ``sprites/showdown/front_default.gif``, ``sprites/red-blue/front_default.png``).
# ---------------------------------------------------------------------------

AVAILABLE_SPRITE_GROUPS = [
    "standard",      # front/back default & shiny
    "artwork",       # official artwork + shiny
    "showdown",      # animated GIFs
    "home",          # HOME 2D renders
    "red-blue", "yellow",
    "gold", "silver", "crystal",
    "ruby-sapphire", "emerald", "firered-leafgreen",
    "diamond-pearl", "platinum", "heartgold-soulsilver",
    "black-white", "black-white-animated",
    "x-y", "omegaruby-alphasapphire",
    "ultra-sun-ultra-moon", "gen7-icons", "gen8-icons",
]


def get_sprite_tasks(pokemon_id: int, sprites_dir: Path, target_generation: int) -> List[Dict[str, str]]:
    """
    Build the complete list of sprite download tasks for a Pokémon.

    Every sprite group lives in its own subdirectory:
    ``sprites_dir/{group}/{variant}.{ext}``.

    Returns a list of dicts: ``{group, variant, url, path}``.
    """
    POKE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon"
    VER  = f"{POKE}/versions"
    tasks: List[Dict[str, str]] = []

    # -- standard (universal) --
    tasks.append({"group": "standard", "variant": "front_default", "url": f"{POKE}/{pokemon_id}.png",             "path": str(sprites_dir / "standard" / "front_default.png")})
    tasks.append({"group": "standard", "variant": "front_shiny",   "url": f"{POKE}/shiny/{pokemon_id}.png",       "path": str(sprites_dir / "standard" / "front_shiny.png")})
    tasks.append({"group": "standard", "variant": "back_default",  "url": f"{POKE}/back/{pokemon_id}.png",        "path": str(sprites_dir / "standard" / "back_default.png")})
    tasks.append({"group": "standard", "variant": "back_shiny",    "url": f"{POKE}/back/shiny/{pokemon_id}.png",  "path": str(sprites_dir / "standard" / "back_shiny.png")})

    # -- artwork (universal) --
    tasks.append({"group": "artwork", "variant": "artwork",        "url": f"{POKE}/other/official-artwork/{pokemon_id}.png",       "path": str(sprites_dir / "artwork" / "artwork.png")})
    tasks.append({"group": "artwork", "variant": "artwork_shiny",  "url": f"{POKE}/other/official-artwork/shiny/{pokemon_id}.png", "path": str(sprites_dir / "artwork" / "artwork_shiny.png")})

    # -- showdown (universal) --
    tasks.append({"group": "showdown", "variant": "front_default", "url": f"{POKE}/other/showdown/{pokemon_id}.gif",            "path": str(sprites_dir / "showdown" / "front_default.gif")})
    tasks.append({"group": "showdown", "variant": "front_shiny",   "url": f"{POKE}/other/showdown/shiny/{pokemon_id}.gif",      "path": str(sprites_dir / "showdown" / "front_shiny.gif")})
    tasks.append({"group": "showdown", "variant": "back_default",  "url": f"{POKE}/other/showdown/back/{pokemon_id}.gif",       "path": str(sprites_dir / "showdown" / "back_default.gif")})
    tasks.append({"group": "showdown", "variant": "back_shiny",    "url": f"{POKE}/other/showdown/back/shiny/{pokemon_id}.gif", "path": str(sprites_dir / "showdown" / "back_shiny.gif")})

    # -- home (universal) --
    tasks.append({"group": "home", "variant": "front_default", "url": f"{POKE}/other/home/{pokemon_id}.png",       "path": str(sprites_dir / "home" / "front_default.png")})
    tasks.append({"group": "home", "variant": "front_shiny",   "url": f"{POKE}/other/home/shiny/{pokemon_id}.png", "path": str(sprites_dir / "home" / "front_shiny.png")})

    # -- gen-specific game sprites --
    if target_generation == 1:
        tasks.append({"group": "red-blue", "variant": "front_default", "url": f"{VER}/generation-i/red-blue/{pokemon_id}.png",      "path": str(sprites_dir / "red-blue" / "front_default.png")})
        tasks.append({"group": "red-blue", "variant": "back_default",  "url": f"{VER}/generation-i/red-blue/back/{pokemon_id}.png", "path": str(sprites_dir / "red-blue" / "back_default.png")})
        tasks.append({"group": "yellow",   "variant": "front_default", "url": f"{VER}/generation-i/yellow/{pokemon_id}.png",        "path": str(sprites_dir / "yellow" / "front_default.png")})
        tasks.append({"group": "yellow",   "variant": "back_default",  "url": f"{VER}/generation-i/yellow/back/{pokemon_id}.png",   "path": str(sprites_dir / "yellow" / "back_default.png")})

    elif target_generation == 2:
        for game in ["gold", "silver", "crystal"]:
            tasks.append({"group": game, "variant": "front_default", "url": f"{VER}/generation-ii/{game}/{pokemon_id}.png",            "path": str(sprites_dir / game / "front_default.png")})
            tasks.append({"group": game, "variant": "front_shiny",   "url": f"{VER}/generation-ii/{game}/shiny/{pokemon_id}.png",      "path": str(sprites_dir / game / "front_shiny.png")})
            tasks.append({"group": game, "variant": "back_default",  "url": f"{VER}/generation-ii/{game}/back/{pokemon_id}.png",       "path": str(sprites_dir / game / "back_default.png")})
            tasks.append({"group": game, "variant": "back_shiny",    "url": f"{VER}/generation-ii/{game}/back/shiny/{pokemon_id}.png", "path": str(sprites_dir / game / "back_shiny.png")})

    elif target_generation == 3:
        for game in ["ruby-sapphire", "emerald", "firered-leafgreen"]:
            tasks.append({"group": game, "variant": "front_default", "url": f"{VER}/generation-iii/{game}/{pokemon_id}.png",       "path": str(sprites_dir / game / "front_default.png")})
            tasks.append({"group": game, "variant": "front_shiny",   "url": f"{VER}/generation-iii/{game}/shiny/{pokemon_id}.png", "path": str(sprites_dir / game / "front_shiny.png")})
        # Back sprites only available for ruby-sapphire
        tasks.append({"group": "ruby-sapphire", "variant": "back_default", "url": f"{VER}/generation-iii/ruby-sapphire/back/{pokemon_id}.png",      "path": str(sprites_dir / "ruby-sapphire" / "back_default.png")})
        tasks.append({"group": "ruby-sapphire", "variant": "back_shiny",   "url": f"{VER}/generation-iii/ruby-sapphire/back/shiny/{pokemon_id}.png", "path": str(sprites_dir / "ruby-sapphire" / "back_shiny.png")})

    elif target_generation == 4:
        for game in ["diamond-pearl", "platinum", "heartgold-soulsilver"]:
            tasks.append({"group": game, "variant": "front_default", "url": f"{VER}/generation-iv/{game}/{pokemon_id}.png",            "path": str(sprites_dir / game / "front_default.png")})
            tasks.append({"group": game, "variant": "front_shiny",   "url": f"{VER}/generation-iv/{game}/shiny/{pokemon_id}.png",      "path": str(sprites_dir / game / "front_shiny.png")})
            tasks.append({"group": game, "variant": "back_default",  "url": f"{VER}/generation-iv/{game}/back/{pokemon_id}.png",       "path": str(sprites_dir / game / "back_default.png")})
            tasks.append({"group": game, "variant": "back_shiny",    "url": f"{VER}/generation-iv/{game}/back/shiny/{pokemon_id}.png", "path": str(sprites_dir / game / "back_shiny.png")})

    elif target_generation == 5:
        # Static sprites
        tasks.append({"group": "black-white", "variant": "front_default", "url": f"{VER}/generation-v/black-white/{pokemon_id}.png",            "path": str(sprites_dir / "black-white" / "front_default.png")})
        tasks.append({"group": "black-white", "variant": "front_shiny",   "url": f"{VER}/generation-v/black-white/shiny/{pokemon_id}.png",      "path": str(sprites_dir / "black-white" / "front_shiny.png")})
        tasks.append({"group": "black-white", "variant": "back_default",  "url": f"{VER}/generation-v/black-white/back/{pokemon_id}.png",       "path": str(sprites_dir / "black-white" / "back_default.png")})
        tasks.append({"group": "black-white", "variant": "back_shiny",    "url": f"{VER}/generation-v/black-white/back/shiny/{pokemon_id}.png", "path": str(sprites_dir / "black-white" / "back_shiny.png")})
        # Animated sprites (used by both B/W and B2/W2)
        tasks.append({"group": "black-white-animated", "variant": "front_default", "url": f"{VER}/generation-v/black-white/animated/{pokemon_id}.gif",            "path": str(sprites_dir / "black-white-animated" / "front_default.gif")})
        tasks.append({"group": "black-white-animated", "variant": "front_shiny",   "url": f"{VER}/generation-v/black-white/animated/shiny/{pokemon_id}.gif",      "path": str(sprites_dir / "black-white-animated" / "front_shiny.gif")})
        tasks.append({"group": "black-white-animated", "variant": "back_default",  "url": f"{VER}/generation-v/black-white/animated/back/{pokemon_id}.gif",       "path": str(sprites_dir / "black-white-animated" / "back_default.gif")})
        tasks.append({"group": "black-white-animated", "variant": "back_shiny",    "url": f"{VER}/generation-v/black-white/animated/back/shiny/{pokemon_id}.gif", "path": str(sprites_dir / "black-white-animated" / "back_shiny.gif")})

    elif target_generation == 6:
        for game in ["x-y", "omegaruby-alphasapphire"]:
            tasks.append({"group": game, "variant": "front_default", "url": f"{VER}/generation-vi/{game}/{pokemon_id}.png",       "path": str(sprites_dir / game / "front_default.png")})
            tasks.append({"group": game, "variant": "front_shiny",   "url": f"{VER}/generation-vi/{game}/shiny/{pokemon_id}.png", "path": str(sprites_dir / game / "front_shiny.png")})

    elif target_generation == 7:
        tasks.append({"group": "ultra-sun-ultra-moon", "variant": "front_default", "url": f"{VER}/generation-vii/ultra-sun-ultra-moon/{pokemon_id}.png",       "path": str(sprites_dir / "ultra-sun-ultra-moon" / "front_default.png")})
        tasks.append({"group": "ultra-sun-ultra-moon", "variant": "front_shiny",   "url": f"{VER}/generation-vii/ultra-sun-ultra-moon/shiny/{pokemon_id}.png", "path": str(sprites_dir / "ultra-sun-ultra-moon" / "front_shiny.png")})
        tasks.append({"group": "gen7-icons", "variant": "front_default", "url": f"{VER}/generation-vii/icons/{pokemon_id}.png", "path": str(sprites_dir / "gen7-icons" / "front_default.png")})

    elif target_generation == 8:
        tasks.append({"group": "gen8-icons", "variant": "front_default", "url": f"{VER}/generation-viii/icons/{pokemon_id}.png", "path": str(sprites_dir / "gen8-icons" / "front_default.png")})

    # Gen 9: No gen-specific sprite sets — universal sprites cover it.

    return tasks


def download_pokemon_assets(
    pokemon_id: int,
    pokemon_dir: Path,
    target_generation: int,
    sprite_groups: Optional[Set[str]] = None,
) -> int:
    """
    Download sprites for a Pokemon.

    Every sprite group lives in its own subdirectory inside ``sprites/``:
    ``sprites/{group}/{variant}.{ext}``.

    Parameters
    ----------
    pokemon_id
        National Pokédex ID.
    pokemon_dir
        The Pokémon's directory (e.g. ``004-charmander``).
    target_generation
        Used to determine which gen-specific sprite groups to include.
    sprite_groups
        Optional set of group names to fetch.  ``None`` or ``{"all"}``
        means fetch everything.  See ``AVAILABLE_SPRITE_GROUPS`` for
        the full list.
    """
    sprites_dir = pokemon_dir / "sprites"
    sprites_dir.mkdir(parents=True, exist_ok=True)

    tasks = get_sprite_tasks(pokemon_id, sprites_dir, target_generation)

    # Filter by requested groups (unless "all" or None)
    if sprite_groups and "all" not in sprite_groups:
        tasks = [t for t in tasks if t["group"] in sprite_groups]

    downloaded = 0
    for task in tasks:
        if download_single_image(task["url"], Path(task["path"])):
            downloaded += 1

    return downloaded


def _label_stats_with_gen_and_number(data: Dict, generation: int, number: int) -> None:
    """
    Inject 'generation' and 'number' labels into the stats dict so that
    the saved JSON clearly identifies which generation and Pokémon number
    the stat values belong to.

    Resulting structure (Gen 2+):
        "stats": {
            "generation": <gen>,
            "number": <pokedex number>,
            "hp": ...,
            "attack": ...,
            "defense": ...,
            "special_attack": ...,
            "special_defense": ...,
            "speed": ...
        }

    Gen 1 uses a single `special` stat instead:
        "stats": {
            "generation": <gen>,
            "number": <pokedex number>,
            "hp": ...,
            "attack": ...,
            "defense": ...,
            "special": ...,
            "speed": ...
        }
    """
    raw_stats = data.get("stats", {})

    # Gen 1 uses a single `special` stat; Gen 2+ uses the split
    # special-attack / special-defense.
    if generation == 1:
        data["stats"] = {
            "generation": generation,
            "number": number,
            "hp": raw_stats.get("hp", 0),
            "attack": raw_stats.get("attack", 0),
            "defense": raw_stats.get("defense", 0),
            "special": raw_stats.get("special", 0),
            "speed": raw_stats.get("speed", 0),
        }
    else:
        data["stats"] = {
            "generation": generation,
            "number": number,
            "hp": raw_stats.get("hp", 0),
            "attack": raw_stats.get("attack", 0),
            "defense": raw_stats.get("defense", 0),
            "special_attack": raw_stats.get("special_attack", 0),
            "special_defense": raw_stats.get("special_defense", 0),
            "speed": raw_stats.get("speed", 0),
        }


def _save_pokemon_gen_data(
    pid: int,
    name: str,
    p_dir: Path,
    dir_name: str,
    data: Dict,
    target_generation: int,
) -> None:
    """
    Build the gen-specific data dict and merge it into the single per-Pokemon
    JSON file at ``public/data/pokemon/gen{N}/<NNN-name>/data.json`` under
    ``generations["<N>"]``, where ``N`` is the *native* (introduced) generation
    of the Pokémon (e.g. Bulbasaur → gen1, Chikorita → gen2).  This mirrors
    the gen-folder layout used for type-effectiveness data in
    ``public/data/types/gen{N}/``.  The JSON lives inside the same per-Pokémon
    folder as the sprites.

    If the file already exists (from a previous gen run), the existing
    ``generations`` dict is loaded and updated in place; otherwise a new
    document with ``id``, ``name``, and ``generations`` is created.
    """
    # Build the generation-specific data block
    gen_data = {
        "types": data["types"],
        "stats": data["stats"],
        "height": data["height"],
        "weight": data["weight"],
        "moves": data["moves"],
    }

    # Abilities were introduced in Gen 3; Gen 1 and Gen 2 have none.
    if target_generation >= 3:
        gen_data["abilities"] = data["abilities"]

    gen_data["availability"] = data["availability"]
    gen_data["description"] = data.get("description", "")
    gen_data["is_legendary"] = data.get("is_legendary", False)
    gen_data["is_mythical"] = data.get("is_mythical", False)
    gen_data["is_fully_evolved"] = data.get("is_fully_evolved", False)
    gen_data["requires_trade"] = data.get("requires_trade", False)

    # Determine the native (introduced) generation to know where we *used* to place it.
    # Now we place all Pokémon directly in public/data/pokemon/
    native_gen = get_generation_by_id(pid)
    json_dir = Path("public/data/pokemon") / dir_name
    json_dir.mkdir(parents=True, exist_ok=True)
    json_file = json_dir / "data.json"

    if json_file.exists():
        with open(json_file, "r", encoding="utf-8") as f:
            pokemon_doc = json.load(f)
    else:
        pokemon_doc = {"id": pid, "name": name, "generations": {}}

    pokemon_doc["generations"][str(target_generation)] = gen_data

    with open(json_file, "w", encoding="utf-8") as f:
        json.dump(pokemon_doc, f, indent=2)


def fetch_all_pokemon_sequential(
    base_dir: Path,
    rate_limiter: RateLimiter,
    download_images: bool = True,
    sprite_groups: Optional[Set[str]] = None,
) -> int:
    """
    Fetch ALL Pokémon (IDs 1–1025) one by one, processing each Pokémon for
    ALL 9 generations in a single pass.

    Instead of iterating generation-by-generation (which re-fetches the same
    Pokémon's API data once per generation — up to 9 times for early-gen
    Pokémon), this function iterates through Pokémon in national-dex order
    and fetches each one's raw API data exactly once, then processes all
    9 generations from that single fetch.

    The output is identical to running --generation 1 through --generation 9
    sequentially, but with far fewer API calls (~2 050 instead of ~10 780).
    """
    total = GENERATION_RANGES[9][1]  # 1025

    print(f"\n{'='*60}")
    print(f"Fetching ALL Pokémon (IDs 1 to {total}) — ALL Generations (1-9)")
    print(f"Each Pokémon is fetched once, then processed for all 9 generations")
    print(f"Destination: {base_dir}  (per-Pokemon folders)")
    print(f"{'='*60}\n")

    success_count = 0

    for pid in range(1, total + 1):
        # --- Single API fetch for this Pokémon ---
        raw_data = fetch_raw_pokemon_api_data(pid, rate_limiter)
        if not raw_data:
            print(f"\n✗ Failed to fetch Pokémon #{pid}, skipping")
            continue

        # --- Single species fetch (flavor text, legendary/mythical flags) ---
        species = fetch_species_data(pid, rate_limiter)

        name = raw_data["name"]
        dir_name = f"{pid:03d}-{clean_name(name)}" if pid < 1000 else f"{pid}-{clean_name(name)}"
        native_gen = get_generation_by_id(pid)
        p_dir = base_dir / dir_name
        p_dir.mkdir(parents=True, exist_ok=True)

        # Determine the Pokémon's native generation — we only process
        # generation blocks from the native gen onward.  There's no reason
        # to create gen data for a generation where the Pokémon didn't exist.
        native_gen = get_generation_by_id(pid)

        # --- Download sprites for each generation (native gen onward) ---
        # Universal sprites (standard, artwork, showdown, home) are shared;
        # gen-specific sprites go in their own subdirectories.  Already-
        # downloaded files are skipped by download_single_image().
        if download_images:
            for gen in range(native_gen, 10):
                download_pokemon_assets(pid, p_dir, gen, sprite_groups)

        # --- Process and save gen-specific data (native gen through 9) ---
        # No API calls here — just local data reshaping from the single
        # fetch above.  We skip generations earlier than the Pokémon's
        # native generation because the Pokémon didn't exist yet.
        for gen in range(native_gen, 10):
            data = process_pokemon_for_generation(raw_data, gen)
            if not data:
                continue

            data["types"] = resolve_generation_types(data, gen)
            data["description"] = species.get("description", "")
            data["is_legendary"] = species.get("is_legendary", False)
            data["is_mythical"] = species.get("is_mythical", False)

            _label_stats_with_gen_and_number(data, gen, pid)

            data["availability"] = get_pokemon_availability_for_gen(pid, gen, raw_data=raw_data)
            data["is_fully_evolved"] = is_pokemon_fully_evolved(pid, gen)
            data["requires_trade"] = is_trade_evolution_for_gen(pid, gen)

            data.pop("past_types", None)

            _save_pokemon_gen_data(pid, name, p_dir, dir_name, data, gen)

        success_count += 1
        print_progress_bar(pid, total, f"Progress: {pid}/{total}")

    print(f"\n✓ Successfully fetched {success_count}/{total} Pokémon (all 9 generations)")
    _rebuild_index(base_dir)
    return success_count


def fetch_pokemon_for_generation(
    target_generation: int,
    base_dir: Path,
    rate_limiter: RateLimiter,
    download_images: bool = True,
    sprite_groups: Optional[Set[str]] = None,
) -> int:
    """
    Fetch ALL Pokemon from ID 1 through the target generation's max ID and
    save their gen-correct data into the single per-Pokemon JSON file under
    ``generations["<N>"]``, with sprites in the shared ``sprites/`` directory.
    """
    end_id = GENERATION_RANGES[target_generation][1]
    total = end_id

    print(f"\n{'='*60}")
    print(f"Fetching ALL Pokémon for Generation {target_generation}")
    print(f"IDs 1 to {end_id}  ({total} Total)")
    print(f"Destination: {base_dir}  (per-Pokemon folders)")
    print(f"{'='*60}\n")

    success_count = 0

    for pid in range(1, end_id + 1):
        # Skip Pokémon that don't exist in the target generation yet
        native_gen = get_generation_by_id(pid)
        if target_generation < native_gen:
            continue

        data = fetch_pokemon_data(pid, rate_limiter, target_generation)
        if not data:
            continue

        species = fetch_species_data(pid, rate_limiter)

        name = data["name"]
        dir_name = f"{pid:03d}-{clean_name(name)}" if pid < 1000 else f"{pid}-{clean_name(name)}"
        native_gen = get_generation_by_id(pid)
        p_dir = base_dir / dir_name
        p_dir.mkdir(parents=True, exist_ok=True)

        # Resolve types for the target generation
        data["types"] = resolve_generation_types(data, target_generation)
        data["description"] = species.get("description", "")
        data["is_legendary"] = species.get("is_legendary", False)
        data["is_mythical"] = species.get("is_mythical", False)

        # Label stats with generation and Pokémon number
        _label_stats_with_gen_and_number(data, target_generation, pid)

        # Gen-specific availability (only this generation's games)
        data["availability"] = get_pokemon_availability_for_gen(pid, target_generation, raw_data=data)
        data["is_fully_evolved"] = is_pokemon_fully_evolved(pid, target_generation)
        data["requires_trade"] = is_trade_evolution_for_gen(pid, target_generation)

        if download_images:
            download_pokemon_assets(pid, p_dir, target_generation, sprite_groups)

        # Remove temporary fields before saving
        data.pop("past_types", None)

        # Merge gen-specific data into the single per-Pokemon JSON
        _save_pokemon_gen_data(pid, name, p_dir, dir_name, data, target_generation)

        success_count += 1
        print_progress_bar(pid, total, f"Progress: {pid}/{total}")

    print(f"\n✓ Successfully fetched {success_count}/{total} Pokémon for Gen {target_generation}")
    _rebuild_index(base_dir)
    return success_count


def fetch_pokemon_range_for_gen(
    start_id: int,
    end_id: int,
    target_generation: int,
    base_dir: Path,
    rate_limiter: RateLimiter,
    download_images: bool = True,
    sprite_groups: Optional[Set[str]] = None,
) -> int:
    """
    Fetch a custom range of Pokemon, merging their gen-correct data into the
    single per-Pokemon JSON file under ``generations["<N>"]``.
    Useful for testing or re-fetching specific entries.
    """
    total = end_id - start_id + 1

    print(f"\n{'='*60}")
    print(f"Fetching Pokémon Range #{start_id} to #{end_id} for Generation {target_generation}")
    print(f"Destination: {base_dir}  (per-Pokemon folders)")
    print(f"{'='*60}\n")

    success_count = 0

    for idx, pid in enumerate(range(start_id, end_id + 1), start=1):
        # Skip Pokémon that don't exist in the target generation yet
        native_gen = get_generation_by_id(pid)
        if target_generation < native_gen:
            print(f"\n⏭ Skipping #{pid} (native Gen {native_gen}) — doesn't exist in Gen {target_generation}")
            continue

        data = fetch_pokemon_data(pid, rate_limiter, target_generation)
        if not data:
            continue

        species = fetch_species_data(pid, rate_limiter)

        name = data["name"]
        dir_name = f"{pid:03d}-{clean_name(name)}" if pid < 1000 else f"{pid}-{clean_name(name)}"
        native_gen = get_generation_by_id(pid)
        p_dir = base_dir / dir_name
        p_dir.mkdir(parents=True, exist_ok=True)

        data["types"] = resolve_generation_types(data, target_generation)
        data["description"] = species.get("description", "")
        data["is_legendary"] = species.get("is_legendary", False)
        data["is_mythical"] = species.get("is_mythical", False)

        # Label stats with generation and Pokémon number
        _label_stats_with_gen_and_number(data, target_generation, pid)

        data["availability"] = get_pokemon_availability_for_gen(pid, target_generation, raw_data=data)
        data["is_fully_evolved"] = is_pokemon_fully_evolved(pid, target_generation)
        data["requires_trade"] = is_trade_evolution_for_gen(pid, target_generation)

        if download_images:
            download_pokemon_assets(pid, p_dir, target_generation, sprite_groups)

        data.pop("past_types", None)

        # Merge gen-specific data into the single per-Pokemon JSON
        _save_pokemon_gen_data(pid, name, p_dir, dir_name, data, target_generation)

        success_count += 1
        print_progress_bar(idx, total, f"Progress: {idx}/{total}")

    print(f"\n✓ Successfully fetched {success_count}/{total} Pokémon for Gen {target_generation}")
    _rebuild_index(base_dir)
    return success_count


def _rebuild_index(base_dir: Path) -> None:
    """Rebuild ``index.json`` from all ``data.json`` files in base_dir."""
    if not base_dir.exists():
        return
    data_files = sorted(
        base_dir.glob("*/data.json"),
        key=lambda f: int(f.parent.name.split("-")[0]),
    )
    entries = []
    for df in data_files:
        try:
            with open(df, "r", encoding="utf-8") as f:
                entries.append(json.load(f))
        except Exception as e:
            print(f"  Warning: failed to read {df}: {e}")
    entries.sort(key=lambda p: p["id"])
    index_path = base_dir / "index.json"
    with open(index_path, "w", encoding="utf-8") as f:
        json.dump(entries, f, ensure_ascii=False)
    print(f"  ✓ Rebuilt index: {len(entries)} Pokémon → {index_path}")

_rebuild_all_gen_indices = _rebuild_index
_rebuild_gen_index = lambda base_dir, target_generation=None: _rebuild_index(base_dir)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Fetch Pokémon data and images from PokeAPI into a per-generation folder structure."
    )
    parser.add_argument("--generation", type=int, choices=range(1, 10), help="Fetch ALL Pokémon (1 to gen max) into the Gen N folder")
    parser.add_argument("--all", action="store_true", help="Fetch ALL Pokémon (1-1025) for ALL 9 generations sequentially — each Pokémon fetched once, processed for every generation")
    parser.add_argument("--id", type=int, help="Fetch a single Pokémon by national ID (requires --generation)")
    parser.add_argument("--range", type=int, nargs=2, metavar=("START", "END"), help="Fetch a Pokémon range (requires --generation)")
    parser.add_argument("--no-images", action="store_true", help="Skip downloading sprite images")
    parser.add_argument("--sprites", type=str, default="all", help="Comma-separated sprite groups to fetch (e.g. 'standard,showdown,home,yellow'). Use 'all' (default) for everything. Available: " + ", ".join(AVAILABLE_SPRITE_GROUPS))

    args = parser.parse_args()

    base_output_dir = Path("public/data/pokemon")

    rate_limiter = RateLimiter(max_requests=5, time_window=2.0)
    download_images = not args.no_images

    # Parse sprite groups
    sprite_groups: Optional[Set[str]] = None
    if args.sprites and args.sprites.lower() != "all":
        sprite_groups = set(g.strip() for g in args.sprites.split(","))
        unknown = sprite_groups - set(AVAILABLE_SPRITE_GROUPS)
        if unknown:
            print(f"Error: Unknown sprite group(s): {', '.join(unknown)}")
            print(f"Available groups: {', '.join(AVAILABLE_SPRITE_GROUPS)}")
            return 1

    if args.id:
        if not args.generation:
            print("Error: --id requires --generation to specify the target generation data set.")
            return 1
        fetch_pokemon_range_for_gen(args.id, args.id, args.generation, base_output_dir, rate_limiter, download_images, sprite_groups)

    elif args.range:
        if not args.generation:
            print("Error: --range requires --generation to specify the target generation data set.")
            return 1
        fetch_pokemon_range_for_gen(args.range[0], args.range[1], args.generation, base_output_dir, rate_limiter, download_images, sprite_groups)

    elif args.generation:
        fetch_pokemon_for_generation(args.generation, base_output_dir, rate_limiter, download_images, sprite_groups)

    elif args.all:
        fetch_all_pokemon_sequential(base_output_dir, rate_limiter, download_images, sprite_groups)

    else:
        parser.print_help()
        print("\nNote: Use --generation [1-9], --all, --id [ID] --generation [N], or --range [START END] --generation [N]")
        return 1

    return 0


if __name__ == "__main__":
    exit(main())
