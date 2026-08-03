#!/usr/bin/env python3
import json
from pathlib import Path

ROSTER_PATH = Path("src/data/fullRoster.json")
POKEMON_DIR = Path("public/data/pokemon")

def main():
    if not ROSTER_PATH.exists():
        print("fullRoster.json not found. Run fetch_version_sprites.py first.")
        return

    with open(ROSTER_PATH, "r", encoding="utf-8") as f:
        roster = json.load(f)

    # Map of id -> sprite data
    sprite_map = {}
    for p in roster:
        pid = p["id"]
        sprite_map[pid] = {
            "game_sprites": p.get("game_sprites", {}),
            "sprite_info": p.get("sprite_info", {}),
            "sprite_refs": p.get("sprite_refs", {}),
            "sprite": p.get("sprite"),
            "sprite_shiny": p.get("sprite_shiny"),
            "back_sprite": p.get("back_sprite"),
            "artwork": p.get("artwork"),
            "showdown_sprite": p.get("showdown_sprite"),
            "showdown_sprite_shiny": p.get("showdown_sprite_shiny"),
            "home_sprite": p.get("home_sprite"),
            "home_sprite_shiny": p.get("home_sprite_shiny"),
        }

    updated = 0
    # Update individual data.json
    for p_dir in POKEMON_DIR.iterdir():
        if not p_dir.is_dir():
            continue
        data_json = p_dir / "data.json"
        if not data_json.exists():
            continue
        
        with open(data_json, "r", encoding="utf-8") as f:
            data = json.load(f)
            
        pid = data.get("id")
        if pid in sprite_map:
            # Sync all sprite metadata directly to root of the data block
            for k, v in sprite_map[pid].items():
                if v is not None:
                    data[k] = v
            
            with open(data_json, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
            updated += 1

    print(f"Synced sprite data to {updated} individual files.")

if __name__ == "__main__":
    main()
