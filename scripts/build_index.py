#!/usr/bin/env python3
"""
Compile fetched Pokemon data, species, moves, and evolutions into unified index files.

Usage:
    python build_index.py
"""

import json
from pathlib import Path
from typing import Dict, List, Any
from availability import get_pokemon_availability_for_gen

GEN_GAMES_LIST = {
    1: ["red-blue", "yellow"],
    2: ["gold-silver", "crystal"],
    3: ["ruby-sapphire", "emerald", "firered-leafgreen"],
    4: ["diamond-pearl", "platinum", "heartgold-soulsilver"],
    5: ["black-white", "black-white-2"],
    6: ["x-y", "omega-ruby-alpha-sapphire"],
    7: ["sun-moon", "ultra-sun-ultra-moon"],
    8: ["sword-shield"],
    9: ["scarlet-violet"]
}



def compile_pokemon_index(base_dir: Path) -> List[Dict[str, Any]]:
    print("Compiling Pokemon index...")
    pokemon_index = []
    
    pokemon_base_dir = base_dir / "pokemon"
    if not pokemon_base_dir.exists():
        print(f"Pokemon base directory not found at {pokemon_base_dir}")
        return []
        
    # First, let's load all species flavor texts into a dictionary for quick lookup by name/ID
    species_by_id = {}
    for gen in range(1, 10):
        species_file = base_dir / "species" / "species.json"
        if species_file.exists():
            try:
                with open(species_file, 'r') as f:
                    species_list = json.load(f)
                    for species in species_list:
                        species_by_id[species["id"]] = species
            except Exception as e:
                print(f"Error loading species for Gen {gen}: {e}")
                
    # Store raw loaded data
    raw_pokemon_by_id = {}
    pokemon_by_chain_id = {}  # chain_id -> list of pokemon_ids
    pokemon_chain_mapping = {}  # pokemon_id -> chain_id
    
    # Pass 1: Load all raw Pokemon data files and map evolution chains
    for gen in range(1, 10):
        gen_dir = pokemon_base_dir
        if not gen_dir.exists():
            continue
            
        # Get all subdirectories (representing individual Pokémon)
        pokemon_dirs = sorted([d for d in gen_dir.iterdir() if d.is_dir()])
        
        for p_dir in pokemon_dirs:
            json_files = list(p_dir.glob("*.json"))
            if not json_files:
                continue
                
            json_file = json_files[0]
            try:
                with open(json_file, 'r') as f:
                    p_data = json.load(f)
                
                p_id = p_data["id"]
                raw_pokemon_by_id[p_id] = (p_data, p_dir, gen)
                
                # Get evolution chain ID
                species_info = species_by_id.get(p_id)
                if species_info and "evolution_chain" in species_info and species_info["evolution_chain"]:
                    chain_url = species_info["evolution_chain"]["url"]
                    try:
                        chain_id = int(chain_url.rstrip("/").split("/")[-1])
                        pokemon_chain_mapping[p_id] = chain_id
                        if chain_id not in pokemon_by_chain_id:
                            pokemon_by_chain_id[chain_id] = []
                        pokemon_by_chain_id[chain_id].append(p_id)
                    except Exception:
                        pass
            except Exception as e:
                print(f"Error loading raw JSON for {p_dir.name}: {e}")

    # Pass 2: Compile the final index with dynamic availability logic
    for p_id, (p_data, p_dir, gen) in raw_pokemon_by_id.items():
        try:
            p_name = p_data["name"]
            
            # Format sprite relative paths
            sprite_path = f"/data/pokemon/{p_dir.name}/sprites/standard/front_default.png"
            sprite_shiny_path = f"/data/pokemon/{p_dir.name}/sprites/standard/front_shiny.png"
            back_sprite_path = f"/data/pokemon/{p_dir.name}/sprites/standard/back_default.png"
            
            # Check if sprite files exist locally, else fallback to API URLs
            sprites_sub_dir = p_dir / "sprites"
            if not (sprites_sub_dir / "standard" / "front_default.png").exists():
                sprite_path = p_data.get("sprites", {}).get("front_default") or ""
            if not (sprites_sub_dir / "standard" / "front_shiny.png").exists():
                sprite_shiny_path = p_data.get("sprites", {}).get("front_shiny") or ""
            if not (sprites_sub_dir / "standard" / "back_default.png").exists():
                back_sprite_path = p_data.get("sprites", {}).get("back_default") or ""
            
            # Compile game-specific sprites
            game_sprites = {}
            games = GEN_GAMES_LIST.get(gen, [])
            for game_name in games:
                game_dir = sprites_sub_dir / game_name
                if (game_dir / "front_default.png").exists():
                    game_sprites[game_name] = {
                        "front_default": f"/data/pokemon/{p_dir.name}/sprites/{game_name}/front_default.png",
                        "front_shiny": f"/data/pokemon/{p_dir.name}/sprites/{game_name}/front_shiny.png" if (game_dir / "front_shiny.png").exists() else f"/data/pokemon/{p_dir.name}/sprites/{game_name}/front_default.png",
                        "back_default": f"/data/pokemon/{p_dir.name}/sprites/{game_name}/back_default.png" if (game_dir / "back_default.png").exists() else None,
                        "back_shiny": f"/data/pokemon/{p_dir.name}/sprites/{game_name}/back_shiny.png" if (game_dir / "back_shiny.png").exists() else None
                    }

            # Compile Game Availability
            availability = get_pokemon_availability_for_gen(p_id, gen, p_data)
            availability = sorted(list(set(availability)))

            # Get flavor text
            description = ""
            species_info = species_by_id.get(p_id)
            if species_info:
                description = species_info.get("flavor_text", "")
                
            # Compile stats
            # The new structure stores stats labeled with generation and number
            # alongside the six base stat values.  Extract just the values for
            # the index, stripping the metadata labels.
            stats_raw = p_data.get("stats", {})
            stats = {
                "hp": stats_raw.get("hp", 0),
                "attack": stats_raw.get("attack", 0),
                "defense": stats_raw.get("defense", 0),
                "special_attack": stats_raw.get("special_attack", 0),
                "special_defense": stats_raw.get("special_defense", 0),
                "speed": stats_raw.get("speed", 0)
            }
                
            # Extract abilities
            abilities = p_data.get("abilities", [])
            
            # Extract learnable moves
            learnable_moves = p_data.get("moves", [])
            
            # Extract types
            types = p_data.get("types", [])
            
            # Build entry
            pokemon_entry = {
                "id": p_id,
                "name": p_name,
                "types": types,
                "stats": stats,
                "sprite": sprite_path,
                "sprite_shiny": sprite_shiny_path,
                "back_sprite": back_sprite_path,
                "game_sprites": game_sprites,
                "abilities": abilities,
                "description": description,
                "generation": gen,
                "height": p_data.get("height", 0),
                "weight": p_data.get("weight", 0),
                "moves": learnable_moves,
                "availability": availability
            }
            
            pokemon_index.append(pokemon_entry)
            
        except Exception as e:
            print(f"Error indexing ID {p_id}: {e}")
                
    # Sort index by Pokemon ID
    pokemon_index.sort(key=lambda x: x["id"])
    
    # Save to file
    output_file = base_dir / "indices" / "pokemon_index.json"
    output_file.parent.mkdir(parents=True, exist_ok=True)
    with open(output_file, 'w') as f:
        json.dump(pokemon_index, f, indent=2)
        
    print(f"✓ Saved {len(pokemon_index)} Pokemon to {output_file}")
    return pokemon_index


def compile_moves_index(base_dir: Path) -> Dict[str, Any]:
    print("Compiling moves index...")
    moves_index = {}
    
    for gen in range(1, 10):
        moves_file = base_dir / "moves" / "moves.json"
        if moves_file.exists():
            try:
                with open(moves_file, 'r') as f:
                    moves_list = json.load(f)
                    for move in moves_list:
                        moves_index[move["name"]] = move
            except Exception as e:
                print(f"Error loading moves for Gen {gen}: {e}")
                
    # Save to file
    output_file = base_dir / "indices" / "moves_index.json"
    output_file.parent.mkdir(parents=True, exist_ok=True)
    with open(output_file, 'w') as f:
        json.dump(moves_index, f, indent=2)
        
    print(f"✓ Saved {len(moves_index)} moves to {output_file}")
    return moves_index


def compile_evolutions_index(base_dir: Path) -> Dict[str, Any]:
    print("Compiling evolutions index...")
    
    # A map from pokemon_id -> evolution chain object
    evolutions_by_pokemon_id = {}
    
    # Track unique chains to avoid saving duplicates
    unique_chains = {}
    
    for gen in range(1, 10):
        evolutions_file = base_dir / "evolutions" / "evolutions.json"
        if evolutions_file.exists():
            try:
                with open(evolutions_file, 'r') as f:
                    chains = json.load(f)
                    for chain in chains:
                        chain_id = chain["id"]
                        unique_chains[chain_id] = chain["chain"]
            except Exception as e:
                print(f"Error loading evolutions for Gen {gen}: {e}")
                
    # For each chain, map all species IDs contained inside it back to the chain
    def register_chain_species(node: Dict, chain_obj: Dict):
        species_id = node["species_id"]
        evolutions_by_pokemon_id[species_id] = chain_obj
        for child in node.get("evolves_to", []):
            register_chain_species(child, chain_obj)
            
    for chain_id, chain_root in unique_chains.items():
        register_chain_species(chain_root, chain_root)
        
    # Save to file
    output_file = base_dir / "indices" / "evolutions_index.json"
    output_file.parent.mkdir(parents=True, exist_ok=True)
    with open(output_file, 'w') as f:
        json.dump(evolutions_by_pokemon_id, f, indent=2)
        
    print(f"✓ Saved evolution mappings for {len(evolutions_by_pokemon_id)} species to {output_file}")
    return evolutions_by_pokemon_id


def main():
    base_dir = Path("public/data")
    if not base_dir.exists():
        print(f"Base data directory not found at {base_dir}")
        return 1
        
    compile_pokemon_index(base_dir)
    compile_moves_index(base_dir)
    compile_evolutions_index(base_dir)
    
    print("\nIndexing complete!")
    return 0


if __name__ == "__main__":
    exit(main())
