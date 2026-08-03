#!/usr/bin/env python3
"""
Fetch ALL Pokémon (1–1025) from PokeAPI and build fullRoster.json with:
  - Generation data (types, stats, moves, availability, description, etc.)
  - Per-game-version sprite data (game_sprites keyed by individual game version)

Only uses PokeAPI REST APIs:
  - /api/v2/pokemon/{id}           (types, stats, height, weight, abilities, moves, sprites)
  - /api/v2/pokemon-species/{id}  (description, is_legendary, is_mythical)
  - /api/v2/evolution-chain/{id}  (is_fully_evolved via evolution data)

Usage:
    python3 scripts/fetch_version_sprites.py
"""

import json
import sys
import time
import os
import urllib.request
import urllib.error
from pathlib import Path
from typing import Dict, List, Optional, Any, Set, Tuple

from utils import (
    get_generation_by_id,
    clean_name,
    build_dir_name,
    print_progress_bar,
)
from pokemon_constants import (
    GENERATION_RANGES,
    GEN_VERSION_GROUPS,
    GEN_GAMES,
    NOT_FULLY_EVOLVED,
    LATER_EVOLUTIONS,
    is_pokemon_fully_evolved,
)
from sprite_constants import (
    GAME_VERSION_MAP,
    STANDARD_VARIANTS,
    GEN5_GAMES,
    GAME_DISPLAY_NAMES,
)
from availability import (
    get_pokemon_availability,
    get_pokemon_availability_for_gen,
    resolve_generation_types,
)

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

POKEAPI_BASE = "https://pokeapi.co/api/v2"
USER_AGENT = "PokemonTeamBuilder/1.0"
RATE_LIMIT_DELAY = 0.0 if os.environ.get("IGNORE_RATE_LIMIT") == "1" else 0.35
MAX_RETRIES = 3
RETRY_DELAY = 2.0

ROSTER_PATH = Path("src/data/fullRoster.json")
TOTAL_POKEMON = 1025


def api_fetch(endpoint: str) -> Optional[dict]:
    """Fetch JSON from PokeAPI with rate limiting and retry logic."""
    url = f"{POKEAPI_BASE}/{endpoint.lstrip('/')}"
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})

    for attempt in range(MAX_RETRIES):
        try:
            if RATE_LIMIT_DELAY > 0:
                time.sleep(RATE_LIMIT_DELAY)
            with urllib.request.urlopen(req, timeout=15) as resp:
                if resp.status == 200:
                    return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return None
            if attempt < MAX_RETRIES - 1:
                time.sleep(RETRY_DELAY * (attempt + 1))
        except Exception:
            if attempt < MAX_RETRIES - 1:
                time.sleep(RETRY_DELAY * (attempt + 1))
    return None


def get_ext(url: str) -> str:
    return "gif" if url.endswith(".gif") else "png"


def build_local_path(gen_num: int, dir_name: str, sprite_dir: str, variant: str, ext: str) -> str:
    return f"./data/pokemon/{dir_name}/sprites/{sprite_dir}/{variant}.{ext}"


def build_standard_path(gen_num: int, dir_name: str, variant: str) -> str:
    return f"./data/pokemon/{dir_name}/sprites/standard/{variant}.png"


# Alias for backward compatibility
get_availability_for_gen = get_pokemon_availability_for_gen


# ---------------------------------------------------------------------------
# Sprite extraction
# ---------------------------------------------------------------------------

def build_game_sprites(sprite_data: dict, gen_num: int, dir_name: str) -> Dict[str, Dict[str, str]]:
    """Build per-game-version sprite entries from PokeAPI sprite data."""
    game_sprites: Dict[str, Dict[str, str]] = {}
    sprite_key_cache: Dict[str, Dict[str, str]] = {}

    for game_name, game_info in GAME_VERSION_MAP.items():
        sprite_key = game_info["sprite_key"]
        sprite_dir = game_info["sprite_dir"]
        game_gen_num = game_info["gen_num"]
        gen_key = game_info["gen"]

        if sprite_key is None:
            cache_key = f"standard_{game_gen_num}"
            if cache_key not in sprite_key_cache:
                entry = {}
                for variant in STANDARD_VARIANTS:
                    url = sprite_data.get(variant)
                    if url and isinstance(url, str):
                        entry[variant] = build_standard_path(game_gen_num, dir_name, variant)
                sprite_key_cache[cache_key] = entry
            game_sprites[game_name] = sprite_key_cache[cache_key].copy()
        else:
            cache_key = f"{gen_key}_{sprite_key}_{sprite_dir}"
            if cache_key not in sprite_key_cache:
                entry = {}
                versions = sprite_data.get("versions", {})
                gen_data = versions.get(gen_key, {})
                vg_data = gen_data.get(sprite_key, {})

                if vg_data:
                    for variant in STANDARD_VARIANTS:
                        url = vg_data.get(variant)
                        if url and isinstance(url, str):
                            ext = get_ext(url)
                            entry[variant] = build_local_path(game_gen_num, dir_name, sprite_dir, variant, ext)

                    # Animated sprites for Gen 5
                    if gen_key == "generation-v":
                        animated = vg_data.get("animated", {})
                        if animated:
                            for variant in STANDARD_VARIANTS:
                                url = animated.get(variant)
                                if url and isinstance(url, str):
                                    ext = get_ext(url)
                                    entry[f"{variant}_animated"] = build_local_path(
                                        game_gen_num, dir_name, "black-white-animated", variant, ext
                                    )

                sprite_key_cache[cache_key] = entry
            game_sprites[game_name] = sprite_key_cache[cache_key].copy()

    return game_sprites


def build_sprite_info(gen_num: int, dir_name: str) -> Dict[str, dict]:
    """Build per-game-version sprite metadata."""
    sprite_info: Dict[str, dict] = {}

    for game_name, game_info in GAME_VERSION_MAP.items():
        sprite_key = game_info["sprite_key"]
        sprite_dir = game_info["sprite_dir"]
        game_gen_num = game_info["gen_num"]
        gen_key = game_info["gen"]

        is_standard = sprite_key is None
        is_gen5 = game_gen_num == 5

        fmt = "png"
        if is_standard:
            source = "standard"
            sprite_style = "standard"
            effective_dir = "standard"
        else:
            source = "version"
            sprite_style = sprite_key
            effective_dir = sprite_dir

        sprite_info[game_name] = {
            "sprite_style": sprite_style,
            "sprite_dir": effective_dir,
            "gen_key": gen_key,
            "gen_num": game_gen_num,
            "format": fmt,
            "animated": is_gen5,
            "source": source,
            "display_name": GAME_DISPLAY_NAMES.get(game_name, game_name),
            "has_animated": is_gen5,
        }

        if is_gen5:
            sprite_info[game_name]["animated_style"] = "black-white-animated"
            sprite_info[game_name]["animated_format"] = "gif"

    return sprite_info


def process_pokemon(pid: int) -> Optional[dict]:
    """Fetch all API endpoints for a single Pokémon and build its roster document."""
    pokemon_raw = api_fetch(f"pokemon/{pid}")
    if not pokemon_raw:
        return None

    species_raw = api_fetch(f"pokemon-species/{pid}")
    if not species_raw:
        species_raw = {}

    native_gen = get_generation_by_id(pid)
    name = pokemon_raw["name"]
    dir_name = build_dir_name(pid, name)

    # Extract description
    description = ""
    flavor_entries = species_raw.get("flavor_text_entries", [])
    for fe in flavor_entries:
        if fe.get("language", {}).get("name") == "en":
            description = fe.get("flavor_text", "").replace("\n", " ").replace("\f", " ").replace("\r", " ")
            break

    is_legendary = species_raw.get("is_legendary", False)
    is_mythical = species_raw.get("is_mythical", False)

    # Base types and past types
    base_types = [t["type"]["name"] for t in sorted(pokemon_raw["types"], key=lambda x: x["slot"])]
    past_types_list = pokemon_raw.get("past_types", [])

    # Base stats
    raw_stats = {s["stat"]["name"]: s["base_stat"] for s in pokemon_raw["stats"]}
    base_stats = {
        "hp": raw_stats.get("hp", 0),
        "attack": raw_stats.get("attack", 0),
        "defense": raw_stats.get("defense", 0),
        "special_attack": raw_stats.get("special-attack", 0),
        "special_defense": raw_stats.get("special-defense", 0),
        "speed": raw_stats.get("speed", 0),
    }

    height = pokemon_raw.get("height", 0) / 10.0
    weight = pokemon_raw.get("weight", 0) / 10.0
    abilities = [a["ability"]["name"] for a in sorted(pokemon_raw["abilities"], key=lambda x: x["slot"])]

    # Moves organized by generation
    all_moves_by_gen: Dict[str, List[str]] = {}
    for move_entry in pokemon_raw.get("moves", []):
        move_name = move_entry["move"]["name"]
        for vg_details in move_entry.get("version_group_details", []):
            vg_name = vg_details["version_group"]["name"]
            for gen_num, vg_set in GEN_VERSION_GROUPS.items():
                if vg_name in vg_set and gen_num >= native_gen:
                    gen_key = str(gen_num)
                    if gen_key not in all_moves_by_gen:
                        all_moves_by_gen[gen_key] = []
                    if move_name not in all_moves_by_gen[gen_key]:
                        all_moves_by_gen[gen_key].append(move_name)

    # Build generation blocks (from native_gen through 9)
    generations: Dict[str, dict] = {}
    for gen in range(native_gen, 10):
        gen_str = str(gen)

        # Gen 1 stats special handling
        gen_stats = dict(base_stats)
        if gen == 1:
            gen_stats["special"] = base_stats["special_attack"]
            gen_stats.pop("special_attack", None)
            gen_stats.pop("special_defense", None)
        gen_stats["generation"] = gen
        gen_stats["number"] = pid

        # Resolved types for this gen
        gen_types = resolve_generation_types(pokemon_raw, gen)

        # Availability in this gen's games
        gen_availability = get_pokemon_availability_for_gen(pid, gen, raw_data=pokemon_raw)

        # Moves for this gen
        gen_moves = sorted(all_moves_by_gen.get(gen_str, []))

        # Fully evolved status
        gen_fully_evolved = is_pokemon_fully_evolved(pid, gen)

        generations[gen_str] = {
            "types": gen_types,
            "stats": gen_stats,
            "height": height,
            "weight": weight,
            "abilities": abilities,
            "moves": gen_moves,
            "availability": gen_availability,
            "description": description,
            "is_legendary": is_legendary,
            "is_mythical": is_mythical,
            "is_fully_evolved": gen_fully_evolved,
        }

    sprite_data = pokemon_raw.get("sprites", {})
    game_sprites = build_game_sprites(sprite_data, native_gen, dir_name)
    sprite_info = build_sprite_info(native_gen, dir_name)

    base = f"./data/pokemon/{dir_name}/sprites"
    doc = {
        "id": pid,
        "name": name,
        "generation": native_gen,
        "sprite": f"{base}/standard/front_default.png",
        "sprite_shiny": f"{base}/standard/front_shiny.png",
        "back_sprite": f"{base}/standard/back_default.png",
        "artwork": f"{base}/artwork/artwork.png",
        "showdown_sprite": f"{base}/showdown/front_default.gif",
        "showdown_sprite_shiny": f"{base}/showdown/front_shiny.gif",
        "home_sprite": f"{base}/home/front_default.png",
        "home_sprite_shiny": f"{base}/home/front_shiny.png",
        "generations": generations,
        "game_sprites": game_sprites,
        "sprite_info": sprite_info,
    }

    return doc


def main() -> int:
    print(f"Building fullRoster.json for all {TOTAL_POKEMON} Pokémon...")
    print(f"Destination: {ROSTER_PATH}")
    print(f"Rate limiting: {'DISABLED' if RATE_LIMIT_DELAY == 0 else f'{RATE_LIMIT_DELAY}s per API call'}\n")

    roster = []
    success_count = 0

    for pid in range(1, TOTAL_POKEMON + 1):
        doc = process_pokemon(pid)
        if doc:
            roster.append(doc)
            success_count += 1
        print_progress_bar(pid, TOTAL_POKEMON, f"Progress: {pid}/{TOTAL_POKEMON}")

    ROSTER_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(ROSTER_PATH, "w", encoding="utf-8") as f:
        json.dump(roster, f, indent=2, ensure_ascii=False)

    print(f"\n✓ Successfully built fullRoster.json with {success_count}/{TOTAL_POKEMON} Pokémon!")
    return 0


if __name__ == "__main__":
    exit(main())
