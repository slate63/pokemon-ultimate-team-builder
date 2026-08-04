#!/usr/bin/env python3
"""
Verify Pokémon In-Game Availability

Run this script to verify that Pokémon availability in fullRoster.json matches
true in-game acquirability without requiring trading with another game.

Usage:
    python3 scripts/verify_availability.py
    python3 scripts/verify_availability.py --pokemon bulbasaur
    python3 scripts/verify_availability.py --pokemon 4
"""

import sys
import json
import argparse
from pathlib import Path

# Colors for terminal output
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
CYAN = "\033[96m"
BOLD = "\033[1m"
RESET = "\033[0m"

ROSTER_PATH = Path("src/data/fullRoster.json")

# Core test cases to verify in-game acquirability rules
TEST_CASES = [
    # Gen 1
    (1, "Bulbasaur", "1", {"red", "blue", "yellow"}, "Starters/gifts in Red, Blue, Yellow"),
    (83, "Farfetch'd", "1", {"red", "blue", "yellow"}, "In-game trade in R/B + wild in Yellow"),
    (123, "Scyther", "1", {"red", "yellow"}, "Red exclusive + Yellow wild (NOT in Blue)"),
    (127, "Pinsir", "1", {"blue", "yellow"}, "Blue exclusive + Yellow wild (NOT in Red)"),
    # Gen 2
    (123, "Scyther", "2", {"gold", "silver", "crystal"}, "Bug-Catching Contest at National Park (manual override for missing PokeAPI entries)"),
    (127, "Pinsir", "2", {"gold", "silver", "crystal"}, "Bug-Catching Contest at National Park (manual override for missing PokeAPI entries)"),
    (212, "Scizor", "2", {"gold", "silver", "crystal"}, "Evolves from Scyther via Metal Coat trade (propagated availability)"),

    # Gen 3
    (1, "Bulbasaur", "3", {"firered", "leafgreen"}, "FRLG starters (NOT in Ruby/Sapphire/Emerald)"),
    (4, "Charmander", "3", {"firered", "leafgreen"}, "FRLG starters (NOT in Ruby/Sapphire/Emerald)"),
    (255, "Torchic", "3", {"ruby", "sapphire", "emerald"}, "Hoenn starters (NOT in FireRed/LeafGreen)"),
    (273, "Seedot", "3", {"ruby"}, "Ruby exclusive in Gen 3"),
    (270, "Lotad", "3", {"sapphire"}, "Sapphire exclusive in Gen 3"),

    # Gen 4
    (387, "Turtwig", "4", {"diamond", "pearl", "platinum"}, "Sinnoh starters (NOT in HGSS)"),
    (152, "Chikorita", "4", {"heartgold", "soulsilver"}, "Postgame Steven gift in HGSS (NOT in DP/Pt)"),

    # Gen 6
    (650, "Chespin", "6", {"x", "y"}, "Kalos starters (NOT in ORAS)"),
    (252, "Treecko", "6", {"omega-ruby", "alpha-sapphire"}, "Hoenn starters in ORAS (NOT in XY)"),

    # Gen 9
    (1007, "Koraidon", "9", {"scarlet"}, "Scarlet legendary exclusive"),
    (1008, "Miraidon", "9", {"violet"}, "Violet legendary exclusive"),
]


def load_roster() -> list:
    if not ROSTER_PATH.exists():
        print(f"{RED}Error: {ROSTER_PATH} not found.{RESET}")
        sys.exit(1)
    with open(ROSTER_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def verify_test_cases(roster: list) -> bool:
    by_id = {p["id"]: p for p in roster}
    all_passed = True

    print(f"\n{BOLD}{CYAN}=== Running In-Game Availability Verification Tests ==={RESET}\n")

    for pid, name, gen_str, expected_set, description in TEST_CASES:
        pokemon = by_id.get(pid)
        if not pokemon:
            print(f"{RED}FAIL{RESET}: Pokémon ID {pid} ({name}) not found in roster.")
            all_passed = False
            continue

        gen_data = pokemon.get("generations", {}).get(gen_str, {})
        actual_list = gen_data.get("availability", [])
        actual_set = set(actual_list)

        passed = actual_set == expected_set
        if not passed:
            all_passed = False
            status = f"{RED}FAIL{RESET}"
        else:
            status = f"{GREEN}PASS{RESET}"

        print(f"[{status}] {BOLD}{name}{RESET} (Gen {gen_str}) — {description}")
        print(f"       Expected: {sorted(list(expected_set))}")
        print(f"       Actual:   {actual_list}\n")

    return all_passed


def inspect_pokemon(roster: list, query: str):
    by_id_or_name = {}
    for p in roster:
        by_id_or_name[str(p["id"])] = p
        by_id_or_name[p["name"].lower()] = p

    key = query.strip().lower()
    pokemon = by_id_or_name.get(key)
    if not pokemon:
        print(f"{RED}Pokémon '{query}' not found.{RESET}")
        return

    print(f"\n{BOLD}{CYAN}=== Availability for {pokemon['name'].capitalize()} (ID: {pokemon['id']}) ==={RESET}\n")
    gens = pokemon.get("generations", {})
    for gen_str in sorted(gens.keys(), key=int):
        gen_data = gens[gen_str]
        avail = gen_data.get("availability", [])
        print(f"  Gen {gen_str:2s}: {avail if avail else 'None (Not acquirable in-game)'}")
    print()


def main():
    parser = argparse.ArgumentParser(description="Verify Pokémon in-game availability logic.")
    parser.add_argument("--pokemon", "-p", help="Inspect availability for a specific Pokémon name or ID")
    args = parser.parse_args()

    roster = load_roster()

    if args.pokemon:
        inspect_pokemon(roster, args.pokemon)
    else:
        all_passed = verify_test_cases(roster)
        if all_passed:
            print(f"{BOLD}{GREEN}✓ All availability test cases passed successfully!{RESET}\n")
        else:
            print(f"{BOLD}{RED}✗ Some test cases failed.{RESET}\n")
            sys.exit(1)


if __name__ == "__main__":
    main()
