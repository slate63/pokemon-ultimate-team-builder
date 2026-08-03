import { useState, useMemo, useCallback } from 'react';
import { Team, ResolvedPokemon, ResolvedTeam, Pokemon } from '../types';
import { resolveTeam } from '../data/pokemonData';
import { ALL_NATURES } from '../utils/natureUtils';

export function useTeam(
  rosterById: Map<number, Pokemon>,
  activeGen: number,
  spriteStyle: string
) {
  const [team, setTeam] = useState<Team>(Array(6).fill(null));
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(0);

  const resolvedTeam: ResolvedTeam = useMemo(
    () => resolveTeam(team, activeGen),
    [team, activeGen]
  );

  const handleAddPokemonToTeam = useCallback(
    (resolved: ResolvedPokemon) => {
      const raw = rosterById.get(resolved.id);
      if (!raw) return;

      const emptyIdx = team.findIndex((m) => m === null);
      const targetIdx = emptyIdx !== -1 ? emptyIdx : (activeSlotIndex ?? 0);

      const newTeam = [...team];
      newTeam[targetIdx] = {
        slotIndex: targetIdx,
        pokemon: raw,
        isShiny: false,
        selectedNature: activeGen >= 3 ? 'hardy' : undefined,
      };

      setTeam(newTeam);

      const nextEmpty = newTeam.findIndex((m) => m === null);
      setActiveSlotIndex(nextEmpty !== -1 ? nextEmpty : targetIdx);
    },
    [rosterById, activeSlotIndex, team, activeGen]
  );

  const handleRemoveMember = useCallback((index: number) => {
    setTeam((prev) => {
      const nonRemoved = prev.filter((_, idx) => idx !== index);
      const shifted = [...nonRemoved, null];
      const newTeam: Team = shifted.map((member, idx) => {
        if (!member) return null;
        return {
          ...member,
          slotIndex: idx,
        };
      });

      const nextEmpty = newTeam.findIndex((m) => m === null);
      setActiveSlotIndex(nextEmpty !== -1 ? nextEmpty : 0);

      return newTeam;
    });
  }, []);

  const handleToggleShiny = useCallback((index: number) => {
    setTeam((prev) => {
      const member = prev[index];
      if (!member) return prev;
      const newTeam = [...prev];
      newTeam[index] = { ...member, isShiny: !member.isShiny };
      return newTeam;
    });
  }, []);

  const handleNatureChange = useCallback((index: number, natureId: string) => {
    setTeam((prev) => {
      const member = prev[index];
      if (!member) return prev;
      const newTeam = [...prev];
      newTeam[index] = { ...member, selectedNature: natureId };
      return newTeam;
    });
  }, []);

  const handleClearTeam = useCallback(() => {
    setTeam(Array(6).fill(null));
    setActiveSlotIndex(0);
  }, []);

  const handleRandomizeTeam = useCallback(
    (availableRoster: ResolvedPokemon[]) => {
      if (availableRoster.length === 0) return;
      const shuffled = [...availableRoster].sort(() => 0.5 - Math.random());
      const random6 = shuffled.slice(0, 6);
      const newTeam: Team = Array(6).fill(null);
      const isGen1Options =
        activeGen === 1 || spriteStyle === 'red-blue' || spriteStyle === 'yellow';

      random6.forEach((rp, idx) => {
        const raw = rosterById.get(rp.id);
        if (raw) {
          const randomNature = ALL_NATURES[Math.floor(Math.random() * ALL_NATURES.length)].id;
          newTeam[idx] = {
            slotIndex: idx,
            pokemon: raw,
            isShiny: isGen1Options ? false : Math.random() > 0.85,
            selectedNature: activeGen >= 3 ? randomNature : undefined,
          };
        }
      });
      setTeam(newTeam);
    },
    [activeGen, spriteStyle, rosterById]
  );

  return {
    team,
    setTeam,
    activeSlotIndex,
    setActiveSlotIndex,
    resolvedTeam,
    handleAddPokemonToTeam,
    handleRemoveMember,
    handleToggleShiny,
    handleNatureChange,
    handleClearTeam,
    handleRandomizeTeam,
  };
}
