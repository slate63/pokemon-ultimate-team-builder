import { useState, useMemo, useEffect } from 'react';
import { Pokemon, ResolvedPokemon, PokemonType } from '../types';
import { resolvePokemon, GAME_DEXES } from '../data/pokemonData';
import { POKEMON_TYPES } from '../utils/coverage';

const TRADE_EVO_TO_LOWER: Record<number, number> = {
  65: 64,   // Alakazam -> Kadabra
  68: 67,   // Machamp -> Machoke
  76: 75,   // Golem -> Graveler
  94: 93,   // Gengar -> Haunter
  186: 61,  // Politoed -> Poliwhirl
  199: 79,  // Slowking -> Slowpoke
  208: 95,  // Steelix -> Onix
  212: 123, // Scizor -> Scyther
  230: 117, // Kingdra -> Seadra
  233: 137, // Porygon2 -> Porygon
  350: 349, // Milotic -> Feebas
  367: 366, // Huntail -> Clamperl
  368: 366, // Gorebyss -> Clamperl
  464: 112, // Rhyperior -> Rhydon
  466: 125, // Electivire -> Electabuzz
  467: 126, // Magmortar -> Magmar
  474: 233, // Porygon-Z -> Porygon2
  477: 356, // Dusknoir -> Dusclops
  526: 525, // Gigalith -> Boldore
  534: 533, // Conkeldurr -> Gurdurr
  589: 588, // Escavalier -> Karrablast
  617: 616, // Accelgor -> Shelmet
  683: 682, // Aromatisse -> Spritzee
  685: 684, // Slurpuff -> Swirlix
  709: 708, // Trevenant -> Phantump
  711: 710, // Gourgeist -> Pumpkaboo
};

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
  const [excludeTrades, setExcludeTrades] = useState<boolean>(false);
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

    const resolvedList = pokemonRoster
      .map((p) => resolvePokemon(p, activeGen))
      .filter((p): p is ResolvedPokemon => p !== undefined);

    const resolvedMap = new Map<number, ResolvedPokemon>();
    for (const p of resolvedList) {
      resolvedMap.set(p.id, p);
    }

    const getUltimateLowerEvolution = (id: number): number | null => {
      let currentId = id;
      while (true) {
        const lowerId = TRADE_EVO_TO_LOWER[currentId];
        if (!lowerId) return null;

        const lowerResolved = resolvedMap.get(lowerId);
        if (!lowerResolved) return null;

        if (lowerResolved.requires_trade) {
          currentId = lowerId;
        } else {
          return lowerId;
        }
      }
    };

    const promotedSet = new Set<number>();
    if (excludeTrades) {
      for (const p of resolvedList) {
        if (p.requires_trade) {
          const lowerId = getUltimateLowerEvolution(p.id);
          if (lowerId !== null) {
            promotedSet.add(lowerId);
          }
        }
      }
    }

    return resolvedList
      .filter((p) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(q);
          const matchId = String(p.id) === q || String(p.id).padStart(3, '0') === q;
          if (!matchName && !matchId) return false;
        }

        if (selectedType1 && !p.types.includes(selectedType1)) return false;
        if (selectedType2 && !p.types.includes(selectedType2)) return false;

        if (excludeTrades && p.requires_trade) return false;

        if (fullyEvolvedOnly && p.is_fully_evolved === false) {
          const isPromoted = excludeTrades && promotedSet.has(p.id);
          if (!isPromoted) return false;
        }
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
    excludeTrades,
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
    excludeTrades,
    setExcludeTrades,
    includeLegendaries,
    setIncludeLegendaries,
    includeMythicals,
    setIncludeMythicals,
    sortBy,
    setSortBy,
    filteredRoster,
  };
}
