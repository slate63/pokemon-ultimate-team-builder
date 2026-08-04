export interface BaseStats {
  hp: number;
  attack: number;
  defense: number;
  special_attack?: number;
  special_defense?: number;
  special?: number;
  speed: number;
}

export interface DataPokemonSummary {
  id: number;
  name: string;
  types: string[];
  stats: BaseStats;
  generation: number;
  is_legendary: boolean;
  is_mythical: boolean;
  is_fully_evolved: boolean;
}

export interface PokemonGenData {
  types: string[];
  stats: BaseStats;
  height?: number;
  weight?: number;
  moves?: string[];
  abilities?: string[];
  availability?: string[];
  description?: string;
  is_legendary?: boolean;
  is_mythical?: boolean;
  is_fully_evolved?: boolean;
}

export interface DataPokemonDetail {
  id: number;
  name: string;
  generations: Record<string, PokemonGenData>;
}

export interface DataMoveSummary {
  id: number;
  name: string;
  type?: string;
  power?: number | null;
  accuracy?: number | null;
  pp?: number;
  priority?: number;
  damage_class?: string;
}

export interface MoveGenData {
  id: number;
  name: string;
  type?: string;
  power?: number | null;
  accuracy?: number | null;
  pp?: number;
  priority?: number;
  damage_class?: string;
}

export interface DataMoveDetail {
  id: number;
  name: string;
  generations: Record<string, MoveGenData>;
}

export interface TypeGenEffectiveness {
  double_damage_from: string[];
  double_damage_to: string[];
  half_damage_from: string[];
  half_damage_to: string[];
  no_damage_from: string[];
  no_damage_to: string[];
}

export interface DataTypeDetail {
  name: string;
  generations: Record<string, TypeGenEffectiveness>;
}

export interface DataNature {
  id: string;
  name: string;
  increasedStat: string | null;
  decreasedStat: string | null;
  increasedStatName: string | null;
  decreasedStatName: string | null;
}

export interface DataGeneration {
  id: string;
  name: string;
  generation: number;
  badge: string;
  games: string[];
}

export interface PokemonFilterOptions {
  query?: string;
  generation?: number;
  type?: string;
  isFullyEvolved?: boolean;
  isLegendary?: boolean;
  isMythical?: boolean;
  minStatTotal?: number;
  maxStatTotal?: number;
  limit?: number;
  offset?: number;
}
