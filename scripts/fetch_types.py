#!/usr/bin/env python3
"""
Fetch type-effectiveness data from PokeAPI and save it organized by generation.

PokeAPI's ``/api/v2/type/{name}`` endpoint returns the *current* damage
relations (Generation VI+) plus a ``past_damage_relations`` list that records
how the type interacted with other types in previous generations.  This script
reconstructs the type-effectiveness chart as it existed in each generation
(1-9) and writes one JSON file per generation::

    public/data/types/gen{N}/types.json

A combined "overall" file (latest generation, all 18 types) is also written to
the legacy location for backwards compatibility::

    public/data/types/types.json

Only the 18 standard battle types are included; ``stellar`` and ``unknown``
are excluded because they are not real type-chart entries.

Usage::

    python3 fetch_types.py                 # fetch all generations (default)
    python3 fetch_types.py --all           # fetch all generations
    python3 fetch_types.py --generation 1  # fetch a single generation
"""

import argparse
import json
import requests
from pathlib import Path
from typing import Dict, List, Optional

from rate_limiter import RateLimiter


BASE_URL = "https://pokeapi.co/api/v2/type"
BASE_OUTPUT_DIR = Path("public/data/types")

ROMAN_NUMERALS = {
    1: "i", 2: "ii", 3: "iii", 4: "iv", 5: "v",
    6: "vi", 7: "vii", 8: "viii", 9: "ix",
}
GEN_FROM_ROMAN = {v: k for k, v in ROMAN_NUMERALS.items()}

# The 18 standard battle types (excludes "stellar" and "unknown").
STANDARD_TYPES = {
    "normal", "fire", "water", "grass", "electric", "ice",
    "fighting", "poison", "ground", "flying", "psychic", "bug",
    "rock", "ghost", "dragon", "steel", "dark", "fairy",
}


def print_progress_bar(current: int, total: int, prefix: str = "",
                       suffix: str = "", length: int = 50) -> None:
    percent = current / total
    filled = int(length * percent)
    bar = '█' * filled + '░' * (length - filled)
    print(f'\r{prefix} |{bar}| {percent:.1%} {suffix}', end='')
    if current == total:
        print()


def extract_relations(dr: dict) -> dict:
    """Convert a PokeAPI damage_relations block to the flat list format."""
    return {
        "double_damage_from": [t["name"] for t in dr.get("double_damage_from", [])],
        "double_damage_to": [t["name"] for t in dr.get("double_damage_to", [])],
        "half_damage_from": [t["name"] for t in dr.get("half_damage_from", [])],
        "half_damage_to": [t["name"] for t in dr.get("half_damage_to", [])],
        "no_damage_from": [t["name"] for t in dr.get("no_damage_from", [])],
        "no_damage_to": [t["name"] for t in dr.get("no_damage_to", [])],
    }


def relations_for_gen(type_detail: dict, gen: int) -> dict:
    """
    Return the damage_relations block that was in effect during ``gen``.

    PokeAPI stores historical relations in ``past_damage_relations``, where
    each entry's ``generation`` field marks the *last* generation those
    relations applied.  The current ``damage_relations`` block applies from the
    generation after the most recent past entry through Gen 9.

    To find the relations for a target ``gen`` we pick the past entry with the
    smallest generation number ``>= gen``; if none qualifies we fall back to
    the current ``damage_relations``.
    """
    past = type_detail.get("past_damage_relations") or []
    past_entries: List[tuple] = []
    for entry in past:
        gen_name = entry.get("generation", {}).get("name", "")
        gen_num = GEN_FROM_ROMAN.get(gen_name.replace("generation-", ""))
        if gen_num is not None:
            past_entries.append((gen_num, entry.get("damage_relations", {})))
    past_entries.sort(key=lambda x: x[0])

    chosen_dr = None
    for past_gen, dr in past_entries:
        if past_gen >= gen:
            chosen_dr = dr
            break

    if chosen_dr is None:
        chosen_dr = type_detail.get("damage_relations", {})

    return extract_relations(chosen_dr)


def introduction_gen(type_detail: dict) -> int:
    """Return the generation number a type was introduced in."""
    gen_name = type_detail.get("generation", {}).get("name", "generation-i")
    return GEN_FROM_ROMAN.get(gen_name.replace("generation-", ""), 1)


def fetch_all_type_details(rate_limiter: RateLimiter) -> Dict[str, dict]:
    """
    Fetch the full detail for every standard type from PokeAPI.

    Returns ``{type_name: type_detail_dict}``.
    """
    print("Fetching type list...")
    rate_limiter.acquire()
    resp = requests.get(BASE_URL)
    resp.raise_for_status()
    types_list = resp.json()["results"]

    standard = [t for t in types_list if t["name"] in STANDARD_TYPES]

    details: Dict[str, dict] = {}
    total = len(standard)
    for i, t in enumerate(standard, 1):
        name = t["name"]
        try:
            rate_limiter.acquire()
            r = requests.get(f"{BASE_URL}/{name}")
            r.raise_for_status()
            details[name] = r.json()
            print_progress_bar(i, total, prefix="Fetching types", suffix=name)
        except Exception as e:
            print(f"\n✗ Error fetching type {name}: {e}")

    return details


def build_all_generations_chart(type_details: Dict[str, dict]) -> List[dict]:
    """
    Build the type-effectiveness chart for all generations, matching the Pokemon format.
    Returns a list of dicts:
    [
      {
        "name": "normal",
        "generations": {
          "1": { ...damage relations... },
          "2": { ...damage relations... },
          ...
        }
      },
      ...
    ]
    """
    results_map = {}
    
    for gen in range(1, 10):
        # Valid types for this generation
        valid_types = {
            name for name, detail in type_details.items()
            if introduction_gen(detail) <= gen
        }
        
        for name in valid_types:
            if name not in results_map:
                results_map[name] = {
                    "name": name,
                    "generations": {}
                }
            
            raw_relations = relations_for_gen(type_details[name], gen)
            filtered_relations = {}
            for relation_type, targets in raw_relations.items():
                filtered_relations[relation_type] = [t for t in targets if t in valid_types]
                
            results_map[name]["generations"][str(gen)] = filtered_relations
            
    # Convert map to sorted list
    results_list = [results_map[name] for name in sorted(results_map.keys())]
    return results_list


def write_individual_files(data: List[dict]) -> None:
    """Write each type to its own JSON file."""
    BASE_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for type_data in data:
        name = type_data["name"]
        out_file = BASE_OUTPUT_DIR / f"{name}.json"
        with open(out_file, "w") as f:
            json.dump(type_data, f, indent=2)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Fetch type-effectiveness data organized by generation."
    )
    # Removing single-generation fetching since we want a single combined file
    # but keeping the parser in case it's called with arguments
    parser.add_argument("--generation", type=int, choices=range(1, 10),
                        help=argparse.SUPPRESS)
    parser.add_argument("--all", action="store_true",
                        help=argparse.SUPPRESS)
    args = parser.parse_args()

    rate_limiter = RateLimiter()

    type_details = fetch_all_type_details(rate_limiter)
    print(f"\nFetched {len(type_details)} standard types.")

    all_charts = build_all_generations_chart(type_details)

    write_individual_files(all_charts)
    print(f"✓ Individual files written to {BASE_OUTPUT_DIR}")

    print("\nDone!")


if __name__ == "__main__":
    main()
