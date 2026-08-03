#!/usr/bin/env python3
"""
Shared Pokémon Availability and Type Resolution Logic for Data Scripts

Determines Pokémon availability per game version based on true in-game acquirability
(wild encounters, starter choices, gifts, static encounters, fossils, in-game NPC trades,
and evolution/breeding propagation) without requiring trades with another game.
"""

import json
import ssl
import urllib.request
from typing import List, Dict, Any, Optional, Set
from utils import get_generation_by_id
from pokemon_constants import (
    GEN_GAMES,
    SAPPHIRE_EXCLUSIVES,
    RUBY_EXCLUSIVES,
    EMERALD_UNOBTAINABLE,
    LEAFGREEN_EXCLUSIVES,
    FIRERED_EXCLUSIVES,
    PEARL_EXCLUSIVES,
    DIAMOND_EXCLUSIVES,
    SS_EXCLUSIVES,
    HG_EXCLUSIVES,
    WHITE_EXCLUSIVES,
    BLACK_EXCLUSIVES,
    WHITE2_EXCLUSIVES,
    BLACK2_EXCLUSIVES,
    Y_EXCLUSIVES,
    X_EXCLUSIVES,
    ALPHA_SAPPHIRE_EXCLUSIVES,
    OMEGA_RUBY_EXCLUSIVES,
    MOON_EXCLUSIVES,
    SUN_EXCLUSIVES,
    ULTRA_MOON_EXCLUSIVES,
    ULTRA_SUN_EXCLUSIVES,
    SHIELD_EXCLUSIVES,
    SWORD_EXCLUSIVES,
    BD_EXCLUSIVES,
    SP_EXCLUSIVES,
    LEGENDS_ARCEUS_DEX,
    VIOLET_EXCLUSIVES,
    SCARLET_EXCLUSIVES,
)

# Global encounter cache mapping pokemon_id -> set of version_name strings
_ENCOUNTER_CACHE: Optional[Dict[int, Set[str]]] = None


def _load_encounter_data() -> Dict[int, Set[str]]:
    """Loads encounter and evolution data from PokeAPI GraphQL and builds the propagated version availability map."""
    global _ENCOUNTER_CACHE
    if _ENCOUNTER_CACHE is not None:
        return _ENCOUNTER_CACHE

    encounter_map: Dict[int, Set[str]] = {}

    try:
        ctx = ssl._create_unverified_context()
        req = urllib.request.Request(
            'https://beta.pokeapi.co/graphql/v1beta',
            data=json.dumps({'query': '''
            query {
              pokemon_v2_encounter {
                pokemon_id
                pokemon_v2_version { name }
              }
              pokemon_v2_evolutionchain {
                id
                pokemon_v2_pokemonspecies {
                  id
                  name
                  evolves_from_species_id
                }
              }
            }
            '''}).encode('utf-8'),
            headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'}
        )
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8')).get('data', {})

        # Direct encounters from PokeAPI
        for e in data.get('pokemon_v2_encounter', []):
            pid = e['pokemon_id']
            v = e['pokemon_v2_version']['name']
            encounter_map.setdefault(pid, set()).add(v)

        # Evolution family mappings
        chain_species: Dict[int, Set[int]] = {}
        for chain in data.get('pokemon_v2_evolutionchain', []):
            cid = chain['id']
            for spec in chain.get('pokemon_v2_pokemonspecies', []):
                sid = spec['id']
                chain_species.setdefault(cid, set()).add(sid)

        # Add known in-game trades & gifts (starters/fossils/trades not in PokeAPI wild encounter table)
        # Gen 1 trades: Farfetch'd (83), Lickitung (108), Mr. Mime (122), Jynx (124), Nidos (29,30,32,33), Machoke (67), Haunter (93)
        for pid in [83, 108, 122, 124, 29, 30, 32, 33, 67, 93]:
            encounter_map.setdefault(pid, set()).update(['red', 'blue'])

        # Gen 1 gifts in Yellow (Bulbasaur, Charmander, Squirtle)
        for pid in [1, 4, 7]:
            encounter_map.setdefault(pid, set()).add('yellow')

        # Gen 3 Hoenn starters in Emerald postgame
        for pid in [252, 255, 258]:
            encounter_map.setdefault(pid, set()).add('emerald')

        # Gen 4 HGSS starters from Oak & Steven
        for pid in [1, 4, 7, 252, 255, 258]:
            encounter_map.setdefault(pid, set()).update(['heartgold', 'soulsilver'])

        # Gen 6 Kalos starters from Sycamore
        for pid in [1, 4, 7]:
            encounter_map.setdefault(pid, set()).update(['x', 'y'])

        # Propagate version availability across evolution families
        for cid, members in chain_species.items():
            family_versions = set()
            for m in members:
                if m in encounter_map:
                    family_versions.update(encounter_map[m])
            for m in members:
                encounter_map.setdefault(m, set()).update(family_versions)

    except Exception as e:
        # Fallback empty encounter map if network fails
        encounter_map = {}

    _ENCOUNTER_CACHE = encounter_map
    return _ENCOUNTER_CACHE


def get_pokemon_availability_for_gen(
    pokemon_id: int, target_gen: int, raw_data: Optional[Dict[str, Any]] = None
) -> List[str]:
    """
    Returns a list of game version strings where this Pokémon is acquirable in target_gen
    without trading with another game. In-game NPC trades, starter choices, gifts, wild encounters,
    static encounters, and evolution/breeding are included.
    """
    native_gen = get_generation_by_id(pokemon_id)
    if target_gen < native_gen:
        return []

    gen_game_set = GEN_GAMES.get(target_gen, set())
    encounter_data = _load_encounter_data()
    raw_available = set(encounter_data.get(pokemon_id, set()))

    # Fallback / explicit rules for Gen 8, Gen 9, and ORAS where PokeAPI encounter tables are empty/incomplete
    if target_gen == 8:
        if native_gen <= 8:
            raw_available.update({"sword", "shield", "brilliant-diamond", "shining-pearl"})
        if pokemon_id in LEGENDS_ARCEUS_DEX:
            raw_available.add("legends-arceus")
    elif target_gen == 9:
        if native_gen <= 9:
            raw_available.update({"scarlet", "violet"})
    elif target_gen == 6 and not (raw_available & {"omega-ruby", "alpha-sapphire"}) and pokemon_id <= 386:
        raw_available.update({"omega-ruby", "alpha-sapphire"})

    # Restrict candidate games strictly to those belonging to target_gen
    available = {g for g in raw_available if g in gen_game_set}

    # Version-exclusive & unobtainable filters
    filtered_games: List[str] = []

    blue_exclusives = {27, 28, 37, 38, 52, 53, 69, 70, 71, 126, 127}
    red_exclusives = {23, 24, 43, 44, 45, 56, 57, 58, 59, 123, 125}
    yellow_unobtainables = {13, 14, 15, 23, 24, 26, 52, 53, 109, 110, 124, 125, 126}
    gold_exclusives = {167, 168, 207, 216, 217, 226, 58, 59}
    silver_exclusives = {165, 166, 225, 227, 231, 232, 37, 38, 52, 53}
    crystal_unobtainables = {179, 180, 181, 203, 223, 224, 56, 57, 207, 226, 225, 227}

    for game in available:
        if game == "red" and (pokemon_id in blue_exclusives or pokemon_id == 151):
            continue
        if game == "blue" and (pokemon_id in red_exclusives or pokemon_id == 151):
            continue
        if game == "yellow" and (pokemon_id in yellow_unobtainables or pokemon_id == 151):
            continue
        if game == "gold" and (pokemon_id in silver_exclusives or pokemon_id == 251):
            continue
        if game == "silver" and (pokemon_id in gold_exclusives or pokemon_id == 251):
            continue
        if game == "crystal" and (pokemon_id in crystal_unobtainables or pokemon_id == 251):
            continue
        if game == "ruby" and pokemon_id in SAPPHIRE_EXCLUSIVES:
            continue
        if game == "sapphire" and pokemon_id in RUBY_EXCLUSIVES:
            continue
        if game == "emerald" and pokemon_id in EMERALD_UNOBTAINABLE:
            continue
        if game == "firered" and (pokemon_id in LEAFGREEN_EXCLUSIVES or pokemon_id == 151):
            continue
        if game == "leafgreen" and (pokemon_id in FIRERED_EXCLUSIVES or pokemon_id == 151):
            continue
        if game == "diamond" and pokemon_id in PEARL_EXCLUSIVES:
            continue
        if game == "pearl" and pokemon_id in DIAMOND_EXCLUSIVES:
            continue
        if game == "heartgold" and (pokemon_id in SS_EXCLUSIVES or pokemon_id in (151, 251)):
            continue
        if game == "soulsilver" and (pokemon_id in HG_EXCLUSIVES or pokemon_id in (151, 251)):
            continue
        if game == "black" and pokemon_id in WHITE_EXCLUSIVES:
            continue
        if game == "white" and pokemon_id in BLACK_EXCLUSIVES:
            continue
        if game == "black-2" and pokemon_id in WHITE2_EXCLUSIVES:
            continue
        if game == "white-2" and pokemon_id in BLACK2_EXCLUSIVES:
            continue
        if game == "x" and pokemon_id in Y_EXCLUSIVES:
            continue
        if game == "y" and pokemon_id in X_EXCLUSIVES:
            continue
        if game == "omega-ruby" and pokemon_id in ALPHA_SAPPHIRE_EXCLUSIVES:
            continue
        if game == "alpha-sapphire" and pokemon_id in OMEGA_RUBY_EXCLUSIVES:
            continue
        if game == "sun" and pokemon_id in MOON_EXCLUSIVES:
            continue
        if game == "moon" and pokemon_id in SUN_EXCLUSIVES:
            continue
        if game == "ultra-sun" and pokemon_id in ULTRA_MOON_EXCLUSIVES:
            continue
        if game == "ultra-moon" and pokemon_id in ULTRA_SUN_EXCLUSIVES:
            continue
        if game == "sword" and pokemon_id in SHIELD_EXCLUSIVES:
            continue
        if game == "shield" and pokemon_id in SWORD_EXCLUSIVES:
            continue
        if game == "brilliant-diamond" and pokemon_id in SP_EXCLUSIVES:
            continue
        if game == "shining-pearl" and pokemon_id in BD_EXCLUSIVES:
            continue
        if game == "legends-arceus" and pokemon_id not in LEGENDS_ARCEUS_DEX:
            continue
        if game == "scarlet" and pokemon_id in VIOLET_EXCLUSIVES:
            continue
        if game == "violet" and pokemon_id in SCARLET_EXCLUSIVES:
            continue

        filtered_games.append(game)

    all_ordered_games = [
        "red", "blue", "yellow", "gold", "silver", "crystal", "ruby", "sapphire",
        "emerald", "firered", "leafgreen", "diamond", "pearl", "platinum",
        "heartgold", "soulsilver", "black", "white", "black-2", "white-2",
        "x", "y", "omega-ruby", "alpha-sapphire", "sun", "moon", "ultra-sun",
        "ultra-moon", "sword", "shield", "brilliant-diamond", "shining-pearl",
        "legends-arceus", "scarlet", "violet"
    ]
    return [g for g in all_ordered_games if g in filtered_games]


def get_pokemon_availability(pokemon_id: int, generation: int) -> List[str]:
    """Backwards-compatible wrapper for get_pokemon_availability_for_gen."""
    return get_pokemon_availability_for_gen(pokemon_id, generation)


def resolve_generation_types(pokemon_data: Dict[str, Any], target_generation: int) -> List[str]:
    """Resolves historical Pokémon types for earlier generations."""
    current_types = pokemon_data.get("types", [])
    past_types_list = pokemon_data.get("past_types", [])
    if not past_types_list:
        return current_types

    applicable_past = []
    for past in past_types_list:
        past_gen_url = past.get("generation", {}).get("url", "")
        try:
            past_gen_num = int(past_gen_url.rstrip("/").split("/")[-1])
        except (ValueError, IndexError):
            name = past.get("generation", {}).get("name", "")
            roman = name.split("-")[-1]
            roman_map = {"i": 1, "ii": 2, "iii": 3, "iv": 4, "v": 5, "vi": 6, "vii": 7, "viii": 8, "ix": 9}
            past_gen_num = roman_map.get(roman, 9)

        if target_generation <= past_gen_num:
            applicable_past.append((past_gen_num, past.get("types", [])))

    if applicable_past:
        applicable_past.sort(key=lambda x: x[0])
        closest_past_types = applicable_past[0][1]
        return [t["type"]["name"] for t in closest_past_types]

    return current_types
