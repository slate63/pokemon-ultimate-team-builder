/**
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
}