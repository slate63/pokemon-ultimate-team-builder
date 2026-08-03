import { ResolvedPokemon } from './ResolvedPokemon';
import { Nature } from './Nature';

export interface ResolvedTeamMember {
  slotIndex: number;
  pokemon: ResolvedPokemon;
  nickname?: string;
  isShiny?: boolean;
  selectedAbility?: string;
  selectedMoves?: string[];
  selectedNature?: string;
  nature?: Nature;
}