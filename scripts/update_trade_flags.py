#!/usr/bin/env python3
"""
Patch existing Pokemon JSON files with the per-generation `requires_trade` field
without re-running full PokeAPI fetch pipelines.
"""

import json
import sys
from pathlib import Path
from availability import is_trade_evolution_for_gen

BASE_DIR = Path(__file__).resolve().parent.parent

def patch_json_data():
    patched_count = 0
    print("⚡ Patching requires_trade into dataset files...")

    # 1. Update src/data/fullRoster.json
    roster_path = BASE_DIR / "src" / "data" / "fullRoster.json"
    if roster_path.exists():
        with open(roster_path, "r", encoding="utf-8") as f:
            roster = json.load(f)

        for p in roster:
            pid = p.get("id")
            if not pid:
                continue
            gens = p.get("generations", {})
            for gen_str, gdata in gens.items():
                try:
                    gen_num = int(gen_str)
                    gdata["requires_trade"] = is_trade_evolution_for_gen(pid, gen_num)
                except ValueError:
                    pass

        with open(roster_path, "w", encoding="utf-8") as f:
            json.dump(roster, f, indent=2)
        print(f"  ✓ Updated {len(roster)} entries in {roster_path.relative_to(BASE_DIR)}")

    # 2. Update public/data/pokemon/*/data.json
    pokemon_dir = BASE_DIR / "public" / "data" / "pokemon"
    if pokemon_dir.exists():
        p_dirs = [d for d in pokemon_dir.iterdir() if d.is_dir()]
        for p_dir in p_dirs:
            data_file = p_dir / "data.json"
            if not data_file.exists():
                continue
            with open(data_file, "r", encoding="utf-8") as f:
                pdata = json.load(f)

            pid = pdata.get("id")
            if not pid:
                continue

            gens = pdata.get("generations", {})
            for gen_str, gdata in gens.items():
                try:
                    gen_num = int(gen_str)
                    gdata["requires_trade"] = is_trade_evolution_for_gen(pid, gen_num)
                except ValueError:
                    pass

            with open(data_file, "w", encoding="utf-8") as f:
                json.dump(pdata, f, indent=2)
            patched_count += 1

        print(f"  ✓ Updated {patched_count} Pokemon JSON files in {pokemon_dir.relative_to(BASE_DIR)}")

    # 3. Update public/data/indices/pokemon_index.json
    index_path = BASE_DIR / "public" / "data" / "indices" / "pokemon_index.json"
    if index_path.exists():
        with open(index_path, "r", encoding="utf-8") as f:
            idx = json.load(f)

        for item in idx:
            pid = item.get("id")
            gen_num = item.get("generation", 1)
            if pid:
                item["requires_trade"] = is_trade_evolution_for_gen(pid, gen_num)

        with open(index_path, "w", encoding="utf-8") as f:
            json.dump(idx, f, indent=2)
        print(f"  ✓ Updated {len(idx)} entries in {index_path.relative_to(BASE_DIR)}")

    # 4. Update public/api/v1/pokemon/*.json and index.json
    api_dir = BASE_DIR / "public" / "api" / "v1" / "pokemon"
    if api_dir.exists():
        api_files = [f for f in api_dir.iterdir() if f.name.endswith(".json")]
        for af in api_files:
            if af.name == "index.json":
                continue
            with open(af, "r", encoding="utf-8") as f:
                apidata = json.load(f)
            pid = apidata.get("id")
            if not pid:
                continue
            gens = apidata.get("generations", {})
            for gen_str, gdata in gens.items():
                try:
                    gen_num = int(gen_str)
                    gdata["requires_trade"] = is_trade_evolution_for_gen(pid, gen_num)
                except ValueError:
                    pass

            with open(af, "w", encoding="utf-8") as f:
                json.dump(apidata, f, indent=2)

        idx_file = api_dir / "index.json"
        if idx_file.exists():
            with open(idx_file, "r", encoding="utf-8") as f:
                api_idx = json.load(f)
            for item in api_idx:
                pid = item.get("id")
                gen_num = item.get("generation", 1)
                if pid:
                    item["requires_trade"] = is_trade_evolution_for_gen(pid, gen_num)
            with open(idx_file, "w", encoding="utf-8") as f:
                json.dump(api_idx, f, indent=2)

        print(f"  ✓ Updated API files in {api_dir.relative_to(BASE_DIR)}")

    print("✅ All dataset files successfully patched!")

if __name__ == "__main__":
    patch_json_data()
