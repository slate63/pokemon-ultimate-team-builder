import { PokemonType } from './PokemonType';
import { PokemonStats } from './PokemonStats';

/** Generation-specific data — everything except id and name lives here. */
export interface GenerationData {
  types: PokemonType[];
  stats?: PokemonStats;
  base_stats?: PokemonStats;   // legacy field name from older fetch runs
  height: number;
  weight: number;
  abilities?: string[];   // Gen 1 has no abilities
  moves?: string[];
  availability?: string[];
  description?: string;
  is_legendary?: boolean;
  is_mythical?: boolean;
  is_fully_evolved?: boolean;
  [key: string]: any;
}