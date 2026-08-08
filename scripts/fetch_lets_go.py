#!/usr/bin/env python3
"""
Add Let's Go, Pikachu! / Let's Go, Eevee! availability to the existing dataset.

PokeAPI exposes the pair as version group ``lets-go-pikachu-lets-go-eevee``
(generation-vii, pokedex ``letsgo-kanto``) but ships **no encounter rows** for
either version, so availability is driven off the pokedex listing plus the
version-exclusive rules in ``pokemon_constants``.

This is a maintenance script: it patches the two Let's Go entries into the
Gen 7 ``availability`` arrays already present in the dataset and leaves every
other value untouched. Run it after a fetch, or on its own:

    python3 scripts/fetch_lets_go.py            # fetch dex from PokeAPI, then patch
    python3 scripts/fetch_lets_go.py --offline  # skip the API, use LETS_GO_DEX

Usage requires only the standard library.
"""

import argparse
import json
import re
import ssl
import sys
import urllib.request
from pathlib import Path
from typing import Dict, List, Set

sys.path.insert(0, str(Path(__file__).resolve().parent))

from pokemon_constants import (  # noqa: E402
    LETS_GO_DEX,
    LETS_GO_EEVEE_EXCLUSIVES,
    LETS_GO_PIKACHU_EXCLUSIVES,
    LETS_GO_UNOBTAINABLE,
)

BASE_DIR = Path(__file__).resolve().parent.parent
POKEDEX_URL = "https://pokeapi.co/api/v2/pokedex/letsgo-kanto"
VERSION_GROUP_URL = "https://pokeapi.co/api/v2/version-group/lets-go-pikachu-lets-go-eevee"
LETS_GO_VERSIONS = ("lets-go-pikachu", "lets-go-eevee")
GEN7_ORDER = ["sun", "moon", "ultra-sun", "ultra-moon", "lets-go-pikachu", "lets-go-eevee"]


def fetch_lets_go_dex() -> Set[int]:
    """Pull the letsgo-kanto pokedex species IDs straight from PokeAPI."""
    ctx = ssl._create_unverified_context()
    req = urllib.request.Request(POKEDEX_URL, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, context=ctx, timeout=60) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    ids = set()
    for entry in data.get("pokemon_entries", []):
        match = re.search(r"/(\d+)/?$", entry["pokemon_species"]["url"])
        if match:
            ids.add(int(match.group(1)))
    return ids


def versions_for(pokemon_id: int, dex: Set[int]) -> List[str]:
    """Which Let's Go versions this species is obtainable in, in-game."""
    if pokemon_id not in dex or pokemon_id in LETS_GO_UNOBTAINABLE:
        return []
    versions = []
    if pokemon_id not in LETS_GO_EEVEE_EXCLUSIVES:
        versions.append("lets-go-pikachu")
    if pokemon_id not in LETS_GO_PIKACHU_EXCLUSIVES:
        versions.append("lets-go-eevee")
    return versions


def apply_to_gen7(gen7: Dict, pokemon_id: int, dex: Set[int]) -> bool:
    """Merge Let's Go versions into one generation-7 availability list."""
    current = gen7.get("availability")
    if not isinstance(current, list):
        return False
    wanted = versions_for(pokemon_id, dex)
    merged = [g for g in current if g not in LETS_GO_VERSIONS] + wanted
    ordered = [g for g in GEN7_ORDER if g in merged]
    # keep anything unexpected rather than silently dropping it
    ordered += [g for g in merged if g not in GEN7_ORDER]
    if ordered == current:
        return False
    gen7["availability"] = ordered
    return True


def patch_entry(entry: Dict, dex: Set[int]) -> bool:
    pid = entry.get("id")
    gen7 = (entry.get("generations") or {}).get("7")
    if not pid or not isinstance(gen7, dict):
        return False
    return apply_to_gen7(gen7, pid, dex)


def patch_file(path: Path, dex: Set[int], indent=None) -> int:
    if not path.exists():
        return 0
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    changed = 0
    if isinstance(data, list):
        for entry in data:
            if patch_entry(entry, dex):
                changed += 1
    elif isinstance(data, dict):
        if patch_entry(data, dex):
            changed = 1
    if changed:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=indent)
    return changed


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--offline", action="store_true", help="skip PokeAPI, use the bundled LETS_GO_DEX")
    args = parser.parse_args()

    dex = LETS_GO_DEX
    if not args.offline:
        try:
            fetched = fetch_lets_go_dex()
            print(f"→ PokeAPI {POKEDEX_URL}: {len(fetched)} species")
            if fetched != LETS_GO_DEX:
                only_api = sorted(fetched - LETS_GO_DEX)
                only_const = sorted(LETS_GO_DEX - fetched)
                print(f"  ! LETS_GO_DEX differs from the API — api-only={only_api} constant-only={only_const}")
                print("    Using the API listing for this run; update pokemon_constants.LETS_GO_DEX to match.")
            dex = fetched
        except Exception as exc:
            print(f"  ! PokeAPI fetch failed ({exc}); falling back to LETS_GO_DEX")

    obtainable = sum(1 for pid in sorted(dex) if versions_for(pid, dex))
    print(f"→ {obtainable} of {len(dex)} dex species are obtainable in-game")

    print("⚡ Patching Let's Go availability into dataset files...")

    n = patch_file(BASE_DIR / "src" / "data" / "fullRoster.json", dex, indent=2)
    print(f"  ✓ src/data/fullRoster.json: {n} entries")

    pokemon_dir = BASE_DIR / "public" / "data" / "pokemon"
    count = 0
    for data_file in sorted(pokemon_dir.glob("*/data.json")):
        count += patch_file(data_file, dex, indent=2)
    print(f"  ✓ public/data/pokemon/*/data.json: {count} files")

    n = patch_file(pokemon_dir / "index.json", dex)
    print(f"  ✓ public/data/pokemon/index.json: {n} entries")

    # public/data/indices/pokemon_index.json is a flat Gen 9 snapshot (one
    # `availability` list for the latest generation only), so Let's Go — a Gen 7
    # dex — has nothing to add there.

    print("✅ Let's Go availability patched. (public/api/v1 is regenerated by npm run build.)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
