import { GenerationData } from './GenerationData';
import { SpriteInfo } from './SpriteInfo';

/**
 * Raw Pokemon data — one JSON per Pokemon with all generation data nested
 * under `generations`.  Only `id` and `name` are at the top level (sprite
 * path references are added by sync).
 */
export interface Pokemon {
  id: number;
  name: string;
  generations: Record<string, GenerationData>;
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