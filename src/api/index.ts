import {
  DataPokemonSummary,
  DataPokemonDetail,
  DataMoveSummary,
  DataMoveDetail,
  DataTypeDetail,
  DataNature,
  DataGeneration,
  PokemonFilterOptions,
} from './types';

export * from './types';

// Helper to determine the API base URL for static fetch
function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname;
    // Check if hosted on GitHub Pages subpath
    const pathSegments = pathname.split('/').filter(Boolean);
    if (pathSegments.length > 0 && pathSegments[0] !== 'api') {
      const repoName = pathSegments[0];
      return `/${repoName}/api/v1`;
    }
  }
  return '/api/v1';
}

const BASE_URL = getApiBaseUrl();

/**
 * Fetch list of all Pokémon summary records (lightweight ID, name, typing, stats)
 */
export async function getPokemonIndex(): Promise<DataPokemonSummary[]> {
  const res = await fetch(`${BASE_URL}/pokemon/index.json`);
  if (!res.ok) throw new Error(`Failed to load Pokémon index (${res.status})`);
  return res.json();
}

/**
 * Fetch detailed data for a specific Pokémon by ID or name
 */
export async function getPokemonDetail(idOrName: string | number): Promise<DataPokemonDetail> {
  const key = String(idOrName).toLowerCase().trim();
  const res = await fetch(`${BASE_URL}/pokemon/${key}.json`);
  if (!res.ok) throw new Error(`Failed to load Pokémon detail for '${key}' (${res.status})`);
  return res.json();
}

/**
 * Filter and query Pokémon summaries
 */
export async function queryPokemon(options: PokemonFilterOptions = {}): Promise<DataPokemonSummary[]> {
  let list = await getPokemonIndex();

  if (options.query) {
    const q = options.query.toLowerCase().trim();
    list = list.filter((p) => p.name.includes(q) || String(p.id) === q);
  }

  if (options.type) {
    const t = options.type.toLowerCase();
    list = list.filter((p) => p.types.includes(t));
  }

  if (options.generation) {
    list = list.filter((p) => p.generation <= options.generation!);
  }

  if (options.isFullyEvolved !== undefined) {
    list = list.filter((p) => p.is_fully_evolved === options.isFullyEvolved);
  }

  if (options.isLegendary !== undefined) {
    list = list.filter((p) => p.is_legendary === options.isLegendary);
  }

  if (options.isMythical !== undefined) {
    list = list.filter((p) => p.is_mythical === options.isMythical);
  }

  if (options.minStatTotal !== undefined || options.maxStatTotal !== undefined) {
    list = list.filter((p) => {
      const stats = p.stats;
      const total =
        (stats.hp || 0) +
        (stats.attack || 0) +
        (stats.defense || 0) +
        (stats.special_attack || stats.special || 0) +
        (stats.special_defense || stats.special || 0) +
        (stats.speed || 0);
      
      if (options.minStatTotal !== undefined && total < options.minStatTotal) return false;
      if (options.maxStatTotal !== undefined && total > options.maxStatTotal) return false;
      return true;
    });
  }

  const offset = options.offset || 0;
  const limit = options.limit ? offset + options.limit : list.length;
  return list.slice(offset, limit);
}

/**
 * Fetch list of all moves
 */
export async function getMovesIndex(): Promise<DataMoveSummary[]> {
  const res = await fetch(`${BASE_URL}/moves/index.json`);
  if (!res.ok) throw new Error(`Failed to load moves index (${res.status})`);
  return res.json();
}

/**
 * Fetch detailed data for a single move by ID or slug name
 */
export async function getMoveDetail(idOrSlug: string | number): Promise<DataMoveDetail> {
  const key = String(idOrSlug).toLowerCase().trim();
  const res = await fetch(`${BASE_URL}/moves/${key}.json`);
  if (!res.ok) throw new Error(`Failed to load move detail for '${key}' (${res.status})`);
  return res.json();
}

/**
 * Fetch list of all type names
 */
export async function getTypesIndex(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/types/index.json`);
  if (!res.ok) throw new Error(`Failed to load types index (${res.status})`);
  return res.json();
}

/**
 * Fetch detailed effectiveness data for a single type
 */
export async function getTypeDetail(typeName: string): Promise<DataTypeDetail> {
  const key = typeName.toLowerCase().trim();
  const res = await fetch(`${BASE_URL}/types/${key}.json`);
  if (!res.ok) throw new Error(`Failed to load type detail for '${key}' (${res.status})`);
  return res.json();
}

/**
 * Fetch list of all natures
 */
export async function getNaturesIndex(): Promise<DataNature[]> {
  const res = await fetch(`${BASE_URL}/natures/index.json`);
  if (!res.ok) throw new Error(`Failed to load natures index (${res.status})`);
  return res.json();
}

/**
 * Fetch single nature by ID name
 */
export async function getNatureDetail(natureName: string): Promise<DataNature> {
  const key = natureName.toLowerCase().trim();
  const res = await fetch(`${BASE_URL}/natures/${key}.json`);
  if (!res.ok) throw new Error(`Failed to load nature detail for '${key}' (${res.status})`);
  return res.json();
}

/**
 * Fetch list of game generations and versions
 */
export async function getGenerations(): Promise<DataGeneration[]> {
  const res = await fetch(`${BASE_URL}/generations.json`);
  if (!res.ok) throw new Error(`Failed to load generations (${res.status})`);
  return res.json();
}
