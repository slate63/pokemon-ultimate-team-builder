import { Team } from '../types';

export interface SavedState {
  gameId: string;
  versionId: string;
  teamPokemonIds: (number | null)[];
  shinies: boolean[];
  natures?: string[];
}

/**
 * Encodes active game, version, and team Pokémon IDs into URL Hash
 * Example: #game=national&version=all&team=1,6,25,130,143,248&shiny=0,1,0,0,0,0&nature=hardy,adamant,jolly,hardy,hardy,hardy
 */
export function encodeTeamToUrlHash(gameId: string, versionId: string, team: Team): string {
  const hasTeam = team.some(m => m !== null);
  if (!hasTeam && gameId === 'national' && versionId === 'all') {
    return window.location.pathname + window.location.search;
  }

  const ids = team.map(m => (m ? m.pokemon.id : 0));
  const shinies = team.map(m => (m && m.isShiny ? 1 : 0));
  const natures = team.map(m => (m && m.selectedNature ? m.selectedNature : 'hardy'));

  const params = new URLSearchParams();
  params.set('game', gameId);
  params.set('version', versionId);
  params.set('team', ids.join(','));
  if (shinies.some(s => s === 1)) {
    params.set('shiny', shinies.join(','));
  }
  if (team.some(m => m && m.selectedNature)) {
    params.set('nature', natures.join(','));
  }

  return `#${params.toString()}`;
}

/**
 * Decodes URL Hash back into game ID, version ID, and team parameters
 */
export function decodeUrlHash(): { gameId: string; versionId: string; pokemonIds: number[]; shinyFlags: boolean[]; natures: string[] } | null {
  const hash = window.location.hash.replace(/^#/, '');
  if (!hash) return null;

  try {
    const params = new URLSearchParams(hash);
    const gameId = params.get('game') || 'national';
    const versionId = params.get('version') || 'all';
    const teamStr = params.get('team');
    const shinyStr = params.get('shiny');
    const natureStr = params.get('nature');

    if (!params.has('game') && !params.has('version') && !teamStr) return null;

    const pokemonIds = teamStr
      ? teamStr.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id))
      : [];

    const shinyFlags = shinyStr
      ? shinyStr.split(',').map(s => s === '1')
      : Array(pokemonIds.length).fill(false);

    const natures = natureStr
      ? natureStr.split(',')
      : Array(pokemonIds.length).fill('hardy');

    return { gameId, versionId, pokemonIds, shinyFlags, natures };
  } catch (e) {
    console.error('Failed to parse URL state hash', e);
    return null;
  }
}
