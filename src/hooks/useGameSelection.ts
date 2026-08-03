import { useState, useEffect, useMemo } from 'react';
import { GAME_DEXES } from '../data/pokemonData';
import { loadTypeChartForGen, TypeChartData } from '../utils/typeChart';
import { getSpriteStyleForVersion, getAvailableSpriteOptions } from '../utils/spriteUtils';

export function useGameSelection() {
  const [selectedGameId, setSelectedGameId] = useState<string>('national');
  const [selectedVersionId, setSelectedVersionId] = useState<string>('all');
  const [spriteStyle, setSpriteStyle] = useState<string>(() => {
    try {
      return localStorage.getItem('pokemon_sprite_style') || 'showdown';
    } catch {
      return 'showdown';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('pokemon_sprite_style', spriteStyle);
    } catch (e) {
      console.error('Failed to save spriteStyle to localStorage', e);
    }
  }, [spriteStyle]);

  const [typeChartData, setTypeChartData] = useState<TypeChartData | null>(null);

  const activeGen = useMemo(() => {
    const selectedDex = GAME_DEXES.find((d) => d.id === selectedGameId);
    return selectedDex ? selectedDex.generation : 9;
  }, [selectedGameId]);

  useEffect(() => {
    const validOptions = getAvailableSpriteOptions(selectedGameId, activeGen);
    const isValid = validOptions.some((opt) => opt.value === spriteStyle);
    if (!isValid) {
      const fallback = getSpriteStyleForVersion(selectedVersionId, selectedGameId);
      const isFallbackValid = validOptions.some((opt) => opt.value === fallback);
      setSpriteStyle(isFallbackValid ? fallback : 'showdown');
    }
  }, [selectedGameId, selectedVersionId, activeGen, spriteStyle]);

  useEffect(() => {
    let cancelled = false;
    loadTypeChartForGen(activeGen)
      .then((data) => {
        if (!cancelled) setTypeChartData(data);
      })
      .catch((err) => console.error('Failed to load type chart for gen', activeGen, err));
    return () => {
      cancelled = true;
    };
  }, [activeGen]);

  const handleGameChange = (id: string) => {
    setSelectedGameId(id);
    setSelectedVersionId('all');
    setSpriteStyle(getSpriteStyleForVersion('all', id));
  };

  const handleVersionChange = (versionId: string) => {
    setSelectedVersionId(versionId);
    setSpriteStyle(getSpriteStyleForVersion(versionId, selectedGameId));
  };

  return {
    selectedGameId,
    setSelectedGameId,
    selectedVersionId,
    setSelectedVersionId,
    spriteStyle,
    setSpriteStyle,
    activeGen,
    typeChartData,
    handleGameChange,
    handleVersionChange,
  };
}

