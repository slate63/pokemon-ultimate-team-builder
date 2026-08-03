#!/usr/bin/env python3
"""
fetch_natures.py — Fetch all 25 Pokémon Natures from PokeAPI and save to public/data/natures.json.
Natures modify stats (+10% for increased stat, -10% for decreased stat) in Generation 3+.
"""

import json
import os
import ssl
import sys
import urllib.request

# Stat key mapping from PokeAPI to our frontend PokemonStats model
STAT_MAP = {
    "attack": "attack",
    "defense": "defense",
    "special-attack": "special_attack",
    "special-defense": "special_defense",
    "speed": "speed"
}

STAT_NAME_MAP = {
    "attack": "Attack",
    "defense": "Defense",
    "special_attack": "Sp. Atk",
    "special_defense": "Sp. Def",
    "speed": "Speed"
}

NATURE_NAMES_FORMATTED = {
    "hardy": "Hardy",
    "lonely": "Lonely",
    "brave": "Brave",
    "adamant": "Adamant",
    "naughty": "Naughty",
    "bold": "Bold",
    "docile": "Docile",
    "relaxed": "Relaxed",
    "impish": "Impish",
    "lax": "Lax",
    "timid": "Timid",
    "hasty": "Hasty",
    "serious": "Serious",
    "jolly": "Jolly",
    "naive": "Naive",
    "modest": "Modest",
    "mild": "Mild",
    "quiet": "Quiet",
    "bashful": "Bashful",
    "rash": "Rash",
    "calm": "Calm",
    "gentle": "Gentle",
    "sassy": "Sassy",
    "careful": "Careful",
    "quirky": "Quirky"
}

def create_http_context():
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    return ctx

def fetch_nature_from_api(nature_name, ctx):
    url = f"https://pokeapi.co/api/v2/nature/{nature_name}"
    req = urllib.request.Request(url, headers={"User-Agent": "PokemonTeamBuilder/1.0"})
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as response:
            if response.status == 200:
                data = json.loads(response.read().decode('utf-8'))
                inc_raw = data.get("increased_stat")
                dec_raw = data.get("decreased_stat")
                
                inc = STAT_MAP.get(inc_raw["name"]) if inc_raw else None
                dec = STAT_MAP.get(dec_raw["name"]) if dec_raw else None
                
                # If inc and dec are the same stat, nature is neutral
                if inc == dec:
                    inc = None
                    dec = None

                return {
                    "id": nature_name.lower(),
                    "name": NATURE_NAMES_FORMATTED.get(nature_name.lower(), nature_name.capitalize()),
                    "increasedStat": inc,
                    "decreasedStat": dec,
                    "increasedStatName": STAT_NAME_MAP.get(inc) if inc else None,
                    "decreasedStatName": STAT_NAME_MAP.get(dec) if dec else None,
                }
    except Exception as e:
        print(f"Warning: Failed to fetch nature {nature_name} from PokeAPI ({e}). Using fallback definition.", file=sys.stderr)
    
    return None

def get_static_fallback_natures():
    """Complete static definition of all 25 natures as guaranteed fallback."""
    definitions = [
        ("hardy", None, None),
        ("lonely", "attack", "defense"),
        ("brave", "attack", "speed"),
        ("adamant", "attack", "special_attack"),
        ("naughty", "attack", "special_defense"),
        ("bold", "defense", "attack"),
        ("docile", None, None),
        ("relaxed", "defense", "speed"),
        ("impish", "defense", "special_attack"),
        ("lax", "defense", "special_defense"),
        ("timid", "speed", "attack"),
        ("hasty", "speed", "defense"),
        ("serious", None, None),
        ("jolly", "speed", "special_attack"),
        ("naive", "speed", "special_defense"),
        ("modest", "special_attack", "attack"),
        ("mild", "special_attack", "defense"),
        ("quiet", "special_attack", "speed"),
        ("bashful", None, None),
        ("rash", "special_attack", "special_defense"),
        ("calm", "special_defense", "attack"),
        ("gentle", "special_defense", "defense"),
        ("sassy", "special_defense", "speed"),
        ("careful", "special_defense", "special_attack"),
        ("quirky", None, None)
    ]
    
    result = []
    for nid, inc, dec in definitions:
        result.append({
            "id": nid,
            "name": NATURE_NAMES_FORMATTED[nid],
            "increasedStat": inc,
            "decreasedStat": dec,
            "increasedStatName": STAT_NAME_MAP.get(inc) if inc else None,
            "decreasedStatName": STAT_NAME_MAP.get(dec) if dec else None
        })
    return result

def main():
    print("Fetching Pokémon Nature data...")
    ctx = create_http_context()
    natures = []
    
    nature_list = list(NATURE_NAMES_FORMATTED.keys())
    for nid in nature_list:
        n_data = fetch_nature_from_api(nid, ctx)
        if not n_data:
            break
        natures.append(n_data)
        
    if len(natures) != 25:
        print("Using static fallback for complete 25-nature dataset...")
        natures = get_static_fallback_natures()

    # Ensure output directory exists
    out_dir = os.path.join(os.path.dirname(__file__), "..", "public", "data")
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "natures.json")

    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(natures, f, indent=2)

    print(f"Successfully saved {len(natures)} natures to {out_file}")

if __name__ == "__main__":
    main()
