export interface Nature {
  id: string;
  name: string;
  increasedStat: 'attack' | 'defense' | 'special_attack' | 'special_defense' | 'speed' | null;
  decreasedStat: 'attack' | 'defense' | 'special_attack' | 'special_defense' | 'speed' | null;
  increasedStatName?: string;
  decreasedStatName?: string;
}
