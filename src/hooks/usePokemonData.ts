import { useState, useEffect, useMemo } from 'react';
import { Pokemon } from '../types';
import { loadFullPokemonList } from '../data/pokemonData';

export function usePokemonData() {
  const [pokemonRoster, setPokemonRoster] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    async function init() {
      setLoading(true);
      const list = await loadFullPokemonList();
      if (active) {
        setPokemonRoster(list);
        setLoading(false);
      }
    }
    init();
    return () => {
      active = false;
    };
  }, []);

  const rosterById = useMemo(() => {
    const map = new Map<number, Pokemon>();
    for (const p of pokemonRoster) map.set(p.id, p);
    return map;
  }, [pokemonRoster]);

  return {
    pokemonRoster,
    setPokemonRoster,
    loading,
    setLoading,
    rosterById,
  };
}
