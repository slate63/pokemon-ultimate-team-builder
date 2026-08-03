#!/usr/bin/env python3
"""
Split existing per-Pokemon JSON files (src/data/pokemon/*.json) by generation
into the gen-organized structure used by the app at runtime:

    public/data/pokemon/
    ├── gen1/
    │   ├── 001-bulbasaur.json      # Gen 1 data only
    │   ├── 002-ivysaur.json
    │   ├── ...
    │   └── index.json              # Array of all Gen 1 Pokemon (efficient single fetch)
    ├── gen2/
    │   ├── 001-bulbasaur.json      # Gen 2 data only
    │   ├── 152-chikorita.json
    │   ├── ...
    │   └── index.json
    └── ... (gen3 through gen9)

Each per-gen file keeps the same top-level structure ({ id, name, generations })
but with a single entry under generations["N"].  This lets resolveGen() and
resolvePokemon() work unchanged — they simply find the one available gen.

Usage:
    python3 scripts/split_pokemon_by_gen.py [--src DIR] [--dest DIR]

Defaults:
    --src   src/data/pokemon
    --dest  public/data/pokemon
"""

import argparse
import json
import os
import sys
from pathlib import Path


def pad_id(id: int) -> str:
    """Zero-pad a Pokemon ID to 3 digits (or 4 if >= 1000)."""
    return str(id).zfill(3) if id < 1000 else str(id)


def slugify(name: str) -> str:
    """Convert a Pokemon name to the URL-safe slug used in filenames."""
    return name.lower().replace(" ", "-").replace(".", "")


def main():
    parser = argparse.ArgumentParser(description="Split Pokemon JSONs by generation")
    parser.add_argument("--src", default="src/data/pokemon",
                        help="Source directory with per-Pokemon JSON files")
    parser.add_argument("--dest", default="public/data/pokemon",
                        help="Destination directory for gen-organized files")
    args = parser.parse_args()

    src_dir = Path(args.src)
    dest_dir = Path(args.dest)

    if not src_dir.exists():
        print(f"Error: source directory '{src_dir}' does not exist", file=sys.stderr)
        sys.exit(1)

    # Collect all JSON files, sorted by numeric ID
    json_files = sorted(
        src_dir.glob("*.json"),
        key=lambda f: int(f.stem.split("-")[0])
    )

    if not json_files:
        print(f"Error: no JSON files found in '{src_dir}'", file=sys.stderr)
        sys.exit(1)

    print(f"Found {len(json_files)} Pokemon JSON files in {src_dir}")

    # Track per-gen lists for index.json
    gen_indices: dict[int, list[dict]] = {g: [] for g in range(1, 10)}
    gen_counts: dict[int, int] = {g: 0 for g in range(1, 10)}

    for jf in json_files:
        with open(jf, "r", encoding="utf-8") as f:
            data = json.load(f)

        pid = data["id"]
        name = data["name"]
        slug = slugify(name)
        padded = pad_id(pid)
        filename = f"{padded}-{slug}.json"

        generations = data.get("generations", {})

        for gen_str, gen_data in sorted(generations.items(), key=lambda x: int(x[0])):
            gen = int(gen_str)
            if gen < 1 or gen > 9:
                print(f"  Warning: skipping invalid gen {gen} for {name}")
                continue

            # Build the per-gen Pokemon object — same structure but only one gen entry
            per_gen_obj = {
                "id": pid,
                "name": name,
                "generations": {
                    gen_str: gen_data
                }
            }

            # Preserve sprite metadata if present
            for key in ("game_sprites", "sprite_info"):
                if key in data:
                    per_gen_obj[key] = data[key]

            # Write individual file
            gen_dir = dest_dir / f"gen{gen}"
            gen_dir.mkdir(parents=True, exist_ok=True)
            out_path = gen_dir / filename
            with open(out_path, "w", encoding="utf-8") as f:
                json.dump(per_gen_obj, f, indent=2, ensure_ascii=False)
                f.write("\n")

            gen_indices[gen].append(per_gen_obj)
            gen_counts[gen] += 1

    # Write index.json per gen
    for gen in range(1, 10):
        gen_dir = dest_dir / f"gen{gen}"
        gen_dir.mkdir(parents=True, exist_ok=True)

        # Sort by id for deterministic output
        gen_indices[gen].sort(key=lambda p: p["id"])

        index_path = gen_dir / "index.json"
        with open(index_path, "w", encoding="utf-8") as f:
            json.dump(gen_indices[gen], f, ensure_ascii=False)
            f.write("\n")

        print(f"  gen{gen}: {gen_counts[gen]} Pokemon → {index_path}")

    total = sum(gen_counts.values())
    print(f"\nDone! {total} per-gen Pokemon files written across 9 generations.")


if __name__ == "__main__":
    main()
