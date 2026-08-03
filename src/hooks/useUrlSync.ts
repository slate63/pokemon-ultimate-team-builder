import { useEffect } from 'react';
import { Pokemon, Team } from '../types';
import { decodeUrlHash, encodeTeamToUrlHash } from '../utils/urlState';

export function useUrlSync(
  pokemonRoster: Pokemon[],
  loading: boolean,
  selectedGameId: string,
  setSelectedGameId: (id: string) => void,
  selectedVersionId: string,
  setSelectedVersionId: (id: string) => void,
  team: Team,
  setTeam: (team: Team) => void,
  handleVersionChange?: (id: string) => void
) {
  // Decode URL hash on initial load once pokemonRoster is loaded
  useEffect(() => {
    if (!loading && pokemonRoster.length > 0) {
      const saved = decodeUrlHash();
      if (saved) {
        if (saved.gameId) setSelectedGameId(saved.gameId);
        if (saved.versionId) {
          if (handleVersionChange) {
            handleVersionChange(saved.versionId);
          } else {
            setSelectedVersionId(saved.versionId);
          }
        }


        const newTeam: Team = Array(6).fill(null);
        saved.pokemonIds.forEach((id, idx) => {
          if (idx < 6 && id > 0) {
            const found = pokemonRoster.find((p) => p.id === id);
            if (found) {
              newTeam[idx] = {
                slotIndex: idx,
                pokemon: found,
                isShiny: saved.shinyFlags[idx] || false,
                selectedNature: saved.natures?.[idx] || 'hardy',
              };
            }
          }
        });
        setTeam(newTeam);
      }
    }
  }, [loading, pokemonRoster]);

  // Update URL hash whenever game, version, or team changes
  useEffect(() => {
    if (!loading && pokemonRoster.length > 0) {
      try {
        const hash = encodeTeamToUrlHash(selectedGameId, selectedVersionId, team);
        window.history.replaceState(null, '', hash);
      } catch (e) {
        console.warn('Could not update URL history state:', e);
      }
    }
  }, [selectedGameId, selectedVersionId, team, loading, pokemonRoster]);
}
