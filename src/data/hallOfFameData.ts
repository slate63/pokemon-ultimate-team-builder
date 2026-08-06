export interface HallOfFameTeam {
  rank: number;
  pokemon: number[];
}

export interface HallOfFameGame {
  gameId: string;
  name: string;
  badge: string;
  teams: HallOfFameTeam[];
}

export const HALL_OF_FAME_DATA: HallOfFameGame[] = [];
