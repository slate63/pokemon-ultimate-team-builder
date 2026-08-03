import { PokemonType } from './PokemonType';

export interface TypeOffensiveAnalysis {
  type: PokemonType;
  superEffectiveMembers: number; // How many team members have a STAB move against this type
}