#!/usr/bin/env python3
"""
Add sprite_info metadata and populate game_sprites in fullRoster.json.

This script does NOT hit the PokeAPI — it uses the deterministic mapping
from GAME_VERSION_MAP (from sprite_constants.py) to compute:

  1. sprite_info  — per-game-version metadata describing which sprite
     set/style is used, the local directory, format, animation flag, etc.

  2. game_sprites — per-game-version sprite paths (front_default,
     front_shiny, back_default, back_shiny), plus animated variants for Gen 5.

Usage:
    python3 scripts/add_sprite_info.py
"""

import json
from pathlib import Path
from typing import Dict

from utils import get_generation_by_id, build_dir_name
from sprite_constants import GAME_VERSION_MAP, GAME_DISPLAY_NAMES, STANDARD_FALLBACK_VERSIONS, GEN5_GAMES

ROSTER_PATH = Path("src/data/fullRoster.json")


def build_local_path(gen_num: int, dir_name: str, sprite_dir: str, variant: str, ext: str) -> str:
    return f"./data/pokemon/{dir_name}/sprites/{sprite_dir}/{variant}.{ext}"


def build_standard_path(gen_num: int, dir_name: str, variant: str) -> str:
    return f"./data/pokemon/{dir_name}/sprites/standard/{variant}.png"


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


def build_game_sprites(gen_num: int, dir_name: str) -> Dict[str, Dict[str, str]]:
    """Build per-game-version sprite path entries."""
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
                for variant in ["front_default", "front_shiny", "back_default", "back_shiny"]:
                    entry[variant] = build_standard_path(game_gen_num, dir_name, variant)
                sprite_key_cache[cache_key] = entry
            game_sprites[game_name] = sprite_key_cache[cache_key].copy()
        else:
            cache_key = f"{gen_key}_{sprite_key}_{sprite_dir}"
            if cache_key not in sprite_key_cache:
                entry = {}
                for variant in ["front_default", "front_shiny", "back_default", "back_shiny"]:
                    entry[variant] = build_local_path(game_gen_num, dir_name, sprite_dir, variant, "png")

                if gen_key == "generation-v":
                    for variant in ["front_default", "front_shiny", "back_default", "back_shiny"]:
                        entry[f"{variant}_animated"] = build_local_path(
                            game_gen_num, dir_name, "black-white-animated", variant, "gif"
                        )

                sprite_key_cache[cache_key] = entry
            game_sprites[game_name] = sprite_key_cache[cache_key].copy()

    return game_sprites


def build_sprite_refs(gen_num: int, dir_name: str) -> Dict[str, str]:
    """Build top-level sprite references based on the new local structure."""
    base = f"./data/pokemon/{dir_name}/sprites"
    return {
        "sprite": f"{base}/standard/front_default.png",
        "sprite_shiny": f"{base}/standard/front_shiny.png",
        "back_sprite": f"{base}/standard/back_default.png",
        "artwork": f"{base}/artwork/artwork.png",
        "showdown_sprite": f"{base}/showdown/front_default.gif",
        "showdown_sprite_shiny": f"{base}/showdown/front_shiny.gif",
        "home_sprite": f"{base}/home/front_default.png",
        "home_sprite_shiny": f"{base}/home/front_shiny.png",
    }


def main():
    print(f"Loading {ROSTER_PATH}...")
    with open(ROSTER_PATH, "r", encoding="utf-8") as f:
        roster = json.load(f)

    print(f"Loaded {len(roster)} Pokémon entries")

    updated = 0
    for entry in roster:
        pid = entry["id"]
        name = entry["name"]
        gen_num = get_generation_by_id(pid)
        dir_name = build_dir_name(pid, name)

        sprite_info = build_sprite_info(gen_num, dir_name)
        entry["sprite_info"] = sprite_info

        entry["game_sprites"] = build_game_sprites(gen_num, dir_name)

        refs = build_sprite_refs(gen_num, dir_name)
        entry["sprite"] = refs["sprite"]
        entry["sprite_shiny"] = refs["sprite_shiny"]
        entry["back_sprite"] = refs["back_sprite"]
        entry["artwork"] = refs["artwork"]
        entry["showdown_sprite"] = refs["showdown_sprite"]
        entry["showdown_sprite_shiny"] = refs["showdown_sprite_shiny"]
        entry["home_sprite"] = refs["home_sprite"]
        entry["home_sprite_shiny"] = refs["home_sprite_shiny"]

        updated += 1

    print(f"Updated {updated} entries with sprite_info + game_sprites + sprite refs")

    print(f"Writing {ROSTER_PATH}...")
    with open(ROSTER_PATH, "w", encoding="utf-8") as f:
        json.dump(roster, f, indent=2, ensure_ascii=False)

    print("✓ Done!")

    sample = roster[0]
    print(f"\nSample (#{sample['id']} {sample['name']}):")
    print(f"  sprite_info versions: {len(sample['sprite_info'])}")
    print(f"  game_sprites versions: {len(sample['game_sprites'])}")
    for k in list(sample['sprite_info'].keys())[:3]:
        si = sample['sprite_info'][k]
        print(f"  sprite_info['{k}']: style={si['sprite_style']}, dir={si['sprite_dir']}, "
              f"gen={si['gen_num']}, format={si['format']}, animated={si['animated']}, "
              f"source={si['source']}")


if __name__ == "__main__":
    main()
