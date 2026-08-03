#!/usr/bin/env python3
"""
Fetch ALL Pokémon (1–1025) using PokeAPI's GraphQL endpoint.
This is significantly faster than sequential REST API calls.

Usage:
    python3 scripts/fetch_graphql.py
"""

import json
import urllib.request
import os
from pathlib import Path
import ssl
from availability import get_pokemon_availability_for_gen

GRAPHQL_URL = "https://beta.pokeapi.co/graphql/v1beta"
USER_AGENT = "PokemonTeamBuilder/1.0"
OUTPUT_DIR = Path("public/data")

# Full query to get all necessary data for 1025 Pokémon
# Note: We query all pokemon in one go.
QUERY = """
query {
  pokemon_v2_pokemon(where: {id: {_lte: 1025}}, order_by: {id: asc}) {
    id
    name
    height
    weight
    pokemon_v2_pokemontypes {
      pokemon_v2_type {
        name
      }
    }
    pokemon_v2_pokemonstats {
      base_stat
      pokemon_v2_stat {
        name
      }
    }
    pokemon_v2_pokemonabilities {
      pokemon_v2_ability {
        name
      }
    }
    pokemon_v2_pokemonspecy {
      is_legendary
      is_mythical
      pokemon_v2_generation {
        name
      }
      pokemon_v2_pokemonspeciesflavortexts(where: {language_id: {_eq: 9}}, limit: 1) {
        flavor_text
      }
    }
  }
}
"""

def clean_name(name: str) -> str:
    return name.lower().replace(" ", "-")

def build_dir_name(pid: int, name: str) -> str:
    if pid < 1000:
        return f"{pid:03d}-{clean_name(name)}"
    return f"{pid}-{clean_name(name)}"

def get_generation_number(gen_name: str) -> int:
    roman_map = {"generation-i": 1, "generation-ii": 2, "generation-iii": 3, 
                 "generation-iv": 4, "generation-v": 5, "generation-vi": 6, 
                 "generation-vii": 7, "generation-viii": 8, "generation-ix": 9}
    return roman_map.get(gen_name, 9)

def fetch_data():
    print("Fetching data from PokeAPI GraphQL endpoint...")
    req = urllib.request.Request(
        GRAPHQL_URL,
        data=json.dumps({'query': QUERY}).encode('utf-8'),
        headers={'Content-Type': 'application/json', 'User-Agent': USER_AGENT}
    )
    
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    try:
        with urllib.request.urlopen(req, context=ctx) as response:
            return json.loads(response.read())
    except urllib.error.HTTPError as e:
        print(f"HTTP Error: {e.code} - {e.reason}")
        if e.code == 403:
            print("Note: The PokeAPI GraphQL endpoint may block requests from certain networks/datacenters.")
            print("If you get a 403, PokeAPI has likely blocked this machine's IP. Try running this script from your local machine!")
        return None
    except Exception as e:
        print(f"Error fetching data: {e}")
        return None

def process_and_save(data):
    pokemon_list = data.get("data", {}).get("pokemon_v2_pokemon", [])
    if not pokemon_list:
        print("No Pokémon data found in response.")
        return

    print(f"Successfully fetched {len(pokemon_list)} Pokémon.")
    
    index_list = []
    
    # Ensure directories exist
    (OUTPUT_DIR / "indices").mkdir(parents=True, exist_ok=True)
    
    for p in pokemon_list:
        pid = p["id"]
        name = p["name"]
        
        types = [t["pokemon_v2_type"]["name"] for t in p.get("pokemon_v2_pokemontypes", [])]
        
        specy = p.get("pokemon_v2_pokemonspecy", {})
        if specy is None:
            specy = {}
        gen_name = specy.get("pokemon_v2_generation", {}).get("name", "generation-i") if specy.get("pokemon_v2_generation") else "generation-i"
        gen_num = get_generation_number(gen_name)
        
        dir_name = build_dir_name(pid, name)
        
        sprite_url = f"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{pid}.png"
        
        stats = {}
        for s in p.get("pokemon_v2_pokemonstats", []):
            stat_name = s["pokemon_v2_stat"]["name"]
            stats[stat_name.replace("-", "_")] = s["base_stat"]
            
        abilities = [a["pokemon_v2_ability"]["name"] for a in p.get("pokemon_v2_pokemonabilities", [])]
        
        flavor_texts = specy.get("pokemon_v2_pokemonspeciesflavortexts", []) if specy else []
        description = flavor_texts[0]["flavor_text"].replace("\n", " ").replace("\f", " ") if flavor_texts else ""
        
        # Build payload for the generation
        avail = get_pokemon_availability_for_gen(pid, gen_num)
        gen_data = {
            "types": types,
            "stats": stats,
            "availability": avail,
            "is_legendary": specy.get("is_legendary", False) if specy else False,
            "is_mythical": specy.get("is_mythical", False) if specy else False,
            "is_fully_evolved": False, # Basic assumption, ideally calculated
        }
        
        # Build lightweight index entry (compatible with resolvePokemon)
        index_entry = {
            "id": pid,
            "name": name,
            "sprite": sprite_url,
            "sprite_shiny": f"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/{pid}.png",
            "generations": {
                str(gen_num): gen_data
            }
        }
        index_list.append(index_entry)
        
        # Build detailed payload (for lazy loading)
        detailed_data = {
            "id": pid,
            "name": name,
            "generation": gen_num,
            "types": types,
            "stats": stats,
            "height": p.get("height", 0) / 10.0 if p.get("height") else 0,
            "weight": p.get("weight", 0) / 10.0 if p.get("weight") else 0,
            "abilities": abilities,
            "availability": avail,
            "description": description,
            "is_legendary": gen_data["is_legendary"],
            "is_mythical": gen_data["is_mythical"],
            "sprite": sprite_url,
            "sprite_shiny": index_entry["sprite_shiny"],
            "artwork": f"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{pid}.png"
        }
        
        # Save detailed JSON
        gen_dir = OUTPUT_DIR / "pokemon" / f"gen{gen_num}" / dir_name
        gen_dir.mkdir(parents=True, exist_ok=True)
        
        with open(gen_dir / f"{dir_name}.json", "w") as f:
            json.dump(detailed_data, f, indent=2)
            
    # Save index
    index_path = OUTPUT_DIR / "indices" / "pokedex_index.json"
    with open(index_path, "w") as f:
        json.dump(index_list, f, indent=2)
        
    print(f"Saved {len(index_list)} items to {index_path}")
    print("Detailed Pokémon JSON files saved successfully.")

if __name__ == "__main__":
    result = fetch_data()
    if result:
        process_and_save(result)
