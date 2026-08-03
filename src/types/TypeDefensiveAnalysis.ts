import { PokemonType } from './PokemonType';

export interface TypeDefensiveAnalysis {
  type: PokemonType;
  weak4x: number;
  weak2x: number;
  neutral: number;
  resistHalf: number;
  resistQuarter: number;
  immune: number;
  effectiveMultiplier: number;
  netScore: number; // For sorting or summary
}