import { Pokemon, ResolvedPokemon, Team, ResolvedTeam, GameDex, PokemonType } from '../types';
import { applyNatureToStats, getNature } from '../utils/natureUtils';

export const GAME_DEXES: GameDex[] = [
  { id: 'national', name: 'National Pokedex (All Gens)', generation: 9, games: ['all'], badge: '🌐 All' },
  { id: 'gen1', name: 'Red / Blue / Yellow', generation: 1, games: ['red', 'blue', 'yellow'], badge: '🔴 Gen 1' },
  { id: 'gen2', name: 'Gold / Silver / Crystal', generation: 2, games: ['gold', 'silver', 'crystal'], badge: '🌙 Gen 2' },
  { id: 'gen3', name: 'Ruby / Sapphire / Emerald / FRLG', generation: 3, games: ['ruby', 'sapphire', 'emerald', 'firered', 'leafgreen'], badge: '🌿 Gen 3' },
  { id: 'gen4', name: 'Diamond / Pearl / Platinum / HGSS', generation: 4, games: ['diamond', 'pearl', 'platinum', 'heartgold', 'soulsilver'], badge: '💎 Gen 4' },
  { id: 'gen5', name: 'Black / White / B2W2', generation: 5, games: ['black', 'white', 'black-2', 'white-2'], badge: '⚡ Gen 5' },
  { id: 'gen6', name: 'X / Y / ORAS', generation: 6, games: ['x', 'y', 'omega-ruby', 'alpha-sapphire'], badge: '🐉 Gen 6' },
  { id: 'gen7', name: 'Sun / Moon / USUM', generation: 7, games: ['sun', 'moon', 'ultra-sun', 'ultra-moon'], badge: '☀️ Gen 7' },
  { id: 'gen8', name: 'Sword / Shield / BDSP / Arceus', generation: 8, games: ['sword', 'shield', 'brilliant-diamond', 'shining-pearl', 'legends-arceus'], badge: '⚔️ Gen 8' },
  { id: 'gen9', name: 'Scarlet / Violet', generation: 9, games: ['scarlet', 'violet'], badge: '🍇 Gen 9' },
];

export const GAME_VERSIONS: Record<string, { id: string; badge: string }[]> = {
  national: [{ id: 'all', badge: 'All Games' }],
  gen1: [{ id: 'all', badge: 'All Gen 1' }, { id: 'red', badge: 'Red' }, { id: 'blue', badge: 'Blue' }, { id: 'yellow', badge: 'Yellow' }],
  gen2: [{ id: 'all', badge: 'All Gen 2' }, { id: 'gold', badge: 'Gold' }, { id: 'silver', badge: 'Silver' }, { id: 'crystal', badge: 'Crystal' }],
  gen3: [{ id: 'all', badge: 'All Gen 3' }, { id: 'ruby', badge: 'Ruby' }, { id: 'sapphire', badge: 'Sapphire' }, { id: 'emerald', badge: 'Emerald' }, { id: 'firered', badge: 'FireRed' }, { id: 'leafgreen', badge: 'LeafGreen' }],
  gen4: [{ id: 'all', badge: 'All Gen 4' }, { id: 'diamond', badge: 'Diamond' }, { id: 'pearl', badge: 'Pearl' }, { id: 'platinum', badge: 'Platinum' }, { id: 'heartgold', badge: 'HeartGold' }, { id: 'soulsilver', badge: 'SoulSilver' }],
  gen5: [{ id: 'all', badge: 'All Gen 5' }, { id: 'black', badge: 'Black' }, { id: 'white', badge: 'White' }, { id: 'black-2', badge: 'Black 2' }, { id: 'white-2', badge: 'White 2' }],
  gen6: [{ id: 'all', badge: 'All Gen 6' }, { id: 'x', badge: 'X' }, { id: 'y', badge: 'Y' }, { id: 'omega-ruby', badge: 'Omega Ruby' }, { id: 'alpha-sapphire', badge: 'Alpha Sapphire' }],
  gen7: [{ id: 'all', badge: 'All Gen 7' }, { id: 'sun', badge: 'Sun' }, { id: 'moon', badge: 'Moon' }, { id: 'ultra-sun', badge: 'Ultra Sun' }, { id: 'ultra-moon', badge: 'Ultra Moon' }],
  gen8: [{ id: 'all', badge: 'All Gen 8' }, { id: 'sword', badge: 'Sword' }, { id: 'shield', badge: 'Shield' }, { id: 'brilliant-diamond', badge: 'Brilliant Diamond' }, { id: 'shining-pearl', badge: 'Shining Pearl' }, { id: 'legends-arceus', badge: 'Legends: Arceus' }],
  gen9: [{ id: 'all', badge: 'All Gen 9' }, { id: 'scarlet', badge: 'Scarlet' }, { id: 'violet', badge: 'Violet' }],
};

export function getPokemonSprite(id: number, shiny: boolean = false): string {
  if (shiny) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`;
  }
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export function getPokemonArtwork(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function resolvePokemon(pokemon: Pokemon, activeGen: number): ResolvedPokemon | undefined {
  let genKey = activeGen.toString();
  let genData = pokemon.generations?.[genKey];

  if (!genData) {
    // Fallback to searching backwards for the most recent generation data
    // This handles cases where a pokemon wasn't fetched in the exact generation
    for (let g = activeGen; g >= 1; g--) {
      if (pokemon.generations?.[g.toString()]) {
        genData = pokemon.generations[g.toString()];
        break;
      }
    }
  }

  if (!genData) return undefined;

  const rawTypes = genData.types || (pokemon as any).types || [];
  const normalizedTypes: PokemonType[] = rawTypes.map((t: any) => {
    if (typeof t === 'string') return t.toLowerCase() as PokemonType;
    if (t && typeof t === 'object') {
      if (t.type && typeof t.type.name === 'string') return t.type.name.toLowerCase() as PokemonType;
      if (typeof t.name === 'string') return t.name.toLowerCase() as PokemonType;
    }
    return String(t).toLowerCase() as PokemonType;
  });

  const formattedName = pokemon.name
    ? pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
    : pokemon.name;

  return {
    id: pokemon.id,
    name: formattedName,
    generation: activeGen,
    types: normalizedTypes,
    stats: genData.stats!,
    height: genData.height,
    weight: genData.weight,
    abilities: genData.abilities,
    moves: genData.moves,
    availability: genData.availability,
    description: genData.description,
    is_legendary: genData.is_legendary,
    is_mythical: genData.is_mythical,
    is_fully_evolved: genData.is_fully_evolved,
    sprite: pokemon.sprite,
    sprite_shiny: pokemon.sprite_shiny,
    back_sprite: pokemon.back_sprite,
    artwork: pokemon.artwork,
    showdown_sprite: pokemon.showdown_sprite,
    showdown_sprite_shiny: pokemon.showdown_sprite_shiny,
    home_sprite: pokemon.home_sprite,
    home_sprite_shiny: pokemon.home_sprite_shiny,
    game_sprites: pokemon.game_sprites,
    sprite_info: pokemon.sprite_info,
  };
}

export function resolveTeam(team: Team, activeGen: number): ResolvedTeam {
  return team.map((member) => {
    if (!member) return null;
    const resolved = resolvePokemon(member.pokemon, activeGen);
    if (!resolved) return null;

    const selectedNature = activeGen >= 3 ? (member.selectedNature || 'hardy') : undefined;
    const nature = selectedNature ? getNature(selectedNature) : undefined;
    const stats = selectedNature
      ? applyNatureToStats(resolved.stats, selectedNature, activeGen)
      : resolved.stats;

    return {
      slotIndex: member.slotIndex,
      pokemon: {
        ...resolved,
        stats,
      },
      nickname: member.nickname,
      isShiny: member.isShiny,
      selectedAbility: member.selectedAbility,
      selectedMoves: member.selectedMoves,
      selectedNature,
      nature,
    };
  });
}

export async function loadFullPokemonList(): Promise<Pokemon[]> {
  if (typeof window !== 'undefined' && (window as any).__POKEMON_DATA__) {
    return (window as any).__POKEMON_DATA__;
  }

  try {
    const res = await fetch('./data/indices/pokedex_index.json');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (e) {
    console.warn('Failed to load pokedex_index.json, trying fallback', e);
  }

  try {
    const res2 = await fetch('./data/indices/pokemon_index.json');
    if (res2.ok) {
      const data = await res2.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (e) {
    console.warn('Failed to load pokemon_index.json fallback data', e);
  }

  try {
    const res3 = await fetch('./data/fullRoster.json');
    if (res3.ok) {
      const data = await res3.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (e) {
    console.warn('Failed to load fullRoster.json fallback data', e);
  }

  return [];
}
