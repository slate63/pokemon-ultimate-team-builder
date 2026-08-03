export interface PokemonStats {
  generation: number;
  number: number;
  hp: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  special?: number; // Gen 1 only — single "Special" stat instead of split
  speed: number;
}