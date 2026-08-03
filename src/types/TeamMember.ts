import { Pokemon } from './Pokemon';

export interface TeamMember {
  slotIndex: number;
  pokemon: Pokemon;
  nickname?: string;
  isShiny?: boolean;
  selectedAbility?: string;
  selectedMoves?: string[];
  selectedNature?: string;
}