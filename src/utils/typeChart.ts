import { PokemonType } from '../types';

/**
 * Damage relations for a single type, in the flat-list format written by
 * `scripts/fetch_types.py` (mirrors PokeAPI's structure).
 */
export interface TypeDamageRelations {
  double_damage_from: string[];
  double_damage_to: string[];
  half_damage_from: string[];
  half_damage_to: string[];
  no_damage_from: string[];
  no_damage_to: string[];
}

/**
 * Per-generation type chart as fetched from `public/data/types/types.json`.
 * Maps defender type → its damage relations.
 */
export type GenTypeData = Record<string, TypeDamageRelations>;

/**
 * Single type defensive matrix: `chart[attacker][defender]` is the multiplier
 * that *defender* takes from *attacker*.
 */
export type TypeChartMatrix = Record<PokemonType, Record<PokemonType, number>>;

export interface TypeChartData {
  /** attacker→defender multiplier matrix */
  chart: TypeChartMatrix;
  /** types that exist in this generation (e.g. 15 in Gen 1, 18 in Gen 6+) */
  types: PokemonType[];
}

/**
 * Convert the fetched damage-relations format (defender-centric) into the
 * attacker→defender multiplier matrix used throughout the app.
 *
 * For each defender D, its `*_damage_from` lists tell us which attackers deal
 * 2×, 0.5×, or 0× damage to D.  Every other attacker deals 1×.
 */
export function buildTypeChartFromRelations(data: GenTypeData): TypeChartData {
  const typeNames = Object.keys(data) as PokemonType[];
  const typeSet = new Set(typeNames);

  // Initialize a full matrix defaulting to 1× everywhere.
  const chart = {} as TypeChartMatrix;
  for (const attacker of typeNames) {
    chart[attacker] = {} as Record<PokemonType, number>;
    for (const defender of typeNames) {
      chart[attacker][defender] = 1;
    }
  }

  // Helper: set chart[attacker][defender] only when both types exist in this
  // generation (the fetched relations may reference types not yet introduced).
  const set = (attacker: string, defender: string, mult: number) => {
    if (typeSet.has(attacker as PokemonType) && typeSet.has(defender as PokemonType)) {
      chart[attacker as PokemonType][defender as PokemonType] = mult;
    }
  };

  // We apply relations from BOTH perspectives (defender's *_damage_from and
  // attacker's *_damage_to) because a type with historical past_damage_relations
  // may disagree with a type that only has current relations.  The known case
  // is Gen 1 Ghost-vs-Psychic: Ghost's past relations say it deals 0× to
  // Psychic, but Psychic (no past relations) uses current relations saying it
  // takes 2× from Ghost.  Applying immunity (0×) last resolves the conflict in
  // favour of the historically accurate value.

  // 1. Apply 2× relations (super effective).
  for (const t of typeNames) {
    const rel = data[t];
    if (!rel) continue;
    for (const other of rel.double_damage_from) set(other, t, 2);
    for (const other of rel.double_damage_to) set(t, other, 2);
  }

  // 2. Apply 0.5× relations (resisted).
  for (const t of typeNames) {
    const rel = data[t];
    if (!rel) continue;
    for (const other of rel.half_damage_from) set(other, t, 0.5);
    for (const other of rel.half_damage_to) set(t, other, 0.5);
  }

  // 3. Apply 0× relations (immune) LAST so they override any conflicts.
  for (const t of typeNames) {
    const rel = data[t];
    if (!rel) continue;
    for (const other of rel.no_damage_from) set(other, t, 0);
    for (const other of rel.no_damage_to) set(t, other, 0);
  }

  return { chart, types: typeNames };
}

// In-memory cache so repeated calls for the same generation don't re-fetch.
const cache = new Map<number, TypeChartData>();

interface PokemonTypeEntry {
  name: string;
  generations: Record<string, TypeDamageRelations>;
}

const POKEMON_TYPES_LIST: PokemonType[] = [
  'normal', 'fire', 'water', 'grass', 'electric', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'steel', 'dark', 'fairy'
];

// We fetch the individual files once and store their raw data here.
let rawCombinedData: PokemonTypeEntry[] | null = null;

/**
 * Load the type-effectiveness chart for a given generation.
 *
 * Fetches individual JSON files from `public/data/types/` at runtime.
 * Results are cached per generation.
 */
export async function loadTypeChartForGen(gen: number): Promise<TypeChartData> {
  const cached = cache.get(gen);
  if (cached) return cached;

  if (!rawCombinedData) {
    if (typeof window !== 'undefined' && (window as any).__TYPES_DATA__) {
      rawCombinedData = (window as any).__TYPES_DATA__;
    } else {
      const promises = POKEMON_TYPES_LIST.map(async (type) => {
        const url = `./data/types/${type}.json`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Failed to load type chart for ${type} (${res.status}): ${url}`);
        }
        return res.json() as Promise<PokemonTypeEntry>;
      });
      rawCombinedData = await Promise.all(promises);
    }
  }

  // Reconstruct the GenTypeData object from the array format
  const data: GenTypeData = {};
  for (const entry of rawCombinedData!) {
    const genData = entry.generations[String(gen)];
    if (genData) {
      data[entry.name] = genData;
    }
  }

  if (Object.keys(data).length === 0) {
    throw new Error(`Type chart for gen ${gen} not found in combined data`);
  }

  const result = buildTypeChartFromRelations(data);
  cache.set(gen, result);
  return result;
}
