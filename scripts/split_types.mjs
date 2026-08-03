import fs from 'fs';
import path from 'path';

const outDir = '/Users/strodajm/pokemon-ultimate-team-builder/src/types';

const types = {
  "PokemonType.ts": `export type PokemonType =
  | 'normal' | 'fire' | 'water' | 'grass' | 'electric' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'steel' | 'dark' | 'fairy';`,

  "PokemonStats.ts": `export interface PokemonStats {
  generation: number;
  number: number;
  hp: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  special?: number; // Gen 1 only — single "Special" stat instead of split
  speed: number;
}`,

  "GenerationData.ts": `import { PokemonType } from './PokemonType';
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
}`,

  "SpriteInfo.ts": `/**
 * Per-game-version sprite metadata — documents which sprite set is used
 * for each game version (e.g., "red-blue" for both Red and Blue), the local
 * directory, format, animation flag, and source type.
 */
export interface SpriteInfo {
  /** Sprite theme/set name (e.g., "red-blue", "emerald", "standard") */
  sprite_style: string;
  /** Local directory under sprites/ for this version */
  sprite_dir: string;
  /** PokeAPI generation key (e.g., "generation-i") */
  gen_key: string;
  /** Generation number (1-9) */
  gen_num: number;
  /** Image format — "png" for static, "gif" for animated */
  format: string;
  /** Whether animated sprite variants are available (Gen 5) */
  animated: boolean;
  /** "version" if version-specific sprites exist, "standard" if fallback */
  source: string;
  /** Human-readable game name */
  display_name: string;
  /** Whether animated sprites exist for this version */
  has_animated: boolean;
  /** Animated sprite style name (Gen 5 only, e.g., "black-white-animated") */
  animated_style?: string;
  /** Animated sprite image format (Gen 5 only, "gif") */
  animated_format?: string;
}`,

  "Pokemon.ts": `import { GenerationData } from './GenerationData';
import { SpriteInfo } from './SpriteInfo';

/**
 * Raw Pokemon data — one JSON per Pokemon with all generation data nested
 * under \`generations\`.  Only \`id\` and \`name\` are at the top level (sprite
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
}`,

  "ResolvedPokemon.ts": `import { PokemonType } from './PokemonType';
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
}`,

  "TeamMember.ts": `import { Pokemon } from './Pokemon';

export interface TeamMember {
  slotIndex: number;
  pokemon: Pokemon;
  nickname?: string;
  isShiny?: boolean;
  selectedAbility?: string;
  selectedMoves?: string[];
}`,

  "Team.ts": `import { TeamMember } from './TeamMember';

export type Team = (TeamMember | null)[];`,

  "ResolvedTeamMember.ts": `import { ResolvedPokemon } from './ResolvedPokemon';

export interface ResolvedTeamMember {
  slotIndex: number;
  pokemon: ResolvedPokemon;
  nickname?: string;
  isShiny?: boolean;
  selectedAbility?: string;
  selectedMoves?: string[];
}`,

  "ResolvedTeam.ts": `import { ResolvedTeamMember } from './ResolvedTeamMember';

export type ResolvedTeam = (ResolvedTeamMember | null)[];`,

  "GameDex.ts": `export interface GameDex {
  id: string;
  name: string;
  generation: number;
  games: string[];
  badge: string;
}`,

  "TypeDefensiveAnalysis.ts": `import { PokemonType } from './PokemonType';

export interface TypeDefensiveAnalysis {
  type: PokemonType;
  weak4x: number;
  weak2x: number;
  neutral: number;
  resistHalf: number;
  resistQuarter: number;
  immune: number;
  effectiveMultiplier: number;
  netScore: number; // For sorting or summary
}`,

  "TypeOffensiveAnalysis.ts": `import { PokemonType } from './PokemonType';

export interface TypeOffensiveAnalysis {
  type: PokemonType;
  superEffectiveMembers: number; // How many team members have a STAB move against this type
}`,

  "index.ts": `export * from './PokemonType';
export * from './PokemonStats';
export * from './GenerationData';
export * from './SpriteInfo';
export * from './Pokemon';
export * from './ResolvedPokemon';
export * from './TeamMember';
export * from './Team';
export * from './ResolvedTeamMember';
export * from './ResolvedTeam';
export * from './GameDex';
export * from './TypeDefensiveAnalysis';
export * from './TypeOffensiveAnalysis';`
};

for (const [filename, content] of Object.entries(types)) {
  fs.writeFileSync(path.join(outDir, filename), content);
}
