import { useState, useMemo, useEffect } from 'react';
import { Pokemon, ResolvedPokemon, PokemonType } from '../types';
import { resolvePokemon, GAME_DEXES } from '../data/pokemonData';
import { POKEMON_TYPES } from '../utils/coverage';

function getValidTypesForGen(gen: number): PokemonType[] {
  if (gen === 1) {
    return [
      'normal', 'fire', 'water', 'grass', 'electric', 'ice',
      'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
      'rock', 'ghost', 'dragon'
    ];
  }
  if (gen < 6) {
    return [
      'normal', 'fire', 'water', 'grass', 'electric', 'ice',
      'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
      'rock', 'ghost', 'dragon', 'steel', 'dark'
    ];
  }
  return POKEMON_TYPES;
}

export function useFilters(
  pokemonRoster: Pokemon[],
  activeGen: number,
  selectedGameId: string,
  selectedVersionId: string
) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType1, setSelectedType1] = useState<PokemonType | ''>('');
  const [selectedType2, setSelectedType2] = useState<PokemonType | ''>('');
  const [fullyEvolvedOnly, setFullyEvolvedOnly] = useState<boolean>(true);
  const [includeLegendaries, setIncludeLegendaries] = useState<boolean>(true);
  const [includeMythicals, setIncludeMythicals] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<string>('gen-num-type');

  useEffect(() => {
    const validTypes = getValidTypesForGen(activeGen);
    if (selectedType1 && !validTypes.includes(selectedType1)) {
      setSelectedType1('');
    }
    if (selectedType2 && !validTypes.includes(selectedType2)) {
      setSelectedType2('');
    }
  }, [activeGen, selectedType1, selectedType2]);

  const filteredRoster: ResolvedPokemon[] = useMemo(() => {
    const selectedDex = GAME_DEXES.find((d) => d.id === selectedGameId);

    const getNativeGen = (id: number): number => {
      if (id <= 151) return 1;
      if (id <= 251) return 2;
      if (id <= 386) return 3;
      if (id <= 493) return 4;
      if (id <= 649) return 5;
      if (id <= 721) return 6;
      if (id <= 809) return 7;
      if (id <= 905) return 8;
      return 9;
    };

    return pokemonRoster
      .map((p) => resolvePokemon(p, activeGen))
      .filter((p): p is ResolvedPokemon => p !== undefined)
      .filter((p) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(q);
          const matchId = String(p.id) === q || String(p.id).padStart(3, '0') === q;
          if (!matchName && !matchId) return false;
        }

        if (selectedType1 && !p.types.includes(selectedType1)) return false;
        if (selectedType2 && !p.types.includes(selectedType2)) return false;

        if (fullyEvolvedOnly && p.is_fully_evolved === false) return false;
        if (!includeLegendaries && p.is_legendary) return false;
        if (!includeMythicals && p.is_mythical) return false;

        // Filter by Game Version / Dex Availability
        if (selectedGameId !== 'national') {
          if (selectedVersionId && selectedVersionId !== 'all') {
            if (!p.availability || !p.availability.includes(selectedVersionId)) {
              return false;
            }
          } else {
            const availableGames = p.availability ?? [];
            const isCatchableInDex = selectedDex
              ? availableGames.some((g) => selectedDex.games.includes(g))
              : availableGames.length > 0;

            const isNativeMythical = includeMythicals && p.is_mythical && getNativeGen(p.id) <= activeGen;

            if (!isCatchableInDex && !isNativeMythical) {
              return false;
            }
          }
        } else {
          if (selectedVersionId && selectedVersionId !== 'all') {
            if (!p.availability || !p.availability.includes(selectedVersionId)) {
              return false;
            }
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'gen-num-type') {
          const nativeGenA = getNativeGen(a.id);
          const nativeGenB = getNativeGen(b.id);
          if (nativeGenA !== nativeGenB) return nativeGenA - nativeGenB;
          if (a.id !== b.id) return a.id - b.id;
          return a.types.join(',').localeCompare(b.types.join(','));
        }
        if (sortBy === 'id-desc') return b.id - a.id;
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);

        const specialTotal = (s: typeof a.stats) =>
          s.special != null
            ? s.special
            : (s.special_attack ?? 0) + (s.special_defense ?? 0);

        if (sortBy === 'bst-desc') {
          const bstA =
            a.stats.hp + a.stats.attack + a.stats.defense + specialTotal(a.stats) + a.stats.speed;
          const bstB =
            b.stats.hp + b.stats.attack + b.stats.defense + specialTotal(b.stats) + b.stats.speed;
          return bstB - bstA;
        }
        if (sortBy === 'attack-desc') return b.stats.attack - a.stats.attack;
        if (sortBy === 'spatk-desc') {
          const aSpAtk = a.stats.special ?? a.stats.special_attack;
          const bSpAtk = b.stats.special ?? b.stats.special_attack;
          return bSpAtk - aSpAtk;
        }
        if (sortBy === 'speed-desc') return b.stats.speed - a.stats.speed;
        return a.id - b.id;
      });
  }, [
    pokemonRoster,
    activeGen,
    selectedGameId,
    selectedVersionId,
    searchQuery,
    selectedType1,
    selectedType2,
    fullyEvolvedOnly,
    includeLegendaries,
    includeMythicals,
    sortBy,
  ]);

  return {
    searchQuery,
    setSearchQuery,
    selectedType1,
    setSelectedType1,
    selectedType2,
    setSelectedType2,
    fullyEvolvedOnly,
    setFullyEvolvedOnly,
    includeLegendaries,
    setIncludeLegendaries,
    includeMythicals,
    setIncludeMythicals,
    sortBy,
    setSortBy,
    filteredRoster,
  };
}
