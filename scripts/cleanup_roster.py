#!/usr/bin/env python3
"""
Remove generation blocks from fullRoster.json (and pokemon_index.json if it
exists) that are earlier than a Pokémon's native generation.

Usage:
    python3 scripts/cleanup_roster.py
"""

import json
from pathlib import Path
from utils import get_generation_by_id


def clean_roster(filepath: Path) -> int:
    """Remove pre-native-gen blocks from a roster JSON file. Returns total blocks removed."""
    if not filepath.exists():
        print(f"  {filepath} not found, skipping")
        return 0

    with open(filepath, "r", encoding="utf-8") as f:
        roster = json.load(f)

    total_removed = 0
    for pokemon in roster:
        pid = pokemon["id"]
        native_gen = get_generation_by_id(pid)
        gens = pokemon.get("generations", {})
        to_remove = [g for g in gens if int(g) < native_gen]
        for g in to_remove:
            del gens[g]
            total_removed += 1

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(roster, f, indent=2, ensure_ascii=False)

    print(f"  ✓ {filepath.name}: {len(roster)} Pokémon, {total_removed} invalid gen blocks removed")
    return total_removed


def clean_per_pokemon_dirs(base_dir: Path) -> int:
    """Remove pre-native-gen blocks from individual per-Pokemon JSON files."""
    if not base_dir.exists():
        print(f"  {base_dir} not found, skipping")
        return 0

    total_removed = 0
    count = 0

    for p_dir in sorted(base_dir.iterdir()):
        if not p_dir.is_dir() or p_dir.name.startswith(".") or p_dir.name.startswith("gen"):
            continue

        json_files = list(p_dir.glob("*.json"))
        if not json_files:
            continue

        json_file = json_files[0]
        try:
            with open(json_file, "r", encoding="utf-8") as f:
                pokemon_doc = json.load(f)

            pid = pokemon_doc["id"]
            native_gen = get_generation_by_id(pid)
            gens = pokemon_doc.get("generations", {})
            to_remove = [g for g in gens if int(g) < native_gen]

            if to_remove:
                for g in to_remove:
                    del gens[g]
                    total_removed += 1
                with open(json_file, "w", encoding="utf-8") as f:
                    json.dump(pokemon_doc, f, indent=2, ensure_ascii=False)

            count += 1
        except Exception as e:
            print(f"  ⚠ Error processing {p_dir.name}: {e}")

    print(f"  ✓ {count} per-Pokemon files scanned, {total_removed} invalid gen blocks removed")
    return total_removed


def main():
    print("Cleaning up generation blocks earlier than each Pokémon's native gen...\n")

    total = 0
    total += clean_roster(Path("src/data/fullRoster.json"))
    total += clean_roster(Path("public/data/indices/pokemon_index.json"))
    total += clean_per_pokemon_dirs(Path("public/data/pokemon"))

    print(f"\n✓ Done! Total invalid gen blocks removed: {total}")
    return 0


if __name__ == "__main__":
    exit(main())
