import { ResolvedPokemon } from "../types";
import { getPokemonSprite as getStandardSprite, GAME_DEXES } from "../data/pokemonData";

/**
 * Build the directory name used to store per-pokemon data on disk.
 * IDs < 1000 are zero-padded to 3 digits (e.g., "001-bulbasaur").
 * IDs >= 1000 use the raw number (e.g., "1000-gholdengo").
 */
function pokemonDirName(pokemon: ResolvedPokemon): string {
  const paddedId = pokemon.id < 1000
    ? String(pokemon.id).padStart(3, '0')
    : String(pokemon.id);
  return `${paddedId}-${pokemon.name.toLowerCase().replace(/ /g, '-')}`;
}

/**
 * Map each dropdown theme value to the sprite directory name on disk.
 * Themes that correspond 1:1 with a directory are identity-mapped.
 * "retro" is handled specially (picks best sprite for the Pokémon's gen).
 * "modern", "showdown", "home", "artwork" have their own directories.
 */
const THEME_TO_SPRITE_DIR: Record<string, string> = {
  "modern":                "standard",
  "showdown":              "showdown",
  "home":                  "home",
  "artwork":               "artwork",
  "red-blue":              "red-blue",
  "yellow":                "yellow",
  "gold":                  "gold",
  "silver":                "silver",
  "crystal":               "crystal",
  "ruby-sapphire":         "ruby-sapphire",
  "firered-leafgreen":     "firered-leafgreen",
  "emerald":               "emerald",
  "diamond-pearl":         "diamond-pearl",
  "platinum":              "platinum",
  "heartgold-soulsilver":  "heartgold-soulsilver",
  "black-white":           "black-white",
  "black-white-animated":  "black-white-animated",
  "x-y":                   "x-y",
  "omegaruby-alphasapphire": "omegaruby-alphasapphire",
  "usum":                  "ultra-sun-ultra-moon",
  "gen7-icons":            "gen7-icons",
  "gen8-icons":            "gen8-icons",
};

/**
 * Dynamically resolves the sprite path for a Pokemon based on the selected
 * sprite style theme, shiny toggle, and front/back direction.
 *
 * Strategy:
 *  1. Build a local path: ./data/pokemon/{dir}/sprites/{spriteDir}/{variant}.{ext}
 *  2. The PokeAPI CDN URL is used as the onError fallback (handled by the
 *     <img onError> in the consuming component), so returning the local path
 *     is safe even if the file doesn't exist — the browser will try the path
 *     and fall back to the default PokeAPI sprite via onError.
 */
export function getPokemonSprite(
  pokemon: ResolvedPokemon,
  theme: string,
  isShiny: boolean,
  back: boolean = false
): string {
  // Gen 1 (Red, Blue, Yellow) did not have shiny sprites
  if (theme === "red-blue" || theme === "yellow" || (theme === "retro" && getNativeGen(pokemon.id) === 1)) {
    isShiny = false;
  }

  const defaultFallback = getStandardSprite(pokemon.id, isShiny);
  const variant = back
    ? (isShiny ? "back_shiny" : "back_default")
    : (isShiny ? "front_shiny" : "front_default");
  const dirName = pokemonDirName(pokemon);
  const basePath = `./data/pokemon/${dirName}/sprites`;

  // ------ Official Artwork ------
  if (theme === "artwork") {
    const artworkFile = isShiny ? "artwork_shiny.png" : "artwork.png";
    return `${basePath}/artwork/${artworkFile}`;
  }

  // ------ Showdown (animated GIF) ------
  if (theme === "showdown") {
    return `${basePath}/showdown/${variant}.gif`;
  }

  // ------ Black & White Animated (GIF) ------
  if (theme === "black-white-animated") {
    return `${basePath}/black-white-animated/${variant}.gif`;
  }

  // ------ HOME 2D HD ------
  if (theme === "home") {
    return `${basePath}/home/${variant}.png`;
  }

  // ------ Modern (standard default sprites) ------
  if (theme === "modern") {
    return `${basePath}/standard/${variant}.png`;
  }

  // ------ Retro: pick best available directory for this Pokemon's generation ------
  if (theme === "retro") {
    const nativeGen = getNativeGen(pokemon.id);
    const retroDir = pickRetroDir(nativeGen);
    return `${basePath}/${retroDir}/${variant}.png`;
  }

  // ------ Specific game version themes ------
  const spriteDir = THEME_TO_SPRITE_DIR[theme];
  if (spriteDir) {
    return `${basePath}/${spriteDir}/${variant}.png`;
  }

  // Unknown theme — fallback to PokeAPI standard sprite
  return defaultFallback;
}

/**
 * Get native generation from national dex number.
 */
function getNativeGen(id: number): number {
  if (id <= 151) return 1;
  if (id <= 251) return 2;
  if (id <= 386) return 3;
  if (id <= 493) return 4;
  if (id <= 649) return 5;
  if (id <= 721) return 6;
  if (id <= 809) return 7;
  if (id <= 905) return 8;
  return 9;
}

/**
 * Pick the best retro sprite directory for a given native generation.
 * We want to show a Pokémon in the art style from the generation it was
 * introduced in (or the earliest available).
 */
function pickRetroDir(nativeGen: number): string {
  const genDirs: Record<number, string> = {
    1: "yellow",
    2: "crystal",
    3: "emerald",
    4: "platinum",
    5: "black-white",
    6: "x-y",
    7: "ultra-sun-ultra-moon",
    8: "standard", // Gen 8+ only have standard sprites locally
    9: "standard",
  };
  return genDirs[nativeGen] || "standard";
}

/**
 * Map individual game version IDs to their corresponding sprite style theme.
 */
export const VERSION_TO_SPRITE_STYLE: Record<string, string> = {
  // Gen 1
  'red': 'red-blue',
  'blue': 'red-blue',
  'yellow': 'yellow',
  // Gen 2
  'gold': 'gold',
  'silver': 'silver',
  'crystal': 'crystal',
  // Gen 3
  'ruby': 'ruby-sapphire',
  'sapphire': 'ruby-sapphire',
  'emerald': 'emerald',
  'firered': 'firered-leafgreen',
  'leafgreen': 'firered-leafgreen',
  // Gen 4
  'diamond': 'diamond-pearl',
  'pearl': 'diamond-pearl',
  'platinum': 'platinum',
  'heartgold': 'heartgold-soulsilver',
  'soulsilver': 'heartgold-soulsilver',
  // Gen 5
  'black': 'black-white',
  'white': 'black-white',
  'black-2': 'black-white',
  'white-2': 'black-white',
  // Gen 6
  'x': 'x-y',
  'y': 'x-y',
  'omega-ruby': 'omegaruby-alphasapphire',
  'alpha-sapphire': 'omegaruby-alphasapphire',
  // Gen 7
  'sun': 'usum',
  'moon': 'usum',
  'ultra-sun': 'usum',
  'ultra-moon': 'usum',
  // Gen 8
  'sword': 'modern',
  'shield': 'modern',
  'brilliant-diamond': 'diamond-pearl',
  'shining-pearl': 'diamond-pearl',
  'legends-arceus': 'modern',
  // Gen 9
  'scarlet': 'modern',
  'violet': 'modern',
};

export interface SpriteOption {
  value: string;
  label: string;
  gen?: number;
}

export const ALL_SPRITE_OPTIONS: SpriteOption[] = [
  { value: 'showdown', label: '🎬 Showdown (Animated)' },
  { value: 'home', label: '🏠 HOME 2D (HD)' },
  { value: 'modern', label: '✨ Modern 2D (Default)' },
  { value: 'artwork', label: '🎨 Official Artwork' },
  { value: 'red-blue', label: '🔴 Red & Blue (Gen 1)', gen: 1 },
  { value: 'yellow', label: '🟡 Yellow (Gen 1)', gen: 1 },
  { value: 'gold', label: '🥇 Gold (Gen 2)', gen: 2 },
  { value: 'silver', label: '🥈 Silver (Gen 2)', gen: 2 },
  { value: 'crystal', label: '🔮 Crystal (Gen 2)', gen: 2 },
  { value: 'ruby-sapphire', label: '💎 Ruby & Sapphire (Gen 3)', gen: 3 },
  { value: 'firered-leafgreen', label: '🍃 FireRed & LeafGreen (Gen 3)', gen: 3 },
  { value: 'emerald', label: '🟢 Emerald (Gen 3)', gen: 3 },
  { value: 'diamond-pearl', label: '💠 Diamond & Pearl (Gen 4)', gen: 4 },
  { value: 'platinum', label: '⭐ Platinum (Gen 4)', gen: 4 },
  { value: 'heartgold-soulsilver', label: '💛 HeartGold & SoulSilver (Gen 4)', gen: 4 },
  { value: 'black-white', label: '⬛ Black & White (Gen 5)', gen: 5 },
  { value: 'black-white-animated', label: '🎞️ B&W Animated (Gen 5)', gen: 5 },
  { value: 'x-y', label: '🔷 X & Y (Gen 6)', gen: 6 },
  { value: 'omegaruby-alphasapphire', label: '🌀 OR/AS (Gen 6)', gen: 6 },
  { value: 'usum', label: '☀️ Ultra Sun/Moon (Gen 7)', gen: 7 },
  { value: 'gen7-icons', label: '🏷️ Gen 7 Icons (Mini)', gen: 7 },
  { value: 'gen8-icons', label: '🏷️ Gen 8 Icons (Mini)', gen: 8 },
];

/**
 * Filter available sprite options based on selected game/dex ID and active generation.
 * If gameId is 'national' (All Gens), returns all sprite options.
 * Otherwise, returns universal sprite options (gen is undefined) plus options matching activeGen.
 */
export function getAvailableSpriteOptions(gameId: string, activeGen?: number): SpriteOption[] {
  if (gameId === 'national') {
    return ALL_SPRITE_OPTIONS;
  }
  const gen = activeGen ?? (GAME_DEXES.find((d) => d.id === gameId)?.generation || 9);
  return ALL_SPRITE_OPTIONS.filter((opt) => opt.gen === undefined || opt.gen === gen);
}

/**
 * Default sprite style for each game / dex generation when version is 'all'.
 */
export const GAME_DEFAULT_SPRITE_STYLE: Record<string, string> = {
  'gen1': 'red-blue',
  'gen2': 'crystal',
  'gen3': 'emerald',
  'gen4': 'platinum',
  'gen5': 'black-white',
  'gen6': 'x-y',
  'gen7': 'usum',
  'gen8': 'modern',
  'gen9': 'modern',
  'national': 'showdown',
};

/**
 * Returns the matching sprite style for a given version or game ID.
 */
export function getSpriteStyleForVersion(versionId: string, gameId: string): string {
  if (versionId && versionId !== 'all' && VERSION_TO_SPRITE_STYLE[versionId]) {
    return VERSION_TO_SPRITE_STYLE[versionId];
  }
  if (gameId && GAME_DEFAULT_SPRITE_STYLE[gameId]) {
    return GAME_DEFAULT_SPRITE_STYLE[gameId];
  }
  return 'showdown';
}


