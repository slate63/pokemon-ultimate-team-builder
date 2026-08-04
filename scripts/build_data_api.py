#!/usr/bin/env python3
import os
import json

SPRITE_KEYS = {
    "sprite",
    "sprite_shiny",
    "back_sprite",
    "artwork",
    "showdown_sprite",
    "showdown_sprite_shiny",
    "home_sprite",
    "home_sprite_shiny",
    "game_sprites",
    "sprite_info",
}

def strip_sprite_keys(obj):
    if isinstance(obj, dict):
        cleaned = {}
        for k, v in obj.items():
            if k in SPRITE_KEYS:
                continue
            cleaned[k] = strip_sprite_keys(v)
        return cleaned
    elif isinstance(obj, list):
        return [strip_sprite_keys(item) for item in obj]
    else:
        return obj

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    public_data_dir = os.path.join(base_dir, "public", "data")
    api_dir = os.path.join(base_dir, "public", "api", "v1")

    pokemon_api_dir = os.path.join(api_dir, "pokemon")
    moves_api_dir = os.path.join(api_dir, "moves")
    types_api_dir = os.path.join(api_dir, "types")
    natures_api_dir = os.path.join(api_dir, "natures")

    for d in [pokemon_api_dir, moves_api_dir, types_api_dir, natures_api_dir]:
        os.makedirs(d, exist_ok=True)

    print("⚡ Building Data API v1 (without sprites)...")

    # -------------------------------------------------------------
    # 1. Process Pokémon
    # -------------------------------------------------------------
    pokemon_source_dir = os.path.join(public_data_dir, "pokemon")
    pokemon_index = []

    if os.path.exists(pokemon_source_dir):
        for entry in os.listdir(pokemon_source_dir):
            entry_path = os.path.join(pokemon_source_dir, entry)
            if not os.path.isdir(entry_path):
                continue
            data_file = os.path.join(entry_path, "data.json")
            if not os.path.exists(data_file):
                continue

            with open(data_file, "r", encoding="utf-8") as f:
                raw_data = json.load(f)

            clean_data = strip_sprite_keys(raw_data)
            p_id = clean_data.get("id")
            p_name = clean_data.get("name")

            if not p_id or not p_name:
                continue

            # Write individual file by ID and by Name
            id_filename = os.path.join(pokemon_api_dir, f"{p_id}.json")
            name_filename = os.path.join(pokemon_api_dir, f"{p_name}.json")

            with open(id_filename, "w", encoding="utf-8") as f:
                json.dump(clean_data, f, indent=2)

            with open(name_filename, "w", encoding="utf-8") as f:
                json.dump(clean_data, f, indent=2)

            # Extract latest gen summary for index
            gens = clean_data.get("generations", {})
            latest_gen_key = max(gens.keys(), key=int) if gens else None
            latest_gen = gens.get(latest_gen_key, {}) if latest_gen_key else {}

            pokemon_index.append({
                "id": p_id,
                "name": p_name,
                "types": latest_gen.get("types", []),
                "stats": latest_gen.get("stats", {}),
                "generation": int(latest_gen_key) if latest_gen_key else 9,
                "is_legendary": latest_gen.get("is_legendary", False),
                "is_mythical": latest_gen.get("is_mythical", False),
                "is_fully_evolved": latest_gen.get("is_fully_evolved", False),
                "requires_trade": latest_gen.get("requires_trade", False),
            })

    # Sort index by ID
    pokemon_index.sort(key=lambda x: x["id"])
    with open(os.path.join(pokemon_api_dir, "index.json"), "w", encoding="utf-8") as f:
        json.dump(pokemon_index, f, indent=2)

    print(f"  ✓ Processed {len(pokemon_index)} Pokémon entities into /api/v1/pokemon/")

    # -------------------------------------------------------------
    # 2. Process Moves
    # -------------------------------------------------------------
    moves_source_dir = os.path.join(public_data_dir, "moves")
    moves_index = []

    if os.path.exists(moves_source_dir):
        for entry in os.listdir(moves_source_dir):
            entry_path = os.path.join(moves_source_dir, entry)
            if not os.path.isdir(entry_path):
                continue
            data_file = os.path.join(entry_path, "data.json")
            if not os.path.exists(data_file):
                continue

            with open(data_file, "r", encoding="utf-8") as f:
                raw_data = json.load(f)

            clean_data = strip_sprite_keys(raw_data)
            m_id = clean_data.get("id")
            m_name = clean_data.get("name")

            if not m_id or not m_name:
                continue

            id_filename = os.path.join(moves_api_dir, f"{m_id}.json")
            name_filename = os.path.join(moves_api_dir, f"{m_name}.json")

            with open(id_filename, "w", encoding="utf-8") as f:
                json.dump(clean_data, f, indent=2)

            with open(name_filename, "w", encoding="utf-8") as f:
                json.dump(clean_data, f, indent=2)

            gens = clean_data.get("generations", {})
            latest_gen_key = max(gens.keys(), key=int) if gens else None
            latest_gen = gens.get(latest_gen_key, {}) if latest_gen_key else {}

            moves_index.append({
                "id": m_id,
                "name": m_name,
                "type": latest_gen.get("type"),
                "power": latest_gen.get("power"),
                "accuracy": latest_gen.get("accuracy"),
                "pp": latest_gen.get("pp"),
                "priority": latest_gen.get("priority", 0),
                "damage_class": latest_gen.get("damage_class"),
            })

    moves_index.sort(key=lambda x: x["id"])
    with open(os.path.join(moves_api_dir, "index.json"), "w", encoding="utf-8") as f:
        json.dump(moves_index, f, indent=2)

    print(f"  ✓ Processed {len(moves_index)} Moves into /api/v1/moves/")

    # -------------------------------------------------------------
    # 3. Process Types
    # -------------------------------------------------------------
    types_source_dir = os.path.join(public_data_dir, "types")
    types_index = []

    if os.path.exists(types_source_dir):
        for entry in os.listdir(types_source_dir):
            if not entry.endswith(".json"):
                continue
            data_file = os.path.join(types_source_dir, entry)
            with open(data_file, "r", encoding="utf-8") as f:
                clean_data = strip_sprite_keys(json.load(f))

            t_name = clean_data.get("name")
            if not t_name:
                continue

            name_filename = os.path.join(types_api_dir, f"{t_name}.json")
            with open(name_filename, "w", encoding="utf-8") as f:
                json.dump(clean_data, f, indent=2)

            types_index.append(t_name)

    types_index.sort()
    with open(os.path.join(types_api_dir, "index.json"), "w", encoding="utf-8") as f:
        json.dump(types_index, f, indent=2)

    print(f"  ✓ Processed {len(types_index)} Types into /api/v1/types/")

    # -------------------------------------------------------------
    # 4. Process Natures
    # -------------------------------------------------------------
    natures_file = os.path.join(public_data_dir, "natures.json")
    if os.path.exists(natures_file):
        with open(natures_file, "r", encoding="utf-8") as f:
            natures_list = strip_sprite_keys(json.load(f))

        with open(os.path.join(natures_api_dir, "index.json"), "w", encoding="utf-8") as f:
            json.dump(natures_list, f, indent=2)

        for nat in natures_list:
            n_id = nat.get("id")
            if n_id:
                nat_filename = os.path.join(natures_api_dir, f"{n_id}.json")
                with open(nat_filename, "w", encoding="utf-8") as f:
                    json.dump(nat, f, indent=2)

        print(f"  ✓ Processed {len(natures_list)} Natures into /api/v1/natures/")

    # -------------------------------------------------------------
    # 5. Output Generations Metadata
    # -------------------------------------------------------------
    generations_data = [
        {"id": "national", "name": "National Pokedex (All Gens)", "generation": 9, "badge": "🌐 All", "games": ["all"]},
        {"id": "gen1", "name": "Red / Blue / Yellow", "generation": 1, "badge": "🔴 Gen 1", "games": ["red", "blue", "yellow"]},
        {"id": "gen2", "name": "Gold / Silver / Crystal", "generation": 2, "badge": "🌙 Gen 2", "games": ["gold", "silver", "crystal"]},
        {"id": "gen3", "name": "Ruby / Sapphire / Emerald / FRLG", "generation": 3, "badge": "🌿 Gen 3", "games": ["ruby", "sapphire", "emerald", "firered", "leafgreen"]},
        {"id": "gen4", "name": "Diamond / Pearl / Platinum / HGSS", "generation": 4, "badge": "💎 Gen 4", "games": ["diamond", "pearl", "platinum", "heartgold", "soulsilver"]},
        {"id": "gen5", "name": "Black / White / B2W2", "generation": 5, "badge": "⚡ Gen 5", "games": ["black", "white", "black-2", "white-2"]},
        {"id": "gen6", "name": "X / Y / ORAS", "generation": 6, "badge": "🐉 Gen 6", "games": ["x", "y", "omega-ruby", "alpha-sapphire"]},
        {"id": "gen7", "name": "Sun / Moon / USUM", "generation": 7, "badge": "☀️ Gen 7", "games": ["sun", "moon", "ultra-sun", "ultra-moon"]},
        {"id": "gen8", "name": "Sword / Shield / BDSP / Arceus", "generation": 8, "badge": "⚔️ Gen 8", "games": ["sword", "shield", "brilliant-diamond", "shining-pearl", "legends-arceus"]},
        {"id": "gen9", "name": "Scarlet / Violet", "generation": 9, "badge": "🍇 Gen 9", "games": ["scarlet", "violet"]},
    ]

    with open(os.path.join(api_dir, "generations.json"), "w", encoding="utf-8") as f:
        json.dump(generations_data, f, indent=2)

    print("  ✓ Created /api/v1/generations.json")
    print("✅ Data API v1 generation complete!\n")

if __name__ == "__main__":
    main()
