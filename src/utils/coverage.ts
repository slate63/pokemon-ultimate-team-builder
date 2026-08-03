import { PokemonType, TypeDefensiveAnalysis, ResolvedTeam } from '../types';
import { TypeChartMatrix } from './typeChart';

/**
 * All 18 standard Pokémon types (Gen 6+).  Used as a fallback and by the type
 * filter dropdowns when no generation-specific list is available.
 */
export const POKEMON_TYPES: PokemonType[] = [
  'normal', 'fire', 'water', 'grass', 'electric', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'steel', 'dark', 'fairy'
];

/**
 * Default type chart (Gen 6+ / latest).  Kept as a constant fallback so that
 * coverage calculations work even before the per-generation chart is loaded.
 * The app overrides this at runtime via the `chart` parameter on each calc
 * function.
 */
export const TYPE_CHART: TypeChartMatrix = {
  normal: {
    normal: 1, fire: 1, water: 1, grass: 1, electric: 1, ice: 1,
    fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1,
    rock: 0.5, ghost: 0, dragon: 1, steel: 0.5, dark: 1, fairy: 1
  },
  fire: {
    normal: 1, fire: 0.5, water: 0.5, grass: 2, electric: 1, ice: 2,
    fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 2,
    rock: 0.5, ghost: 1, dragon: 0.5, steel: 2, dark: 1, fairy: 1
  },
  water: {
    normal: 1, fire: 2, water: 0.5, grass: 0.5, electric: 1, ice: 1,
    fighting: 1, poison: 1, ground: 2, flying: 1, psychic: 1, bug: 1,
    rock: 2, ghost: 1, dragon: 0.5, steel: 1, dark: 1, fairy: 1
  },
  grass: {
    normal: 1, fire: 0.5, water: 2, grass: 0.5, electric: 1, ice: 1,
    fighting: 1, poison: 0.5, ground: 2, flying: 0.5, psychic: 1, bug: 0.5,
    rock: 2, ghost: 1, dragon: 0.5, steel: 0.5, dark: 1, fairy: 1
  },
  electric: {
    normal: 1, fire: 1, water: 2, grass: 0.5, electric: 0.5, ice: 1,
    fighting: 1, poison: 1, ground: 0, flying: 2, psychic: 1, bug: 1,
    rock: 1, ghost: 1, dragon: 0.5, steel: 1, dark: 1, fairy: 1
  },
  ice: {
    normal: 1, fire: 0.5, water: 0.5, grass: 2, electric: 1, ice: 0.5,
    fighting: 1, poison: 1, ground: 2, flying: 2, psychic: 1, bug: 1,
    rock: 1, ghost: 1, dragon: 2, steel: 0.5, dark: 1, fairy: 1
  },
  fighting: {
    normal: 2, fire: 1, water: 1, grass: 1, electric: 1, ice: 2,
    fighting: 1, poison: 0.5, ground: 1, flying: 0.5, psychic: 0.5, bug: 0.5,
    rock: 2, ghost: 0, dragon: 1, steel: 2, dark: 2, fairy: 0.5
  },
  poison: {
    normal: 1, fire: 1, water: 1, grass: 2, electric: 1, ice: 1,
    fighting: 1, poison: 0.5, ground: 0.5, flying: 1, psychic: 1, bug: 1,
    rock: 0.5, ghost: 0.5, dragon: 1, steel: 0, dark: 1, fairy: 2
  },
  ground: {
    normal: 1, fire: 2, water: 1, grass: 0.5, electric: 2, ice: 1,
    fighting: 1, poison: 2, ground: 1, flying: 0, psychic: 1, bug: 0.5,
    rock: 2, ghost: 1, dragon: 1, steel: 2, dark: 1, fairy: 1
  },
  flying: {
    normal: 1, fire: 1, water: 1, grass: 2, electric: 0.5, ice: 1,
    fighting: 2, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 2,
    rock: 0.5, ghost: 1, dragon: 1, steel: 0.5, dark: 1, fairy: 1
  },
  psychic: {
    normal: 1, fire: 1, water: 1, grass: 1, electric: 1, ice: 1,
    fighting: 2, poison: 2, ground: 1, flying: 1, psychic: 0.5, bug: 1,
    rock: 1, ghost: 1, dragon: 1, steel: 0.5, dark: 0, fairy: 1
  },
  bug: {
    normal: 1, fire: 0.5, water: 1, grass: 2, electric: 1, ice: 1,
    fighting: 0.5, poison: 0.5, ground: 1, flying: 0.5, psychic: 2, bug: 1,
    rock: 1, ghost: 0.5, dragon: 1, steel: 0.5, dark: 2, fairy: 0.5
  },
  rock: {
    normal: 1, fire: 2, water: 1, grass: 1, electric: 1, ice: 2,
    fighting: 0.5, poison: 1, ground: 0.5, flying: 2, psychic: 1, bug: 2,
    rock: 1, ghost: 1, dragon: 1, steel: 0.5, dark: 1, fairy: 1
  },
  ghost: {
    normal: 0, fire: 1, water: 1, grass: 1, electric: 1, ice: 1,
    fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 2, bug: 1,
    rock: 1, ghost: 2, dragon: 1, steel: 1, dark: 0.5, fairy: 1
  },
  dragon: {
    normal: 1, fire: 1, water: 1, grass: 1, electric: 1, ice: 1,
    fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1,
    rock: 1, ghost: 1, dragon: 2, steel: 0.5, dark: 1, fairy: 0
  },
  steel: {
    normal: 1, fire: 0.5, water: 0.5, grass: 1, electric: 0.5, ice: 2,
    fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1,
    rock: 2, ghost: 1, dragon: 1, steel: 0.5, dark: 1, fairy: 2
  },
  dark: {
    normal: 1, fire: 1, water: 1, grass: 1, electric: 1, ice: 1,
    fighting: 0.5, poison: 1, ground: 1, flying: 1, psychic: 2, bug: 1,
    rock: 1, ghost: 2, dragon: 1, steel: 1, dark: 0.5, fairy: 0.5
  },
  fairy: {
    normal: 1, fire: 0.5, water: 1, grass: 1, electric: 1, ice: 1,
    fighting: 2, poison: 0.5, ground: 1, flying: 1, psychic: 1, bug: 1,
    rock: 1, ghost: 1, dragon: 2, steel: 0.5, dark: 2, fairy: 1
  }
};

/**
 * Get damage multiplier taking defender's types into account against an incoming move type.
 * Uses the provided `chart` (generation-specific) or falls back to the default TYPE_CHART.
 */
export function getDefensiveMultiplier(
  incomingType: PokemonType,
  defenderTypes: PokemonType[],
  chart: TypeChartMatrix = TYPE_CHART
): number {
  if (!defenderTypes || defenderTypes.length === 0) return 1;
  return defenderTypes.reduce((acc, defType) => {
    const mult = chart[incomingType]?.[defType] ?? 1;
    return acc * mult;
  }, 1);
}

/**
 * Calculate team defensive coverage across all types in the chart.
 */
export function calculateTeamDefensiveCoverage(
  team: ResolvedTeam,
  chart: TypeChartMatrix = TYPE_CHART,
  types: PokemonType[] = POKEMON_TYPES
): Record<PokemonType, TypeDefensiveAnalysis> {
  const activeMembers = team.filter((member): member is NonNullable<typeof member> => member !== null);
  const result: Record<PokemonType, TypeDefensiveAnalysis> = {} as any;

  for (const attackingType of types) {
    let weak4x = 0;
    let weak2x = 0;
    let neutral = 0;
    let resistHalf = 0;
    let resistQuarter = 0;
    let immune = 0;

    for (const member of activeMembers) {
      const mult = getDefensiveMultiplier(attackingType, member.pokemon.types, chart);
      if (mult >= 4) weak4x++;
      else if (mult > 1) weak2x++;
      else if (mult === 0) immune++;
      else if (mult <= 0.25) resistQuarter++;
      else if (mult < 1) resistHalf++;
      else neutral++;
    }

    const netScore = (resistHalf + resistQuarter * 1.5 + immune * 2) - (weak2x + weak4x * 2);

    result[attackingType] = {
      type: attackingType,
      weak4x,
      weak2x,
      neutral,
      resistHalf,
      resistQuarter,
      immune,
      effectiveMultiplier: 1,
      netScore
    };
  }

  return result;
}

/**
 * Calculate offensive coverage: how many team members possess STAB moves effective against each type
 */
export function calculateTeamOffensiveCoverage(
  team: ResolvedTeam,
  chart: TypeChartMatrix = TYPE_CHART,
  types: PokemonType[] = POKEMON_TYPES
): Record<PokemonType, number> {
  const activeMembers = team.filter((member): member is NonNullable<typeof member> => member !== null);
  const result: Record<PokemonType, number> = {} as any;

  for (const targetType of types) {
    let superEffectiveCount = 0;

    for (const member of activeMembers) {
      // Check if member has STAB types that hit targetType super-effectively (> 1)
      const memberHasStab = member.pokemon.types.some(stabType => {
        return (chart[stabType]?.[targetType] ?? 1) > 1;
      });
      if (memberHasStab) {
        superEffectiveCount++;
      }
    }

    result[targetType] = superEffectiveCount;
  }

  return result;
}

export type MatrixCategory = 'weak2x' | 'weak4x' | 'resist' | 'immune' | 'hit';

/**
 * Get slot indices of team members that match a specific matrix cell criteria.
 */
export function getMatchingTeamSlots(
  team: ResolvedTeam,
  chart: TypeChartMatrix = TYPE_CHART,
  targetType: PokemonType,
  category: MatrixCategory
): number[] {
  const matchingSlots: number[] = [];

  team.forEach((member, index) => {
    if (!member) return;

    if (category === 'hit') {
      const hasStab = member.pokemon.types.some(stabType => (chart[stabType]?.[targetType] ?? 1) > 1);
      if (hasStab) {
        matchingSlots.push(index);
      }
    } else {
      const mult = getDefensiveMultiplier(targetType, member.pokemon.types, chart);
      if (category === 'weak2x' && mult > 1 && mult < 4) {
        matchingSlots.push(index);
      } else if (category === 'weak4x' && mult >= 4) {
        matchingSlots.push(index);
      } else if (category === 'resist' && mult < 1 && mult > 0) {
        matchingSlots.push(index);
      } else if (category === 'immune' && mult === 0) {
        matchingSlots.push(index);
      }
    }
  });

  return matchingSlots;
}

/**
 * Get shared weakness alerts (e.g. 3 or more team members weak to Ground)
 */
export function getWeaknessAlerts(
  coverage: Record<PokemonType, TypeDefensiveAnalysis>,
  types: PokemonType[] = POKEMON_TYPES
): { type: PokemonType; count: number }[] {
  const alerts: { type: PokemonType; count: number }[] = [];
  for (const type of types) {
    const analysis = coverage[type];
    if (!analysis) continue;
    const totalWeak = analysis.weak4x + analysis.weak2x;
    if (totalWeak >= 3) {
      alerts.push({ type, count: totalWeak });
    }
  }
  return alerts.sort((a, b) => b.count - a.count);
}

