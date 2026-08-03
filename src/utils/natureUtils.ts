import { Nature, PokemonStats } from '../types';

export const ALL_NATURES: Nature[] = [
  { id: 'hardy', name: 'Hardy', increasedStat: null, decreasedStat: null },
  { id: 'lonely', name: 'Lonely', increasedStat: 'attack', decreasedStat: 'defense', increasedStatName: 'Attack', decreasedStatName: 'Defense' },
  { id: 'brave', name: 'Brave', increasedStat: 'attack', decreasedStat: 'speed', increasedStatName: 'Attack', decreasedStatName: 'Speed' },
  { id: 'adamant', name: 'Adamant', increasedStat: 'attack', decreasedStat: 'special_attack', increasedStatName: 'Attack', decreasedStatName: 'Sp. Atk' },
  { id: 'naughty', name: 'Naughty', increasedStat: 'attack', decreasedStat: 'special_defense', increasedStatName: 'Attack', decreasedStatName: 'Sp. Def' },
  { id: 'bold', name: 'Bold', increasedStat: 'defense', decreasedStat: 'attack', increasedStatName: 'Defense', decreasedStatName: 'Attack' },
  { id: 'docile', name: 'Docile', increasedStat: null, decreasedStat: null },
  { id: 'relaxed', name: 'Relaxed', increasedStat: 'defense', decreasedStat: 'speed', increasedStatName: 'Defense', decreasedStatName: 'Speed' },
  { id: 'impish', name: 'Impish', increasedStat: 'defense', decreasedStat: 'special_attack', increasedStatName: 'Defense', decreasedStatName: 'Sp. Atk' },
  { id: 'lax', name: 'Lax', increasedStat: 'defense', decreasedStat: 'special_defense', increasedStatName: 'Defense', decreasedStatName: 'Sp. Def' },
  { id: 'timid', name: 'Timid', increasedStat: 'speed', decreasedStat: 'attack', increasedStatName: 'Speed', decreasedStatName: 'Attack' },
  { id: 'hasty', name: 'Hasty', increasedStat: 'speed', decreasedStat: 'defense', increasedStatName: 'Speed', decreasedStatName: 'Defense' },
  { id: 'serious', name: 'Serious', increasedStat: null, decreasedStat: null },
  { id: 'jolly', name: 'Jolly', increasedStat: 'speed', decreasedStat: 'special_attack', increasedStatName: 'Speed', decreasedStatName: 'Sp. Atk' },
  { id: 'naive', name: 'Naive', increasedStat: 'speed', decreasedStat: 'special_defense', increasedStatName: 'Speed', decreasedStatName: 'Sp. Def' },
  { id: 'modest', name: 'Modest', increasedStat: 'special_attack', decreasedStat: 'attack', increasedStatName: 'Sp. Atk', decreasedStatName: 'Attack' },
  { id: 'mild', name: 'Mild', increasedStat: 'special_attack', decreasedStat: 'defense', increasedStatName: 'Sp. Atk', decreasedStatName: 'Defense' },
  { id: 'quiet', name: 'Quiet', increasedStat: 'special_attack', decreasedStat: 'speed', increasedStatName: 'Sp. Atk', decreasedStatName: 'Speed' },
  { id: 'bashful', name: 'Bashful', increasedStat: null, decreasedStat: null },
  { id: 'rash', name: 'Rash', increasedStat: 'special_attack', decreasedStat: 'special_defense', increasedStatName: 'Sp. Atk', decreasedStatName: 'Sp. Def' },
  { id: 'calm', name: 'Calm', increasedStat: 'special_defense', decreasedStat: 'attack', increasedStatName: 'Sp. Def', decreasedStatName: 'Attack' },
  { id: 'gentle', name: 'Gentle', increasedStat: 'special_defense', decreasedStat: 'defense', increasedStatName: 'Sp. Def', decreasedStatName: 'Defense' },
  { id: 'sassy', name: 'Sassy', increasedStat: 'special_defense', decreasedStat: 'speed', increasedStatName: 'Sp. Def', decreasedStatName: 'Speed' },
  { id: 'careful', name: 'Careful', increasedStat: 'special_defense', decreasedStat: 'special_attack', increasedStatName: 'Sp. Def', decreasedStatName: 'Sp. Atk' },
  { id: 'quirky', name: 'Quirky', increasedStat: null, decreasedStat: null },
];

export const NATURES_MAP: Record<string, Nature> = ALL_NATURES.reduce((acc, n) => {
  acc[n.id] = n;
  return acc;
}, {} as Record<string, Nature>);

export function getNature(natureId?: string): Nature {
  if (!natureId) return NATURES_MAP['hardy'];
  const found = NATURES_MAP[natureId.toLowerCase()];
  return found || NATURES_MAP['hardy'];
}

export function getNatureTag(nature: Nature): string {
  if (!nature.increasedStat || !nature.decreasedStat || nature.increasedStat === nature.decreasedStat) {
    return 'Neutral';
  }
  return `+${nature.increasedStatName}, -${nature.decreasedStatName}`;
}

/**
 * Applies nature stat modification (+10% for increased, -10% for decreased).
 * Natures were introduced in Gen 3 (activeGen >= 3). HP is never affected.
 */
export function applyNatureToStats(stats: PokemonStats, natureId?: string, activeGen: number = 9): PokemonStats {
  if (activeGen < 3) {
    return stats;
  }

  const nature = getNature(natureId);
  if (!nature.increasedStat && !nature.decreasedStat) {
    return stats;
  }

  const modified = { ...stats };
  const statKeys: ('attack' | 'defense' | 'special_attack' | 'special_defense' | 'speed')[] = [
    'attack',
    'defense',
    'special_attack',
    'special_defense',
    'speed',
  ];

  for (const key of statKeys) {
    if (modified[key] !== undefined) {
      if (key === nature.increasedStat) {
        modified[key] = Math.floor(modified[key] * 1.1);
      } else if (key === nature.decreasedStat) {
        modified[key] = Math.floor(modified[key] * 0.9);
      }
    }
  }

  return modified;
}
