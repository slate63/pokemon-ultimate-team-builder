import argparse
import json
from pathlib import Path
import urllib.request
import urllib.error
import ssl
from typing import Dict, List, Optional
from rate_limiter import RateLimiter

BASE_URL = "https://pokeapi.co/api/v2/move"

HEADERS = {
    "User-Agent": "Mozilla/5.0"
}
SSL_CONTEXT = ssl._create_unverified_context()

GENERATION_RANGES = {
    1: (1, 165),
    2: (166, 250),
    3: (251, 354),
    4: (355, 468),
    5: (469, 580),
    6: (581, 672),
    7: (673, 775),
    8: (776, 880),
    9: (881, 1000)
}

def clean_name(name: str) -> str:
    return name.lower().replace(' ', '-').replace('.', '').replace("'", '').replace(':', '')

def get_generation_by_id(move_id: int) -> int:
    for gen, (start, end) in GENERATION_RANGES.items():
        if start <= move_id <= end:
            return gen
    return 9

def http_get_json(url: str) -> Optional[Dict]:
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, context=SSL_CONTEXT, timeout=10) as resp:
            if resp.status == 200:
                return json.loads(resp.read().decode("utf-8"))
    except Exception:
        pass
    return None

def fetch_raw_move_api_data(move_id: int, rate_limiter: RateLimiter) -> Optional[Dict]:
    try:
        rate_limiter.acquire()
        data = http_get_json(f"{BASE_URL}/{move_id}")
        if not data:
            return None
            
        return {
            "id": data["id"],
            "name": data["name"],
            "type": data["type"]["name"],
            "power": data.get("power", 0) or 0,
            "accuracy": data.get("accuracy", 0) or 0,
            "pp": data.get("pp", 0) or 0,
            "priority": data.get("priority", 0) or 0,
            "damage_class": data.get("damage_class", {}).get("name", "physical") if data.get("damage_class") else "physical",
            "past_values": data.get("past_values", [])
        }
    except Exception as e:
        print(f"\n✗ Error fetching move #{move_id}: {e}")
        return None

def process_move_for_generation(raw_data: Dict, target_generation: int) -> Optional[Dict]:
    # Start with current stats
    power = raw_data["power"]
    accuracy = raw_data["accuracy"]
    pp = raw_data["pp"]
    move_type = raw_data["type"]
    
    # PokeAPI's past_values use version_group.
    # Map of version_group names to the generation they were introduced.
    vg_to_gen = {
        "red-blue": 1, "yellow": 1,
        "gold-silver": 2, "crystal": 2,
        "ruby-sapphire": 3, "emerald": 3, "firered-leafgreen": 3,
        "diamond-pearl": 4, "platinum": 4, "heartgold-soulsilver": 4,
        "black-white": 5, "black-2-white-2": 5,
        "x-y": 6, "omega-ruby-alpha-sapphire": 6,
        "sun-moon": 7, "ultra-sun-ultra-moon": 7,
        "sword-shield": 8, "brilliant-diamond-shining-pearl": 8, "legends-arceus": 8,
        "scarlet-violet": 9
    }
    
    # We need to find the past_value entry that applies to the target generation.
    # A past_value entry describes the *last* version group where those old stats applied.
    # So if target_generation <= vg_gen, those old stats apply!
    best_vg_gen = None
    best_past_value = None
    
    for pv in raw_data.get("past_values", []):
        vg_name = pv.get("version_group", {}).get("name", "")
        vg_gen = vg_to_gen.get(vg_name)
        if vg_gen is None:
            continue
            
        if target_generation <= vg_gen:
            if best_vg_gen is None or vg_gen < best_vg_gen:
                best_vg_gen = vg_gen
                best_past_value = pv
                
    if best_past_value:
        if best_past_value.get("power") is not None:
            power = best_past_value["power"]
        if best_past_value.get("accuracy") is not None:
            accuracy = best_past_value["accuracy"]
        if best_past_value.get("pp") is not None:
            pp = best_past_value["pp"]
        if best_past_value.get("type") is not None:
            move_type = best_past_value["type"]["name"]
            
    return {
        "id": raw_data["id"],
        "name": raw_data["name"],
        "type": move_type,
        "power": power,
        "accuracy": accuracy,
        "pp": pp,
        "priority": raw_data["priority"],
        "damage_class": raw_data["damage_class"]
    }

def print_progress_bar(current: int, total: int, prefix: str = "", suffix: str = "", length: int = 40) -> None:
    percent = current / total if total > 0 else 1.0
    filled_length = int(length * percent)
    bar = '█' * filled_length + '░' * (length - filled_length)
    print(f'\r{prefix} |{bar}| {percent:.1%} {suffix}', end='', flush=True)
    if current == total:
        print()

def _save_move_gen_data(move_id: int, name: str, dir_name: str, data: Dict, target_generation: int, base_dir: Path) -> None:
    json_dir = base_dir / dir_name
    json_dir.mkdir(parents=True, exist_ok=True)
    json_file = json_dir / "data.json"
    
    if json_file.exists():
        with open(json_file, "r", encoding="utf-8") as f:
            doc = json.load(f)
    else:
        doc = {"id": move_id, "name": name, "generations": {}}
        
    doc["generations"][str(target_generation)] = data
    
    with open(json_file, "w", encoding="utf-8") as f:
        json.dump(doc, f, indent=2)

def _rebuild_index(base_dir: Path) -> None:
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
    print(f"  ✓ Rebuilt index: {len(entries)} Moves → {index_path}")

def fetch_all_moves_sequential(base_dir: Path, rate_limiter: RateLimiter) -> int:
    total = GENERATION_RANGES[9][1]
    print(f"\n{'='*60}")
    print(f"Fetching ALL Moves (IDs 1 to {total}) — ALL Generations (1-9)")
    print(f"Destination: {base_dir} (per-Move folders)")
    print(f"{'='*60}\n")
    
    success_count = 0
    for move_id in range(1, total + 1):
        raw_data = fetch_raw_move_api_data(move_id, rate_limiter)
        if not raw_data:
            print(f"\n✗ Failed to fetch Move #{move_id}, skipping")
            continue
            
        name = raw_data["name"]
        dir_name = f"{move_id:03d}-{clean_name(name)}"
        native_gen = get_generation_by_id(move_id)
        
        for gen in range(native_gen, 10):
            data = process_move_for_generation(raw_data, gen)
            if not data:
                continue
            _save_move_gen_data(move_id, name, dir_name, data, gen, base_dir)
            
        success_count += 1
        print_progress_bar(move_id, total, f"Progress: {move_id}/{total}")
        
    print(f"\n✓ Successfully fetched {success_count}/{total} Moves")
    _rebuild_index(base_dir)
    return success_count

def fetch_moves_for_generation(target_generation: int, base_dir: Path, rate_limiter: RateLimiter) -> int:
    end_id = GENERATION_RANGES[target_generation][1]
    print(f"\n{'='*60}")
    print(f"Fetching ALL Moves for Generation {target_generation}")
    print(f"IDs 1 to {end_id}")
    print(f"Destination: {base_dir} (per-Move folders)")
    print(f"{'='*60}\n")
    
    success_count = 0
    for move_id in range(1, end_id + 1):
        native_gen = get_generation_by_id(move_id)
        if target_generation < native_gen:
            continue
            
        raw_data = fetch_raw_move_api_data(move_id, rate_limiter)
        if not raw_data:
            continue
            
        name = raw_data["name"]
        dir_name = f"{move_id:03d}-{clean_name(name)}"
        
        data = process_move_for_generation(raw_data, target_generation)
        if data:
            _save_move_gen_data(move_id, name, dir_name, data, target_generation, base_dir)
            
        success_count += 1
        print_progress_bar(move_id, end_id, f"Progress: {move_id}/{end_id}")
        
    print(f"\n✓ Successfully fetched {success_count}/{end_id} Moves for Gen {target_generation}")
    _rebuild_index(base_dir)
    return success_count

def main():
    parser = argparse.ArgumentParser(description="Fetch Pokemon move data into a per-move folder structure.")
    parser.add_argument("--generation", type=int, choices=range(1, 10), help="Fetch ALL moves up to the Gen N folder")
    parser.add_argument("--all", action="store_true", help="Fetch ALL moves for ALL generations")
    args = parser.parse_args()
    
    rate_limiter = RateLimiter(max_requests=5, time_window=2.0)
    base_output_dir = Path("public/data/moves")
    
    if args.all:
        fetch_all_moves_sequential(base_output_dir, rate_limiter)
    elif args.generation:
        fetch_moves_for_generation(args.generation, base_output_dir, rate_limiter)
    else:
        parser.print_help()
        return 1
    return 0

if __name__ == "__main__":
    exit(main())