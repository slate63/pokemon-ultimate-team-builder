import { PokemonType } from './PokemonType';
import { PokemonStats } from './PokemonStats';
import { SpriteInfo } from './SpriteInfo';

/**
 * A Pokemon resolved to a specific generation — generation-specific fields
 * promoted to the top level for easy consumption by UI components.
 */
export interface ResolvedPokemon {
  id: number;
  name: string;
  generation: number;
  types: PokemonType[];
  stats: PokemonStats;
  height: number;
  weight: number;
  abilities?: string[];   // Gen 1 has no abilities
  moves?: string[];
  availability?: string[];
  description?: string;
  is_legendary?: boolean;
  is_mythical?: boolean;
  is_fully_evolved?: boolean;
  sprite?: string;
  sprite_shiny?: string;
  back_sprite?: string;
  artwork?: string;
  showdown_sprite?: string;
  showdown_sprite_shiny?: string;
  home_sprite?: string;
  home_sprite_shiny?: string;
  game_sprites?: Record<string, {
    front_default?: string;
    front_shiny?: string;
    back_default?: string | null;
    back_shiny?: string | null;
  }>;
  sprite_info?: Record<string, SpriteInfo>;
}