import { useState, useCallback } from 'react';
import { Pokemon, ResolvedPokemon } from '../types';
import { resolvePokemon } from '../data/pokemonData';

export function usePokemonInspector(rosterById: Map<number, Pokemon>, activeGen: number) {
  const [inspectedPokemon, setInspectedPokemon] = useState<ResolvedPokemon | null>(null);
  const [inspectedNature, setInspectedNature] = useState<string>('hardy');
  const [inspectedSlotIndex, setInspectedSlotIndex] = useState<number | null>(null);

  const handleInspectPokemon = useCallback(
    async (rp: ResolvedPokemon, natureId?: string, slotIndex?: number | null) => {
      const raw = rosterById.get(rp.id);
      const baseResolved = raw ? resolvePokemon(raw, activeGen) : rp;
      setInspectedPokemon(baseResolved || rp);
      setInspectedNature(natureId || 'hardy');
      setInspectedSlotIndex(slotIndex !== undefined ? slotIndex : null);

      if (typeof window !== 'undefined' && (window as any).__POKEMON_DATA__) {
        return;
      }

      try {
        const dirName =
          rp.id < 1000
            ? `${String(rp.id).padStart(3, '0')}-${rp.name.toLowerCase().replace(' ', '-')}`
            : `${rp.id}-${rp.name.toLowerCase().replace(' ', '-')}`;
        const res = await fetch(`./data/pokemon/${dirName}/data.json`);

        if (res.ok) {
          const detailedData = await res.json();
          setInspectedPokemon((current) => {
            if (current?.id !== rp.id) return current;
            const genData = detailedData.generations[activeGen.toString()];
            return {
              ...current,
              abilities: genData?.abilities || [],
              availability: genData?.availability || [],
              description: genData?.description || detailedData.description,
            };
          });
        }
      } catch (e) {
        console.warn('Failed to fetch detailed data', e);
      }
    },
    [rosterById, activeGen]
  );

  const handleCloseInspector = useCallback(() => {
    setInspectedPokemon(null);
    setInspectedSlotIndex(null);
  }, []);

  return {
    inspectedPokemon,
    setInspectedPokemon,
    inspectedNature,
    setInspectedNature,
    inspectedSlotIndex,
    handleInspectPokemon,
    handleCloseInspector,
  };
}
