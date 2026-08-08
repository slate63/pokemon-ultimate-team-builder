export interface HallOfFameTeam {
  rank: number;
  pokemon: number[];
}

export interface HallOfFameStarterGroup {
  /** National dex numbers of the starters every team in this group is built around. */
  starters: number[];
  name: string;
  teams: HallOfFameTeam[];
}

export interface HallOfFameGame {
  gameId: string;
  name: string;
  badge: string;
  /** Top teams by the balanced composite score (stats + type coverage). */
  teams: HallOfFameTeam[];
  /** Best teams when a given starter line is locked into a slot. */
  starterTeams?: HallOfFameStarterGroup[];
  /** Top teams ranked by raw base-stat total alone. */
  bstTeams?: HallOfFameTeam[];
  /** Raw-BST teams with a given starter line locked in. */
  bstStarterTeams?: HallOfFameStarterGroup[];
}

export const HALL_OF_FAME_DATA: HallOfFameGame[] = [
  {
    gameId: 'red',
    name: 'Red',
    badge: '🔴',
    teams: [
      { rank: 1, pokemon: [93, 103, 112, 121, 130, 149] },
      { rank: 2, pokemon: [62, 93, 103, 112, 130, 149] },
      { rank: 3, pokemon: [62, 93, 103, 130, 135, 149] },
      { rank: 4, pokemon: [80, 93, 103, 112, 130, 149] },
      { rank: 5, pokemon: [93, 112, 121, 130, 135, 149] },
    ],
    starterTeams: [
      {
        starters: [3],
        name: 'Venusaur',
        teams: [
          { rank: 1, pokemon: [3, 93, 112, 121, 130, 149] },
          { rank: 2, pokemon: [3, 80, 93, 112, 130, 149] },
          { rank: 3, pokemon: [3, 75, 93, 121, 130, 149] },
          { rank: 4, pokemon: [3, 112, 121, 130, 135, 149] },
          { rank: 5, pokemon: [3, 93, 112, 121, 128, 130] },
        ],
      },
      {
        starters: [6],
        name: 'Charizard',
        teams: [
          { rank: 1, pokemon: [6, 93, 103, 112, 121, 149] },
          { rank: 2, pokemon: [6, 62, 93, 103, 112, 149] },
          { rank: 3, pokemon: [6, 62, 93, 97, 135, 149] },
          { rank: 4, pokemon: [6, 62, 93, 103, 135, 149] },
          { rank: 5, pokemon: [6, 57, 93, 121, 135, 149] },
        ],
      },
      {
        starters: [9],
        name: 'Blastoise',
        teams: [
          { rank: 1, pokemon: [9, 93, 103, 112, 130, 149] },
          { rank: 2, pokemon: [9, 62, 93, 103, 135, 149] },
          { rank: 3, pokemon: [9, 93, 97, 112, 130, 149] },
          { rank: 4, pokemon: [9, 93, 97, 103, 112, 130] },
          { rank: 5, pokemon: [9, 97, 112, 130, 135, 149] },
        ],
      },
    ],
    bstTeams: [
      { rank: 1, pokemon: [59, 91, 103, 128, 130, 149] },
      { rank: 2, pokemon: [59, 91, 103, 130, 131, 149] },
      { rank: 3, pokemon: [59, 91, 128, 130, 131, 149] },
      { rank: 4, pokemon: [91, 103, 128, 130, 131, 149] },
      { rank: 5, pokemon: [59, 91, 103, 112, 130, 149] },
    ],
    bstStarterTeams: [
      {
        starters: [3],
        name: 'Venusaur',
        teams: [
          { rank: 1, pokemon: [3, 59, 91, 103, 130, 149] },
          { rank: 2, pokemon: [3, 59, 91, 128, 130, 149] },
          { rank: 3, pokemon: [3, 59, 91, 130, 131, 149] },
          { rank: 4, pokemon: [3, 91, 103, 128, 130, 149] },
          { rank: 5, pokemon: [3, 91, 103, 130, 131, 149] },
        ],
      },
      {
        starters: [6],
        name: 'Charizard',
        teams: [
          { rank: 1, pokemon: [6, 59, 91, 103, 130, 149] },
          { rank: 2, pokemon: [6, 59, 91, 128, 130, 149] },
          { rank: 3, pokemon: [6, 59, 91, 130, 131, 149] },
          { rank: 4, pokemon: [6, 91, 103, 128, 130, 149] },
          { rank: 5, pokemon: [6, 91, 103, 130, 131, 149] },
        ],
      },
      {
        starters: [9],
        name: 'Blastoise',
        teams: [
          { rank: 1, pokemon: [9, 59, 91, 103, 130, 149] },
          { rank: 2, pokemon: [9, 59, 91, 128, 130, 149] },
          { rank: 3, pokemon: [9, 59, 91, 130, 131, 149] },
          { rank: 4, pokemon: [9, 91, 103, 128, 130, 149] },
          { rank: 5, pokemon: [9, 91, 103, 130, 131, 149] },
        ],
      },
    ],
  },
  {
    gameId: 'blue',
    name: 'Blue',
    badge: '🔵',
    teams: [
      { rank: 1, pokemon: [93, 103, 112, 121, 130, 149] },
      { rank: 2, pokemon: [62, 93, 103, 112, 130, 149] },
      { rank: 3, pokemon: [62, 93, 103, 130, 135, 149] },
      { rank: 4, pokemon: [80, 93, 103, 112, 130, 149] },
      { rank: 5, pokemon: [93, 112, 121, 130, 135, 149] },
    ],
    starterTeams: [
      {
        starters: [3],
        name: 'Venusaur',
        teams: [
          { rank: 1, pokemon: [3, 93, 112, 121, 130, 149] },
          { rank: 2, pokemon: [3, 80, 93, 112, 130, 149] },
          { rank: 3, pokemon: [3, 93, 112, 121, 127, 130] },
          { rank: 4, pokemon: [3, 93, 112, 121, 127, 149] },
          { rank: 5, pokemon: [3, 75, 93, 121, 130, 149] },
        ],
      },
      {
        starters: [6],
        name: 'Charizard',
        teams: [
          { rank: 1, pokemon: [6, 93, 103, 112, 121, 149] },
          { rank: 2, pokemon: [6, 62, 93, 103, 112, 149] },
          { rank: 3, pokemon: [6, 62, 93, 97, 135, 149] },
          { rank: 4, pokemon: [6, 62, 93, 103, 135, 149] },
          { rank: 5, pokemon: [6, 80, 93, 103, 112, 149] },
        ],
      },
      {
        starters: [9],
        name: 'Blastoise',
        teams: [
          { rank: 1, pokemon: [9, 93, 103, 112, 130, 149] },
          { rank: 2, pokemon: [9, 93, 103, 112, 127, 130] },
          { rank: 3, pokemon: [9, 62, 93, 103, 135, 149] },
          { rank: 4, pokemon: [9, 93, 97, 112, 130, 149] },
          { rank: 5, pokemon: [9, 93, 97, 103, 112, 130] },
        ],
      },
    ],
    bstTeams: [
      { rank: 1, pokemon: [91, 103, 128, 130, 131, 149] },
      { rank: 2, pokemon: [91, 103, 112, 128, 130, 149] },
      { rank: 3, pokemon: [91, 103, 128, 130, 142, 149] },
      { rank: 4, pokemon: [91, 103, 112, 130, 131, 149] },
      { rank: 5, pokemon: [91, 103, 130, 131, 142, 149] },
    ],
    bstStarterTeams: [
      {
        starters: [3],
        name: 'Venusaur',
        teams: [
          { rank: 1, pokemon: [3, 91, 103, 128, 130, 149] },
          { rank: 2, pokemon: [3, 91, 103, 130, 131, 149] },
          { rank: 3, pokemon: [3, 91, 128, 130, 131, 149] },
          { rank: 4, pokemon: [3, 91, 103, 112, 130, 149] },
          { rank: 5, pokemon: [3, 91, 103, 130, 142, 149] },
        ],
      },
      {
        starters: [6],
        name: 'Charizard',
        teams: [
          { rank: 1, pokemon: [6, 91, 103, 128, 130, 149] },
          { rank: 2, pokemon: [6, 91, 103, 130, 131, 149] },
          { rank: 3, pokemon: [6, 91, 128, 130, 131, 149] },
          { rank: 4, pokemon: [6, 91, 103, 112, 130, 149] },
          { rank: 5, pokemon: [6, 91, 103, 130, 142, 149] },
        ],
      },
      {
        starters: [9],
        name: 'Blastoise',
        teams: [
          { rank: 1, pokemon: [9, 91, 103, 128, 130, 149] },
          { rank: 2, pokemon: [9, 91, 103, 130, 131, 149] },
          { rank: 3, pokemon: [9, 91, 128, 130, 131, 149] },
          { rank: 4, pokemon: [9, 91, 103, 112, 130, 149] },
          { rank: 5, pokemon: [9, 91, 103, 130, 142, 149] },
        ],
      },
    ],
  },
  {
    gameId: 'yellow',
    name: 'Yellow',
    badge: '🟡',
    teams: [
      { rank: 1, pokemon: [93, 103, 112, 121, 130, 149] },
      { rank: 2, pokemon: [62, 93, 103, 112, 130, 149] },
      { rank: 3, pokemon: [62, 93, 103, 130, 135, 149] },
      { rank: 4, pokemon: [80, 93, 103, 112, 130, 149] },
      { rank: 5, pokemon: [93, 112, 121, 130, 135, 149] },
    ],
    starterTeams: [
      {
        starters: [25],
        name: 'Pikachu',
        teams: [
          { rank: 1, pokemon: [25, 62, 93, 103, 130, 149] },
          { rank: 2, pokemon: [25, 93, 112, 121, 130, 149] },
          { rank: 3, pokemon: [25, 62, 93, 103, 121, 149] },
          { rank: 4, pokemon: [25, 97, 112, 121, 130, 149] },
          { rank: 5, pokemon: [25, 103, 112, 121, 130, 149] },
        ],
      },
      {
        starters: [3, 25],
        name: 'Pikachu + Venusaur',
        teams: [
          { rank: 1, pokemon: [3, 25, 112, 121, 130, 149] },
          { rank: 2, pokemon: [3, 25, 80, 112, 130, 149] },
          { rank: 3, pokemon: [3, 25, 62, 97, 130, 149] },
          { rank: 4, pokemon: [3, 25, 93, 112, 121, 130] },
          { rank: 5, pokemon: [3, 25, 62, 93, 121, 149] },
        ],
      },
      {
        starters: [6, 25],
        name: 'Pikachu + Charizard',
        teams: [
          { rank: 1, pokemon: [6, 25, 62, 93, 97, 149] },
          { rank: 2, pokemon: [6, 25, 62, 93, 103, 149] },
          { rank: 3, pokemon: [6, 25, 57, 93, 121, 149] },
          { rank: 4, pokemon: [6, 25, 62, 93, 121, 149] },
          { rank: 5, pokemon: [6, 25, 28, 93, 121, 149] },
        ],
      },
      {
        starters: [9, 25],
        name: 'Pikachu + Blastoise',
        teams: [
          { rank: 1, pokemon: [9, 25, 62, 93, 103, 149] },
          { rank: 2, pokemon: [9, 25, 97, 112, 130, 149] },
          { rank: 3, pokemon: [9, 25, 103, 112, 130, 149] },
          { rank: 4, pokemon: [9, 25, 112, 130, 143, 149] },
          { rank: 5, pokemon: [9, 25, 112, 113, 130, 149] },
        ],
      },
      {
        starters: [3, 6, 25],
        name: 'Pikachu + Venusaur + Charizard',
        teams: [
          { rank: 1, pokemon: [3, 6, 25, 112, 121, 149] },
          { rank: 2, pokemon: [3, 6, 25, 93, 121, 149] },
          { rank: 3, pokemon: [3, 6, 25, 80, 112, 149] },
          { rank: 4, pokemon: [3, 6, 25, 28, 93, 121] },
          { rank: 5, pokemon: [3, 6, 25, 62, 97, 149] },
        ],
      },
      {
        starters: [3, 9, 25],
        name: 'Pikachu + Venusaur + Blastoise',
        teams: [
          { rank: 1, pokemon: [3, 9, 25, 97, 112, 130] },
          { rank: 2, pokemon: [3, 9, 25, 62, 97, 149] },
          { rank: 3, pokemon: [3, 9, 25, 103, 112, 130] },
          { rank: 4, pokemon: [3, 9, 25, 57, 121, 149] },
          { rank: 5, pokemon: [3, 9, 25, 97, 112, 149] },
        ],
      },
      {
        starters: [6, 9, 25],
        name: 'Pikachu + Charizard + Blastoise',
        teams: [
          { rank: 1, pokemon: [6, 9, 25, 97, 112, 149] },
          { rank: 2, pokemon: [6, 9, 25, 103, 112, 149] },
          { rank: 3, pokemon: [6, 9, 25, 112, 128, 149] },
          { rank: 4, pokemon: [6, 9, 25, 112, 143, 149] },
          { rank: 5, pokemon: [6, 9, 25, 93, 97, 149] },
        ],
      },
      {
        starters: [3, 6, 9, 25],
        name: 'Pikachu + Venusaur + Charizard + Blastoise',
        teams: [
          { rank: 1, pokemon: [3, 6, 9, 25, 112, 149] },
          { rank: 2, pokemon: [3, 6, 9, 25, 97, 112] },
          { rank: 3, pokemon: [3, 6, 9, 25, 103, 112] },
          { rank: 4, pokemon: [3, 6, 9, 25, 112, 130] },
          { rank: 5, pokemon: [3, 6, 9, 25, 112, 143] },
        ],
      },
    ],
    bstTeams: [
      { rank: 1, pokemon: [59, 91, 103, 128, 130, 149] },
      { rank: 2, pokemon: [59, 91, 103, 130, 131, 149] },
      { rank: 3, pokemon: [59, 91, 128, 130, 131, 149] },
      { rank: 4, pokemon: [91, 103, 128, 130, 131, 149] },
      { rank: 5, pokemon: [59, 91, 103, 112, 130, 149] },
    ],
    bstStarterTeams: [
      {
        starters: [25],
        name: 'Pikachu',
        teams: [
          { rank: 1, pokemon: [25, 59, 91, 103, 130, 149] },
          { rank: 2, pokemon: [25, 59, 91, 128, 130, 149] },
          { rank: 3, pokemon: [25, 59, 91, 130, 131, 149] },
          { rank: 4, pokemon: [25, 91, 103, 128, 130, 149] },
          { rank: 5, pokemon: [25, 91, 103, 130, 131, 149] },
        ],
      },
      {
        starters: [3, 25],
        name: 'Pikachu + Venusaur',
        teams: [
          { rank: 1, pokemon: [3, 25, 59, 91, 130, 149] },
          { rank: 2, pokemon: [3, 25, 91, 103, 130, 149] },
          { rank: 3, pokemon: [3, 25, 91, 128, 130, 149] },
          { rank: 4, pokemon: [3, 25, 91, 130, 131, 149] },
          { rank: 5, pokemon: [3, 25, 91, 112, 130, 149] },
        ],
      },
      {
        starters: [6, 25],
        name: 'Pikachu + Charizard',
        teams: [
          { rank: 1, pokemon: [6, 25, 59, 91, 130, 149] },
          { rank: 2, pokemon: [6, 25, 91, 103, 130, 149] },
          { rank: 3, pokemon: [6, 25, 91, 128, 130, 149] },
          { rank: 4, pokemon: [6, 25, 91, 130, 131, 149] },
          { rank: 5, pokemon: [6, 25, 91, 112, 130, 149] },
        ],
      },
      {
        starters: [9, 25],
        name: 'Pikachu + Blastoise',
        teams: [
          { rank: 1, pokemon: [9, 25, 59, 91, 130, 149] },
          { rank: 2, pokemon: [9, 25, 91, 103, 130, 149] },
          { rank: 3, pokemon: [9, 25, 91, 128, 130, 149] },
          { rank: 4, pokemon: [9, 25, 91, 130, 131, 149] },
          { rank: 5, pokemon: [9, 25, 91, 112, 130, 149] },
        ],
      },
      {
        starters: [3, 6, 25],
        name: 'Pikachu + Venusaur + Charizard',
        teams: [
          { rank: 1, pokemon: [3, 6, 25, 91, 130, 149] },
          { rank: 2, pokemon: [3, 6, 25, 59, 91, 149] },
          { rank: 3, pokemon: [3, 6, 25, 91, 103, 149] },
          { rank: 4, pokemon: [3, 6, 25, 59, 130, 149] },
          { rank: 5, pokemon: [3, 6, 25, 103, 130, 149] },
        ],
      },
      {
        starters: [3, 9, 25],
        name: 'Pikachu + Venusaur + Blastoise',
        teams: [
          { rank: 1, pokemon: [3, 9, 25, 91, 130, 149] },
          { rank: 2, pokemon: [3, 9, 25, 59, 91, 149] },
          { rank: 3, pokemon: [3, 9, 25, 91, 103, 149] },
          { rank: 4, pokemon: [3, 9, 25, 59, 130, 149] },
          { rank: 5, pokemon: [3, 9, 25, 103, 130, 149] },
        ],
      },
      {
        starters: [6, 9, 25],
        name: 'Pikachu + Charizard + Blastoise',
        teams: [
          { rank: 1, pokemon: [6, 9, 25, 91, 130, 149] },
          { rank: 2, pokemon: [6, 9, 25, 59, 91, 149] },
          { rank: 3, pokemon: [6, 9, 25, 91, 103, 149] },
          { rank: 4, pokemon: [6, 9, 25, 59, 130, 149] },
          { rank: 5, pokemon: [6, 9, 25, 103, 130, 149] },
        ],
      },
      {
        starters: [3, 6, 9, 25],
        name: 'Pikachu + Venusaur + Charizard + Blastoise',
        teams: [
          { rank: 1, pokemon: [3, 6, 9, 25, 91, 149] },
          { rank: 2, pokemon: [3, 6, 9, 25, 130, 149] },
          { rank: 3, pokemon: [3, 6, 9, 25, 91, 130] },
          { rank: 4, pokemon: [3, 6, 9, 25, 59, 149] },
          { rank: 5, pokemon: [3, 6, 9, 25, 103, 149] },
        ],
      },
    ],
  },
  {
    gameId: 'gold',
    name: 'Gold',
    badge: '🟡',
    teams: [
      { rank: 1, pokemon: [82, 130, 149, 205, 207, 248] },
      { rank: 2, pokemon: [82, 130, 149, 195, 205, 248] },
      { rank: 3, pokemon: [62, 82, 149, 205, 207, 248] },
      { rank: 4, pokemon: [62, 82, 130, 149, 205, 248] },
      { rank: 5, pokemon: [62, 82, 130, 149, 207, 248] },
    ],
    starterTeams: [
      {
        starters: [154],
        name: 'Meganium',
        teams: [
          { rank: 1, pokemon: [62, 82, 130, 149, 154, 248] },
          { rank: 2, pokemon: [130, 149, 154, 195, 205, 248] },
          { rank: 3, pokemon: [82, 149, 154, 195, 205, 248] },
          { rank: 4, pokemon: [62, 130, 149, 154, 205, 248] },
          { rank: 5, pokemon: [82, 130, 149, 154, 195, 248] },
        ],
      },
      {
        starters: [157],
        name: 'Typhlosion',
        teams: [
          { rank: 1, pokemon: [82, 149, 157, 195, 205, 248] },
          { rank: 2, pokemon: [62, 82, 149, 157, 205, 207] },
          { rank: 3, pokemon: [62, 82, 149, 157, 205, 248] },
          { rank: 4, pokemon: [82, 149, 157, 195, 197, 205] },
          { rank: 5, pokemon: [62, 82, 149, 157, 195, 205] },
        ],
      },
      {
        starters: [160],
        name: 'Feraligatr',
        teams: [
          { rank: 1, pokemon: [82, 149, 160, 205, 207, 248] },
          { rank: 2, pokemon: [31, 82, 149, 160, 205, 248] },
          { rank: 3, pokemon: [34, 82, 149, 160, 205, 248] },
          { rank: 4, pokemon: [82, 149, 160, 207, 214, 248] },
          { rank: 5, pokemon: [82, 149, 160, 205, 207, 229] },
        ],
      },
    ],
    bstTeams: [
      { rank: 1, pokemon: [59, 130, 143, 149, 242, 248] },
      { rank: 2, pokemon: [59, 130, 131, 143, 149, 248] },
      { rank: 3, pokemon: [59, 130, 143, 149, 169, 248] },
      { rank: 4, pokemon: [59, 130, 131, 149, 242, 248] },
      { rank: 5, pokemon: [59, 130, 149, 169, 242, 248] },
    ],
    bstStarterTeams: [
      {
        starters: [154],
        name: 'Meganium',
        teams: [
          { rank: 1, pokemon: [59, 130, 143, 149, 154, 248] },
          { rank: 2, pokemon: [59, 130, 149, 154, 242, 248] },
          { rank: 3, pokemon: [59, 143, 149, 154, 242, 248] },
          { rank: 4, pokemon: [59, 130, 131, 149, 154, 248] },
          { rank: 5, pokemon: [59, 130, 149, 154, 169, 248] },
        ],
      },
      {
        starters: [157],
        name: 'Typhlosion',
        teams: [
          { rank: 1, pokemon: [59, 130, 143, 149, 157, 248] },
          { rank: 2, pokemon: [59, 130, 149, 157, 242, 248] },
          { rank: 3, pokemon: [59, 143, 149, 157, 242, 248] },
          { rank: 4, pokemon: [59, 130, 131, 149, 157, 248] },
          { rank: 5, pokemon: [59, 130, 149, 157, 169, 248] },
        ],
      },
      {
        starters: [160],
        name: 'Feraligatr',
        teams: [
          { rank: 1, pokemon: [59, 130, 143, 149, 160, 248] },
          { rank: 2, pokemon: [59, 130, 149, 160, 242, 248] },
          { rank: 3, pokemon: [59, 143, 149, 160, 242, 248] },
          { rank: 4, pokemon: [59, 130, 131, 149, 160, 248] },
          { rank: 5, pokemon: [59, 130, 149, 160, 169, 248] },
        ],
      },
    ],
  },
  {
    gameId: 'silver',
    name: 'Silver',
    badge: '⚪',
    teams: [
      { rank: 1, pokemon: [82, 130, 149, 195, 205, 248] },
      { rank: 2, pokemon: [82, 130, 149, 205, 232, 248] },
      { rank: 3, pokemon: [82, 149, 195, 205, 227, 248] },
      { rank: 4, pokemon: [82, 130, 149, 195, 227, 248] },
      { rank: 5, pokemon: [62, 82, 130, 149, 205, 248] },
    ],
    starterTeams: [
      {
        starters: [154],
        name: 'Meganium',
        teams: [
          { rank: 1, pokemon: [62, 82, 130, 149, 154, 248] },
          { rank: 2, pokemon: [62, 82, 149, 154, 227, 248] },
          { rank: 3, pokemon: [130, 149, 154, 195, 205, 248] },
          { rank: 4, pokemon: [149, 154, 195, 205, 227, 248] },
          { rank: 5, pokemon: [82, 149, 154, 195, 205, 248] },
        ],
      },
      {
        starters: [157],
        name: 'Typhlosion',
        teams: [
          { rank: 1, pokemon: [62, 82, 149, 157, 227, 248] },
          { rank: 2, pokemon: [149, 157, 195, 205, 227, 248] },
          { rank: 3, pokemon: [82, 149, 157, 195, 205, 248] },
          { rank: 4, pokemon: [82, 149, 157, 195, 205, 227] },
          { rank: 5, pokemon: [62, 82, 149, 157, 197, 227] },
        ],
      },
      {
        starters: [160],
        name: 'Feraligatr',
        teams: [
          { rank: 1, pokemon: [31, 149, 160, 205, 227, 248] },
          { rank: 2, pokemon: [34, 149, 160, 205, 227, 248] },
          { rank: 3, pokemon: [31, 82, 149, 160, 205, 248] },
          { rank: 4, pokemon: [34, 82, 149, 160, 205, 248] },
          { rank: 5, pokemon: [31, 82, 130, 149, 160, 205] },
        ],
      },
    ],
    bstTeams: [
      { rank: 1, pokemon: [130, 131, 143, 149, 242, 248] },
      { rank: 2, pokemon: [130, 143, 149, 169, 242, 248] },
      { rank: 3, pokemon: [130, 143, 149, 157, 242, 248] },
      { rank: 4, pokemon: [130, 143, 149, 160, 242, 248] },
      { rank: 5, pokemon: [130, 131, 143, 149, 169, 248] },
    ],
    bstStarterTeams: [
      {
        starters: [154],
        name: 'Meganium',
        teams: [
          { rank: 1, pokemon: [130, 143, 149, 154, 242, 248] },
          { rank: 2, pokemon: [130, 131, 143, 149, 154, 248] },
          { rank: 3, pokemon: [130, 143, 149, 154, 169, 248] },
          { rank: 4, pokemon: [130, 131, 149, 154, 242, 248] },
          { rank: 5, pokemon: [130, 149, 154, 169, 242, 248] },
        ],
      },
      {
        starters: [157],
        name: 'Typhlosion',
        teams: [
          { rank: 1, pokemon: [130, 143, 149, 157, 242, 248] },
          { rank: 2, pokemon: [130, 131, 143, 149, 157, 248] },
          { rank: 3, pokemon: [130, 143, 149, 157, 169, 248] },
          { rank: 4, pokemon: [130, 131, 149, 157, 242, 248] },
          { rank: 5, pokemon: [130, 149, 157, 169, 242, 248] },
        ],
      },
      {
        starters: [160],
        name: 'Feraligatr',
        teams: [
          { rank: 1, pokemon: [130, 143, 149, 160, 242, 248] },
          { rank: 2, pokemon: [130, 131, 143, 149, 160, 248] },
          { rank: 3, pokemon: [130, 143, 149, 160, 169, 248] },
          { rank: 4, pokemon: [130, 131, 149, 160, 242, 248] },
          { rank: 5, pokemon: [130, 149, 160, 169, 242, 248] },
        ],
      },
    ],
  },
  {
    gameId: 'crystal',
    name: 'Crystal',
    badge: '🔵',
    teams: [
      { rank: 1, pokemon: [82, 130, 149, 195, 205, 248] },
      { rank: 2, pokemon: [82, 130, 149, 205, 232, 248] },
      { rank: 3, pokemon: [62, 82, 130, 149, 205, 248] },
      { rank: 4, pokemon: [31, 82, 130, 149, 205, 248] },
      { rank: 5, pokemon: [34, 82, 130, 149, 205, 248] },
    ],
    starterTeams: [
      {
        starters: [154],
        name: 'Meganium',
        teams: [
          { rank: 1, pokemon: [62, 82, 130, 149, 154, 248] },
          { rank: 2, pokemon: [130, 149, 154, 195, 205, 248] },
          { rank: 3, pokemon: [82, 149, 154, 195, 205, 248] },
          { rank: 4, pokemon: [62, 130, 149, 154, 205, 248] },
          { rank: 5, pokemon: [82, 130, 149, 154, 195, 248] },
        ],
      },
      {
        starters: [157],
        name: 'Typhlosion',
        teams: [
          { rank: 1, pokemon: [82, 149, 157, 195, 205, 248] },
          { rank: 2, pokemon: [62, 82, 149, 157, 205, 248] },
          { rank: 3, pokemon: [82, 149, 157, 195, 197, 205] },
          { rank: 4, pokemon: [62, 82, 149, 157, 195, 205] },
          { rank: 5, pokemon: [62, 82, 149, 157, 205, 232] },
        ],
      },
      {
        starters: [160],
        name: 'Feraligatr',
        teams: [
          { rank: 1, pokemon: [31, 82, 149, 160, 205, 248] },
          { rank: 2, pokemon: [34, 82, 149, 160, 205, 248] },
          { rank: 3, pokemon: [31, 82, 130, 149, 160, 205] },
          { rank: 4, pokemon: [34, 82, 130, 149, 160, 205] },
          { rank: 5, pokemon: [82, 149, 160, 195, 205, 248] },
        ],
      },
    ],
    bstTeams: [
      { rank: 1, pokemon: [59, 130, 143, 149, 242, 248] },
      { rank: 2, pokemon: [59, 130, 131, 143, 149, 248] },
      { rank: 3, pokemon: [59, 130, 143, 149, 169, 248] },
      { rank: 4, pokemon: [59, 130, 131, 149, 242, 248] },
      { rank: 5, pokemon: [59, 130, 149, 169, 242, 248] },
    ],
    bstStarterTeams: [
      {
        starters: [154],
        name: 'Meganium',
        teams: [
          { rank: 1, pokemon: [59, 130, 143, 149, 154, 248] },
          { rank: 2, pokemon: [59, 130, 149, 154, 242, 248] },
          { rank: 3, pokemon: [59, 143, 149, 154, 242, 248] },
          { rank: 4, pokemon: [59, 130, 131, 149, 154, 248] },
          { rank: 5, pokemon: [59, 130, 149, 154, 169, 248] },
        ],
      },
      {
        starters: [157],
        name: 'Typhlosion',
        teams: [
          { rank: 1, pokemon: [59, 130, 143, 149, 157, 248] },
          { rank: 2, pokemon: [59, 130, 149, 157, 242, 248] },
          { rank: 3, pokemon: [59, 143, 149, 157, 242, 248] },
          { rank: 4, pokemon: [59, 130, 131, 149, 157, 248] },
          { rank: 5, pokemon: [59, 130, 149, 157, 169, 248] },
        ],
      },
      {
        starters: [160],
        name: 'Feraligatr',
        teams: [
          { rank: 1, pokemon: [59, 130, 143, 149, 160, 248] },
          { rank: 2, pokemon: [59, 130, 149, 160, 242, 248] },
          { rank: 3, pokemon: [59, 143, 149, 160, 242, 248] },
          { rank: 4, pokemon: [59, 130, 131, 149, 160, 248] },
          { rank: 5, pokemon: [59, 130, 149, 160, 169, 248] },
        ],
      },
    ],
  },
  {
    gameId: 'ruby',
    name: 'Ruby',
    badge: '🔴',
    teams: [
      { rank: 1, pokemon: [82, 260, 289, 354, 373, 376] },
      { rank: 2, pokemon: [82, 260, 289, 356, 373, 376] },
      { rank: 3, pokemon: [214, 260, 289, 306, 373, 376] },
      { rank: 4, pokemon: [82, 214, 260, 289, 373, 376] },
      { rank: 5, pokemon: [227, 260, 289, 306, 373, 376] },
    ],
    starterTeams: [
      {
        starters: [254],
        name: 'Sceptile',
        teams: [
          { rank: 1, pokemon: [254, 260, 289, 306, 373, 376] },
          { rank: 2, pokemon: [254, 260, 306, 342, 373, 376] },
          { rank: 3, pokemon: [254, 260, 306, 319, 373, 376] },
          { rank: 4, pokemon: [254, 260, 306, 354, 373, 376] },
          { rank: 5, pokemon: [254, 260, 306, 356, 373, 376] },
        ],
      },
      {
        starters: [257],
        name: 'Blaziken',
        teams: [
          { rank: 1, pokemon: [82, 257, 260, 289, 373, 376] },
          { rank: 2, pokemon: [82, 227, 257, 260, 289, 373] },
          { rank: 3, pokemon: [82, 257, 260, 342, 373, 376] },
          { rank: 4, pokemon: [82, 227, 257, 260, 342, 373] },
          { rank: 5, pokemon: [82, 257, 260, 319, 373, 376] },
        ],
      },
      {
        starters: [260],
        name: 'Swampert',
        teams: [
          { rank: 1, pokemon: [82, 260, 289, 354, 373, 376] },
          { rank: 2, pokemon: [82, 260, 289, 356, 373, 376] },
          { rank: 3, pokemon: [214, 260, 289, 306, 373, 376] },
          { rank: 4, pokemon: [82, 214, 260, 289, 373, 376] },
          { rank: 5, pokemon: [227, 260, 289, 306, 373, 376] },
        ],
      },
    ],
    bstTeams: [
      { rank: 1, pokemon: [130, 169, 260, 289, 373, 376] },
      { rank: 2, pokemon: [130, 169, 254, 289, 373, 376] },
      { rank: 3, pokemon: [130, 169, 257, 289, 373, 376] },
      { rank: 4, pokemon: [130, 169, 289, 306, 373, 376] },
      { rank: 5, pokemon: [130, 169, 289, 365, 373, 376] },
    ],
    bstStarterTeams: [
      {
        starters: [254],
        name: 'Sceptile',
        teams: [
          { rank: 1, pokemon: [130, 169, 254, 289, 373, 376] },
          { rank: 2, pokemon: [130, 254, 260, 289, 373, 376] },
          { rank: 3, pokemon: [130, 254, 257, 289, 373, 376] },
          { rank: 4, pokemon: [130, 254, 289, 306, 373, 376] },
          { rank: 5, pokemon: [130, 254, 289, 365, 373, 376] },
        ],
      },
      {
        starters: [257],
        name: 'Blaziken',
        teams: [
          { rank: 1, pokemon: [130, 169, 257, 289, 373, 376] },
          { rank: 2, pokemon: [130, 257, 260, 289, 373, 376] },
          { rank: 3, pokemon: [130, 254, 257, 289, 373, 376] },
          { rank: 4, pokemon: [130, 257, 289, 306, 373, 376] },
          { rank: 5, pokemon: [130, 257, 289, 365, 373, 376] },
        ],
      },
      {
        starters: [260],
        name: 'Swampert',
        teams: [
          { rank: 1, pokemon: [130, 169, 260, 289, 373, 376] },
          { rank: 2, pokemon: [130, 254, 260, 289, 373, 376] },
          { rank: 3, pokemon: [130, 257, 260, 289, 373, 376] },
          { rank: 4, pokemon: [130, 260, 289, 306, 373, 376] },
          { rank: 5, pokemon: [130, 260, 289, 365, 373, 376] },
        ],
      },
    ],
  },
  {
    gameId: 'sapphire',
    name: 'Sapphire',
    badge: '🔵',
    teams: [
      { rank: 1, pokemon: [82, 260, 289, 354, 373, 376] },
      { rank: 2, pokemon: [82, 260, 289, 356, 373, 376] },
      { rank: 3, pokemon: [214, 260, 289, 306, 373, 376] },
      { rank: 4, pokemon: [82, 214, 260, 289, 373, 376] },
      { rank: 5, pokemon: [82, 260, 289, 302, 373, 376] },
    ],
    starterTeams: [
      {
        starters: [254],
        name: 'Sceptile',
        teams: [
          { rank: 1, pokemon: [254, 260, 289, 306, 373, 376] },
          { rank: 2, pokemon: [254, 260, 306, 342, 373, 376] },
          { rank: 3, pokemon: [254, 260, 306, 319, 373, 376] },
          { rank: 4, pokemon: [254, 260, 306, 354, 373, 376] },
          { rank: 5, pokemon: [254, 260, 306, 356, 373, 376] },
        ],
      },
      {
        starters: [257],
        name: 'Blaziken',
        teams: [
          { rank: 1, pokemon: [82, 257, 260, 289, 373, 376] },
          { rank: 2, pokemon: [82, 227, 257, 260, 289, 373] },
          { rank: 3, pokemon: [82, 257, 260, 342, 373, 376] },
          { rank: 4, pokemon: [82, 227, 257, 260, 342, 373] },
          { rank: 5, pokemon: [82, 257, 260, 319, 373, 376] },
        ],
      },
      {
        starters: [260],
        name: 'Swampert',
        teams: [
          { rank: 1, pokemon: [82, 260, 289, 354, 373, 376] },
          { rank: 2, pokemon: [82, 260, 289, 356, 373, 376] },
          { rank: 3, pokemon: [214, 260, 289, 306, 373, 376] },
          { rank: 4, pokemon: [82, 214, 260, 289, 373, 376] },
          { rank: 5, pokemon: [82, 260, 289, 302, 373, 376] },
        ],
      },
    ],
    bstTeams: [
      { rank: 1, pokemon: [130, 169, 260, 289, 373, 376] },
      { rank: 2, pokemon: [130, 169, 254, 289, 373, 376] },
      { rank: 3, pokemon: [130, 169, 257, 289, 373, 376] },
      { rank: 4, pokemon: [130, 169, 289, 306, 373, 376] },
      { rank: 5, pokemon: [130, 169, 289, 365, 373, 376] },
    ],
    bstStarterTeams: [
      {
        starters: [254],
        name: 'Sceptile',
        teams: [
          { rank: 1, pokemon: [130, 169, 254, 289, 373, 376] },
          { rank: 2, pokemon: [130, 254, 260, 289, 373, 376] },
          { rank: 3, pokemon: [130, 254, 257, 289, 373, 376] },
          { rank: 4, pokemon: [130, 254, 289, 306, 373, 376] },
          { rank: 5, pokemon: [130, 254, 289, 365, 373, 376] },
        ],
      },
      {
        starters: [257],
        name: 'Blaziken',
        teams: [
          { rank: 1, pokemon: [130, 169, 257, 289, 373, 376] },
          { rank: 2, pokemon: [130, 257, 260, 289, 373, 376] },
          { rank: 3, pokemon: [130, 254, 257, 289, 373, 376] },
          { rank: 4, pokemon: [130, 257, 289, 306, 373, 376] },
          { rank: 5, pokemon: [130, 257, 289, 365, 373, 376] },
        ],
      },
      {
        starters: [260],
        name: 'Swampert',
        teams: [
          { rank: 1, pokemon: [130, 169, 260, 289, 373, 376] },
          { rank: 2, pokemon: [130, 254, 260, 289, 373, 376] },
          { rank: 3, pokemon: [130, 257, 260, 289, 373, 376] },
          { rank: 4, pokemon: [130, 260, 289, 306, 373, 376] },
          { rank: 5, pokemon: [130, 260, 289, 365, 373, 376] },
        ],
      },
    ],
  },
  {
    gameId: 'emerald',
    name: 'Emerald',
    badge: '🟢',
    teams: [
      { rank: 1, pokemon: [205, 260, 289, 306, 373, 376] },
      { rank: 2, pokemon: [82, 205, 260, 289, 373, 376] },
      { rank: 3, pokemon: [130, 205, 260, 306, 373, 376] },
      { rank: 4, pokemon: [205, 227, 260, 306, 373, 376] },
      { rank: 5, pokemon: [82, 130, 205, 260, 373, 376] },
    ],
    starterTeams: [
      {
        starters: [254],
        name: 'Sceptile',
        teams: [
          { rank: 1, pokemon: [205, 254, 260, 306, 373, 376] },
          { rank: 2, pokemon: [205, 254, 260, 289, 306, 373] },
          { rank: 3, pokemon: [254, 260, 289, 306, 373, 376] },
          { rank: 4, pokemon: [254, 260, 306, 342, 373, 376] },
          { rank: 5, pokemon: [205, 229, 254, 260, 306, 373] },
        ],
      },
      {
        starters: [257],
        name: 'Blaziken',
        teams: [
          { rank: 1, pokemon: [82, 205, 257, 260, 289, 373] },
          { rank: 2, pokemon: [82, 257, 260, 289, 373, 376] },
          { rank: 3, pokemon: [82, 227, 257, 260, 289, 373] },
          { rank: 4, pokemon: [82, 257, 260, 342, 373, 376] },
          { rank: 5, pokemon: [82, 227, 257, 260, 342, 373] },
        ],
      },
      {
        starters: [260],
        name: 'Swampert',
        teams: [
          { rank: 1, pokemon: [205, 260, 289, 306, 373, 376] },
          { rank: 2, pokemon: [82, 205, 260, 289, 373, 376] },
          { rank: 3, pokemon: [130, 205, 260, 306, 373, 376] },
          { rank: 4, pokemon: [205, 227, 260, 306, 373, 376] },
          { rank: 5, pokemon: [82, 130, 205, 260, 373, 376] },
        ],
      },
    ],
    bstTeams: [
      { rank: 1, pokemon: [130, 169, 260, 289, 373, 376] },
      { rank: 2, pokemon: [130, 157, 169, 289, 373, 376] },
      { rank: 3, pokemon: [130, 157, 260, 289, 373, 376] },
      { rank: 4, pokemon: [130, 160, 169, 289, 373, 376] },
      { rank: 5, pokemon: [130, 169, 254, 289, 373, 376] },
    ],
    bstStarterTeams: [
      {
        starters: [254],
        name: 'Sceptile',
        teams: [
          { rank: 1, pokemon: [130, 169, 254, 289, 373, 376] },
          { rank: 2, pokemon: [130, 254, 260, 289, 373, 376] },
          { rank: 3, pokemon: [130, 157, 254, 289, 373, 376] },
          { rank: 4, pokemon: [130, 160, 254, 289, 373, 376] },
          { rank: 5, pokemon: [130, 254, 257, 289, 373, 376] },
        ],
      },
      {
        starters: [257],
        name: 'Blaziken',
        teams: [
          { rank: 1, pokemon: [130, 169, 257, 289, 373, 376] },
          { rank: 2, pokemon: [130, 257, 260, 289, 373, 376] },
          { rank: 3, pokemon: [130, 157, 257, 289, 373, 376] },
          { rank: 4, pokemon: [130, 160, 257, 289, 373, 376] },
          { rank: 5, pokemon: [130, 254, 257, 289, 373, 376] },
        ],
      },
      {
        starters: [260],
        name: 'Swampert',
        teams: [
          { rank: 1, pokemon: [130, 169, 260, 289, 373, 376] },
          { rank: 2, pokemon: [130, 157, 260, 289, 373, 376] },
          { rank: 3, pokemon: [130, 160, 260, 289, 373, 376] },
          { rank: 4, pokemon: [130, 254, 260, 289, 373, 376] },
          { rank: 5, pokemon: [130, 257, 260, 289, 373, 376] },
        ],
      },
    ],
  },
  {
    gameId: 'firered',
    name: 'FireRed',
    badge: '🟠',
    teams: [
      { rank: 1, pokemon: [82, 130, 149, 195, 205, 248] },
      { rank: 2, pokemon: [82, 130, 149, 205, 232, 248] },
      { rank: 3, pokemon: [82, 149, 195, 205, 227, 248] },
      { rank: 4, pokemon: [6, 82, 149, 195, 205, 248] },
      { rank: 5, pokemon: [82, 130, 149, 195, 227, 248] },
    ],
    starterTeams: [
      {
        starters: [3],
        name: 'Venusaur',
        teams: [
          { rank: 1, pokemon: [3, 62, 82, 130, 149, 248] },
          { rank: 2, pokemon: [3, 62, 82, 149, 227, 248] },
          { rank: 3, pokemon: [3, 130, 149, 195, 205, 248] },
          { rank: 4, pokemon: [3, 149, 195, 205, 227, 248] },
          { rank: 5, pokemon: [3, 82, 149, 195, 205, 248] },
        ],
      },
      {
        starters: [6],
        name: 'Charizard',
        teams: [
          { rank: 1, pokemon: [6, 82, 149, 195, 205, 248] },
          { rank: 2, pokemon: [6, 82, 149, 195, 227, 248] },
          { rank: 3, pokemon: [6, 62, 82, 149, 205, 248] },
          { rank: 4, pokemon: [6, 62, 82, 149, 227, 248] },
          { rank: 5, pokemon: [6, 149, 195, 205, 227, 248] },
        ],
      },
      {
        starters: [9],
        name: 'Blastoise',
        teams: [
          { rank: 1, pokemon: [6, 9, 82, 149, 205, 248] },
          { rank: 2, pokemon: [9, 31, 149, 205, 227, 248] },
          { rank: 3, pokemon: [9, 34, 149, 205, 227, 248] },
          { rank: 4, pokemon: [9, 31, 82, 149, 205, 248] },
          { rank: 5, pokemon: [9, 34, 82, 149, 205, 248] },
        ],
      },
    ],
    bstTeams: [
      { rank: 1, pokemon: [59, 130, 143, 149, 242, 248] },
      { rank: 2, pokemon: [59, 130, 131, 143, 149, 248] },
      { rank: 3, pokemon: [59, 130, 143, 149, 169, 248] },
      { rank: 4, pokemon: [59, 130, 131, 149, 242, 248] },
      { rank: 5, pokemon: [59, 130, 149, 169, 242, 248] },
    ],
    bstStarterTeams: [
      {
        starters: [3],
        name: 'Venusaur',
        teams: [
          { rank: 1, pokemon: [3, 59, 130, 143, 149, 248] },
          { rank: 2, pokemon: [3, 59, 130, 149, 242, 248] },
          { rank: 3, pokemon: [3, 59, 143, 149, 242, 248] },
          { rank: 4, pokemon: [3, 59, 130, 131, 149, 248] },
          { rank: 5, pokemon: [3, 59, 130, 149, 169, 248] },
        ],
      },
      {
        starters: [6],
        name: 'Charizard',
        teams: [
          { rank: 1, pokemon: [6, 59, 130, 143, 149, 248] },
          { rank: 2, pokemon: [6, 59, 130, 149, 242, 248] },
          { rank: 3, pokemon: [6, 59, 143, 149, 242, 248] },
          { rank: 4, pokemon: [6, 59, 130, 131, 149, 248] },
          { rank: 5, pokemon: [6, 59, 130, 149, 169, 248] },
        ],
      },
      {
        starters: [9],
        name: 'Blastoise',
        teams: [
          { rank: 1, pokemon: [9, 59, 130, 143, 149, 248] },
          { rank: 2, pokemon: [9, 59, 130, 149, 242, 248] },
          { rank: 3, pokemon: [9, 59, 143, 149, 242, 248] },
          { rank: 4, pokemon: [9, 59, 130, 131, 149, 248] },
          { rank: 5, pokemon: [9, 59, 130, 149, 169, 248] },
        ],
      },
    ],
  },
  {
    gameId: 'leafgreen',
    name: 'LeafGreen',
    badge: '🟢',
    teams: [
      { rank: 1, pokemon: [82, 130, 149, 205, 232, 248] },
      { rank: 2, pokemon: [62, 82, 130, 149, 205, 248] },
      { rank: 3, pokemon: [31, 82, 130, 149, 205, 248] },
      { rank: 4, pokemon: [34, 82, 130, 149, 205, 248] },
      { rank: 5, pokemon: [6, 62, 82, 149, 205, 248] },
    ],
    starterTeams: [
      {
        starters: [3],
        name: 'Venusaur',
        teams: [
          { rank: 1, pokemon: [3, 62, 82, 130, 149, 248] },
          { rank: 2, pokemon: [3, 6, 62, 82, 149, 248] },
          { rank: 3, pokemon: [3, 62, 130, 149, 205, 248] },
          { rank: 4, pokemon: [3, 62, 82, 149, 205, 248] },
          { rank: 5, pokemon: [3, 6, 82, 149, 205, 248] },
        ],
      },
      {
        starters: [6],
        name: 'Charizard',
        teams: [
          { rank: 1, pokemon: [6, 62, 82, 149, 205, 248] },
          { rank: 2, pokemon: [6, 82, 121, 149, 205, 248] },
          { rank: 3, pokemon: [6, 82, 130, 149, 205, 248] },
          { rank: 4, pokemon: [6, 80, 82, 149, 205, 248] },
          { rank: 5, pokemon: [6, 31, 62, 82, 149, 205] },
        ],
      },
      {
        starters: [9],
        name: 'Blastoise',
        teams: [
          { rank: 1, pokemon: [6, 9, 82, 149, 205, 248] },
          { rank: 2, pokemon: [9, 31, 82, 149, 205, 248] },
          { rank: 3, pokemon: [9, 34, 82, 149, 205, 248] },
          { rank: 4, pokemon: [9, 31, 82, 130, 149, 205] },
          { rank: 5, pokemon: [9, 34, 82, 130, 149, 205] },
        ],
      },
    ],
    bstTeams: [
      { rank: 1, pokemon: [130, 131, 143, 149, 242, 248] },
      { rank: 2, pokemon: [130, 143, 149, 169, 242, 248] },
      { rank: 3, pokemon: [6, 130, 143, 149, 242, 248] },
      { rank: 4, pokemon: [9, 130, 143, 149, 242, 248] },
      { rank: 5, pokemon: [130, 131, 143, 149, 169, 248] },
    ],
    bstStarterTeams: [
      {
        starters: [3],
        name: 'Venusaur',
        teams: [
          { rank: 1, pokemon: [3, 130, 143, 149, 242, 248] },
          { rank: 2, pokemon: [3, 130, 131, 143, 149, 248] },
          { rank: 3, pokemon: [3, 130, 143, 149, 169, 248] },
          { rank: 4, pokemon: [3, 130, 131, 149, 242, 248] },
          { rank: 5, pokemon: [3, 130, 149, 169, 242, 248] },
        ],
      },
      {
        starters: [6],
        name: 'Charizard',
        teams: [
          { rank: 1, pokemon: [6, 130, 143, 149, 242, 248] },
          { rank: 2, pokemon: [6, 130, 131, 143, 149, 248] },
          { rank: 3, pokemon: [6, 130, 143, 149, 169, 248] },
          { rank: 4, pokemon: [6, 130, 131, 149, 242, 248] },
          { rank: 5, pokemon: [6, 130, 149, 169, 242, 248] },
        ],
      },
      {
        starters: [9],
        name: 'Blastoise',
        teams: [
          { rank: 1, pokemon: [9, 130, 143, 149, 242, 248] },
          { rank: 2, pokemon: [9, 130, 131, 143, 149, 248] },
          { rank: 3, pokemon: [9, 130, 143, 149, 169, 248] },
          { rank: 4, pokemon: [9, 130, 131, 149, 242, 248] },
          { rank: 5, pokemon: [9, 130, 149, 169, 242, 248] },
        ],
      },
    ],
  },
  {
    gameId: 'diamond',
    name: 'Diamond',
    badge: '💎',
    teams: [
      { rank: 1, pokemon: [149, 205, 395, 442, 445, 462] },
      { rank: 2, pokemon: [130, 149, 442, 445, 448, 462] },
      { rank: 3, pokemon: [62, 149, 376, 442, 445, 462] },
      { rank: 4, pokemon: [149, 376, 395, 442, 445, 462] },
      { rank: 5, pokemon: [149, 227, 395, 442, 445, 462] },
    ],
    starterTeams: [
      {
        starters: [389],
        name: 'Torterra',
        teams: [
          { rank: 1, pokemon: [62, 149, 389, 395, 442, 462] },
          { rank: 2, pokemon: [149, 205, 389, 395, 442, 462] },
          { rank: 3, pokemon: [149, 205, 306, 389, 395, 442] },
          { rank: 4, pokemon: [130, 149, 389, 442, 448, 462] },
          { rank: 5, pokemon: [149, 205, 389, 395, 442, 476] },
        ],
      },
      {
        starters: [392],
        name: 'Infernape',
        teams: [
          { rank: 1, pokemon: [227, 392, 395, 442, 445, 462] },
          { rank: 2, pokemon: [149, 392, 395, 442, 445, 462] },
          { rank: 3, pokemon: [376, 392, 395, 426, 445, 462] },
          { rank: 4, pokemon: [149, 376, 392, 395, 442, 462] },
          { rank: 5, pokemon: [130, 376, 392, 442, 445, 462] },
        ],
      },
      {
        starters: [395],
        name: 'Empoleon',
        teams: [
          { rank: 1, pokemon: [149, 205, 395, 442, 445, 462] },
          { rank: 2, pokemon: [149, 376, 395, 442, 445, 462] },
          { rank: 3, pokemon: [149, 227, 395, 442, 445, 462] },
          { rank: 4, pokemon: [149, 395, 442, 445, 448, 462] },
          { rank: 5, pokemon: [149, 205, 395, 442, 462, 472] },
        ],
      },
    ],
    bstTeams: [
      { rank: 1, pokemon: [59, 149, 248, 289, 376, 445] },
      { rank: 2, pokemon: [149, 248, 289, 376, 445, 468] },
      { rank: 3, pokemon: [130, 149, 248, 289, 376, 445] },
      { rank: 4, pokemon: [149, 242, 248, 289, 376, 445] },
      { rank: 5, pokemon: [131, 149, 248, 289, 376, 445] },
    ],
    bstStarterTeams: [
      {
        starters: [389],
        name: 'Torterra',
        teams: [
          { rank: 1, pokemon: [149, 248, 289, 376, 389, 445] },
          { rank: 2, pokemon: [59, 149, 248, 289, 376, 389] },
          { rank: 3, pokemon: [59, 149, 248, 289, 389, 445] },
          { rank: 4, pokemon: [59, 149, 289, 376, 389, 445] },
          { rank: 5, pokemon: [59, 248, 289, 376, 389, 445] },
        ],
      },
      {
        starters: [392],
        name: 'Infernape',
        teams: [
          { rank: 1, pokemon: [149, 248, 289, 376, 392, 445] },
          { rank: 2, pokemon: [59, 149, 248, 289, 376, 392] },
          { rank: 3, pokemon: [59, 149, 248, 289, 392, 445] },
          { rank: 4, pokemon: [59, 149, 289, 376, 392, 445] },
          { rank: 5, pokemon: [59, 248, 289, 376, 392, 445] },
        ],
      },
      {
        starters: [395],
        name: 'Empoleon',
        teams: [
          { rank: 1, pokemon: [149, 248, 289, 376, 395, 445] },
          { rank: 2, pokemon: [59, 149, 248, 289, 376, 395] },
          { rank: 3, pokemon: [59, 149, 248, 289, 395, 445] },
          { rank: 4, pokemon: [59, 149, 289, 376, 395, 445] },
          { rank: 5, pokemon: [59, 248, 289, 376, 395, 445] },
        ],
      },
    ],
  },
  {
    gameId: 'pearl',
    name: 'Pearl',
    badge: '🔘',
    teams: [
      { rank: 1, pokemon: [149, 205, 395, 442, 445, 462] },
      { rank: 2, pokemon: [205, 373, 395, 442, 445, 462] },
      { rank: 3, pokemon: [130, 149, 442, 445, 448, 462] },
      { rank: 4, pokemon: [130, 373, 442, 445, 448, 462] },
      { rank: 5, pokemon: [62, 149, 376, 442, 445, 462] },
    ],
    starterTeams: [
      {
        starters: [389],
        name: 'Torterra',
        teams: [
          { rank: 1, pokemon: [62, 149, 389, 395, 442, 462] },
          { rank: 2, pokemon: [62, 373, 389, 395, 442, 462] },
          { rank: 3, pokemon: [149, 205, 389, 395, 442, 462] },
          { rank: 4, pokemon: [205, 373, 389, 395, 442, 462] },
          { rank: 5, pokemon: [130, 149, 389, 442, 448, 462] },
        ],
      },
      {
        starters: [392],
        name: 'Infernape',
        teams: [
          { rank: 1, pokemon: [227, 392, 395, 442, 445, 462] },
          { rank: 2, pokemon: [149, 392, 395, 442, 445, 462] },
          { rank: 3, pokemon: [373, 392, 395, 442, 445, 462] },
          { rank: 4, pokemon: [376, 392, 395, 426, 445, 462] },
          { rank: 5, pokemon: [149, 376, 392, 395, 442, 462] },
        ],
      },
      {
        starters: [395],
        name: 'Empoleon',
        teams: [
          { rank: 1, pokemon: [149, 205, 395, 442, 445, 462] },
          { rank: 2, pokemon: [205, 373, 395, 442, 445, 462] },
          { rank: 3, pokemon: [149, 376, 395, 442, 445, 462] },
          { rank: 4, pokemon: [373, 376, 395, 442, 445, 462] },
          { rank: 5, pokemon: [149, 227, 395, 442, 445, 462] },
        ],
      },
    ],
    bstTeams: [
      { rank: 1, pokemon: [59, 149, 289, 373, 376, 445] },
      { rank: 2, pokemon: [149, 289, 373, 376, 445, 468] },
      { rank: 3, pokemon: [130, 149, 289, 373, 376, 445] },
      { rank: 4, pokemon: [149, 242, 289, 373, 376, 445] },
      { rank: 5, pokemon: [131, 149, 289, 373, 376, 445] },
    ],
    bstStarterTeams: [
      {
        starters: [389],
        name: 'Torterra',
        teams: [
          { rank: 1, pokemon: [149, 289, 373, 376, 389, 445] },
          { rank: 2, pokemon: [59, 149, 289, 373, 376, 389] },
          { rank: 3, pokemon: [59, 149, 289, 373, 389, 445] },
          { rank: 4, pokemon: [59, 149, 289, 376, 389, 445] },
          { rank: 5, pokemon: [59, 289, 373, 376, 389, 445] },
        ],
      },
      {
        starters: [392],
        name: 'Infernape',
        teams: [
          { rank: 1, pokemon: [149, 289, 373, 376, 392, 445] },
          { rank: 2, pokemon: [59, 149, 289, 373, 376, 392] },
          { rank: 3, pokemon: [59, 149, 289, 373, 392, 445] },
          { rank: 4, pokemon: [59, 149, 289, 376, 392, 445] },
          { rank: 5, pokemon: [59, 289, 373, 376, 392, 445] },
        ],
      },
      {
        starters: [395],
        name: 'Empoleon',
        teams: [
          { rank: 1, pokemon: [149, 289, 373, 376, 395, 445] },
          { rank: 2, pokemon: [59, 149, 289, 373, 376, 395] },
          { rank: 3, pokemon: [59, 149, 289, 373, 395, 445] },
          { rank: 4, pokemon: [59, 149, 289, 376, 395, 445] },
          { rank: 5, pokemon: [59, 289, 373, 376, 395, 445] },
        ],
      },
    ],
  },
  {
    gameId: 'platinum',
    name: 'Platinum',
    badge: '⚪',
    teams: [
      { rank: 1, pokemon: [149, 205, 395, 442, 445, 462] },
      { rank: 2, pokemon: [205, 373, 395, 442, 445, 462] },
      { rank: 3, pokemon: [130, 149, 442, 445, 448, 462] },
      { rank: 4, pokemon: [130, 373, 442, 445, 448, 462] },
      { rank: 5, pokemon: [62, 149, 376, 442, 445, 462] },
    ],
    starterTeams: [
      {
        starters: [389],
        name: 'Torterra',
        teams: [
          { rank: 1, pokemon: [62, 149, 389, 395, 442, 462] },
          { rank: 2, pokemon: [62, 373, 389, 395, 442, 462] },
          { rank: 3, pokemon: [149, 205, 389, 395, 442, 462] },
          { rank: 4, pokemon: [205, 373, 389, 395, 442, 462] },
          { rank: 5, pokemon: [149, 205, 306, 389, 395, 442] },
        ],
      },
      {
        starters: [392],
        name: 'Infernape',
        teams: [
          { rank: 1, pokemon: [227, 392, 395, 442, 445, 462] },
          { rank: 2, pokemon: [149, 392, 395, 442, 445, 462] },
          { rank: 3, pokemon: [373, 392, 395, 442, 445, 462] },
          { rank: 4, pokemon: [376, 392, 395, 426, 445, 462] },
          { rank: 5, pokemon: [149, 376, 392, 395, 442, 462] },
        ],
      },
      {
        starters: [395],
        name: 'Empoleon',
        teams: [
          { rank: 1, pokemon: [149, 205, 395, 442, 445, 462] },
          { rank: 2, pokemon: [205, 373, 395, 442, 445, 462] },
          { rank: 3, pokemon: [149, 376, 395, 442, 445, 462] },
          { rank: 4, pokemon: [373, 376, 395, 442, 445, 462] },
          { rank: 5, pokemon: [149, 227, 395, 442, 445, 462] },
        ],
      },
    ],
    bstTeams: [
      { rank: 1, pokemon: [149, 248, 289, 373, 376, 445] },
      { rank: 2, pokemon: [59, 149, 248, 289, 373, 376] },
      { rank: 3, pokemon: [59, 149, 248, 289, 373, 445] },
      { rank: 4, pokemon: [59, 149, 248, 289, 376, 445] },
      { rank: 5, pokemon: [59, 149, 289, 373, 376, 445] },
    ],
    bstStarterTeams: [
      {
        starters: [389],
        name: 'Torterra',
        teams: [
          { rank: 1, pokemon: [149, 248, 289, 373, 376, 389] },
          { rank: 2, pokemon: [149, 248, 289, 373, 389, 445] },
          { rank: 3, pokemon: [149, 248, 289, 376, 389, 445] },
          { rank: 4, pokemon: [149, 289, 373, 376, 389, 445] },
          { rank: 5, pokemon: [248, 289, 373, 376, 389, 445] },
        ],
      },
      {
        starters: [392],
        name: 'Infernape',
        teams: [
          { rank: 1, pokemon: [149, 248, 289, 373, 376, 392] },
          { rank: 2, pokemon: [149, 248, 289, 373, 392, 445] },
          { rank: 3, pokemon: [149, 248, 289, 376, 392, 445] },
          { rank: 4, pokemon: [149, 289, 373, 376, 392, 445] },
          { rank: 5, pokemon: [248, 289, 373, 376, 392, 445] },
        ],
      },
      {
        starters: [395],
        name: 'Empoleon',
        teams: [
          { rank: 1, pokemon: [149, 248, 289, 373, 376, 395] },
          { rank: 2, pokemon: [149, 248, 289, 373, 395, 445] },
          { rank: 3, pokemon: [149, 248, 289, 376, 395, 445] },
          { rank: 4, pokemon: [149, 289, 373, 376, 395, 445] },
          { rank: 5, pokemon: [248, 289, 373, 376, 395, 445] },
        ],
      },
    ],
  },
  {
    gameId: 'heartgold',
    name: 'HeartGold',
    badge: '💛',
    teams: [
      { rank: 1, pokemon: [62, 130, 149, 248, 462, 472] },
      { rank: 2, pokemon: [62, 149, 260, 430, 437, 462] },
      { rank: 3, pokemon: [62, 149, 248, 437, 462, 472] },
      { rank: 4, pokemon: [130, 149, 248, 257, 260, 462] },
      { rank: 5, pokemon: [62, 149, 260, 429, 437, 462] },
    ],
    starterTeams: [
      {
        starters: [154],
        name: 'Meganium',
        teams: [
          { rank: 1, pokemon: [130, 149, 154, 248, 260, 462] },
          { rank: 2, pokemon: [149, 154, 248, 257, 260, 462] },
          { rank: 3, pokemon: [149, 154, 248, 260, 462, 475] },
          { rank: 4, pokemon: [6, 149, 154, 248, 260, 462] },
          { rank: 5, pokemon: [62, 149, 154, 248, 260, 462] },
        ],
      },
      {
        starters: [157],
        name: 'Typhlosion',
        teams: [
          { rank: 1, pokemon: [62, 149, 157, 260, 429, 462] },
          { rank: 2, pokemon: [62, 149, 157, 429, 462, 472] },
          { rank: 3, pokemon: [62, 149, 157, 197, 260, 462] },
          { rank: 4, pokemon: [62, 149, 157, 197, 462, 472] },
          { rank: 5, pokemon: [149, 157, 248, 260, 462, 475] },
        ],
      },
      {
        starters: [160],
        name: 'Feraligatr',
        teams: [
          { rank: 1, pokemon: [130, 149, 160, 248, 462, 472] },
          { rank: 2, pokemon: [149, 160, 257, 260, 430, 462] },
          { rank: 3, pokemon: [149, 160, 248, 462, 472, 475] },
          { rank: 4, pokemon: [149, 160, 257, 260, 429, 462] },
          { rank: 5, pokemon: [62, 149, 160, 248, 462, 472] },
        ],
      },
    ],
    bstTeams: [
      { rank: 1, pokemon: [59, 130, 143, 149, 248, 468] },
      { rank: 2, pokemon: [59, 130, 149, 242, 248, 468] },
      { rank: 3, pokemon: [59, 143, 149, 242, 248, 468] },
      { rank: 4, pokemon: [59, 130, 131, 149, 248, 468] },
      { rank: 5, pokemon: [59, 130, 149, 169, 248, 468] },
    ],
    bstStarterTeams: [
      {
        starters: [154],
        name: 'Meganium',
        teams: [
          { rank: 1, pokemon: [59, 130, 149, 154, 248, 468] },
          { rank: 2, pokemon: [59, 143, 149, 154, 248, 468] },
          { rank: 3, pokemon: [59, 149, 154, 242, 248, 468] },
          { rank: 4, pokemon: [59, 131, 149, 154, 248, 468] },
          { rank: 5, pokemon: [59, 149, 154, 169, 248, 468] },
        ],
      },
      {
        starters: [157],
        name: 'Typhlosion',
        teams: [
          { rank: 1, pokemon: [59, 130, 149, 157, 248, 468] },
          { rank: 2, pokemon: [59, 143, 149, 157, 248, 468] },
          { rank: 3, pokemon: [59, 149, 157, 242, 248, 468] },
          { rank: 4, pokemon: [59, 131, 149, 157, 248, 468] },
          { rank: 5, pokemon: [59, 149, 157, 169, 248, 468] },
        ],
      },
      {
        starters: [160],
        name: 'Feraligatr',
        teams: [
          { rank: 1, pokemon: [59, 130, 149, 160, 248, 468] },
          { rank: 2, pokemon: [59, 143, 149, 160, 248, 468] },
          { rank: 3, pokemon: [59, 149, 160, 242, 248, 468] },
          { rank: 4, pokemon: [59, 131, 149, 160, 248, 468] },
          { rank: 5, pokemon: [59, 149, 160, 169, 248, 468] },
        ],
      },
    ],
  },
  {
    gameId: 'soulsilver',
    name: 'SoulSilver',
    badge: '🤍',
    teams: [
      { rank: 1, pokemon: [130, 149, 227, 248, 260, 462] },
      { rank: 2, pokemon: [149, 227, 257, 260, 430, 462] },
      { rank: 3, pokemon: [149, 227, 248, 257, 260, 462] },
      { rank: 4, pokemon: [149, 227, 248, 260, 462, 475] },
      { rank: 5, pokemon: [149, 227, 248, 260, 462, 468] },
    ],
    starterTeams: [
      {
        starters: [154],
        name: 'Meganium',
        teams: [
          { rank: 1, pokemon: [130, 149, 154, 248, 260, 462] },
          { rank: 2, pokemon: [149, 154, 227, 248, 260, 462] },
          { rank: 3, pokemon: [149, 154, 248, 257, 260, 462] },
          { rank: 4, pokemon: [149, 154, 248, 260, 462, 475] },
          { rank: 5, pokemon: [149, 154, 227, 248, 257, 260] },
        ],
      },
      {
        starters: [157],
        name: 'Typhlosion',
        teams: [
          { rank: 1, pokemon: [149, 157, 227, 248, 260, 462] },
          { rank: 2, pokemon: [149, 157, 227, 260, 429, 462] },
          { rank: 3, pokemon: [62, 149, 157, 260, 429, 462] },
          { rank: 4, pokemon: [149, 157, 197, 227, 260, 462] },
          { rank: 5, pokemon: [62, 149, 157, 227, 260, 462] },
        ],
      },
      {
        starters: [160],
        name: 'Feraligatr',
        teams: [
          { rank: 1, pokemon: [149, 160, 227, 248, 260, 462] },
          { rank: 2, pokemon: [149, 160, 227, 248, 462, 475] },
          { rank: 3, pokemon: [149, 160, 257, 260, 430, 462] },
          { rank: 4, pokemon: [149, 160, 227, 229, 260, 462] },
          { rank: 5, pokemon: [149, 160, 227, 260, 429, 462] },
        ],
      },
    ],
    bstTeams: [
      { rank: 1, pokemon: [130, 143, 149, 242, 248, 468] },
      { rank: 2, pokemon: [130, 131, 143, 149, 248, 468] },
      { rank: 3, pokemon: [130, 143, 149, 169, 248, 468] },
      { rank: 4, pokemon: [130, 143, 149, 248, 260, 468] },
      { rank: 5, pokemon: [130, 143, 149, 248, 462, 468] },
    ],
    bstStarterTeams: [
      {
        starters: [154],
        name: 'Meganium',
        teams: [
          { rank: 1, pokemon: [130, 143, 149, 154, 248, 468] },
          { rank: 2, pokemon: [130, 149, 154, 242, 248, 468] },
          { rank: 3, pokemon: [143, 149, 154, 242, 248, 468] },
          { rank: 4, pokemon: [130, 131, 149, 154, 248, 468] },
          { rank: 5, pokemon: [130, 149, 154, 169, 248, 468] },
        ],
      },
      {
        starters: [157],
        name: 'Typhlosion',
        teams: [
          { rank: 1, pokemon: [130, 143, 149, 157, 248, 468] },
          { rank: 2, pokemon: [130, 149, 157, 242, 248, 468] },
          { rank: 3, pokemon: [143, 149, 157, 242, 248, 468] },
          { rank: 4, pokemon: [130, 131, 149, 157, 248, 468] },
          { rank: 5, pokemon: [130, 149, 157, 169, 248, 468] },
        ],
      },
      {
        starters: [160],
        name: 'Feraligatr',
        teams: [
          { rank: 1, pokemon: [130, 143, 149, 160, 248, 468] },
          { rank: 2, pokemon: [130, 149, 160, 242, 248, 468] },
          { rank: 3, pokemon: [143, 149, 160, 242, 248, 468] },
          { rank: 4, pokemon: [130, 131, 149, 160, 248, 468] },
          { rank: 5, pokemon: [130, 149, 160, 169, 248, 468] },
        ],
      },
    ],
  },
  {
    gameId: 'black',
    name: 'Black',
    badge: '⚫',
    teams: [
      { rank: 1, pokemon: [149, 248, 376, 472, 598, 632] },
      { rank: 2, pokemon: [62, 149, 248, 376, 472, 598] },
      { rank: 3, pokemon: [149, 248, 376, 598, 623, 632] },
      { rank: 4, pokemon: [149, 248, 376, 537, 598, 632] },
      { rank: 5, pokemon: [149, 248, 376, 537, 632, 635] },
    ],
    starterTeams: [
      {
        starters: [497],
        name: 'Serperior',
        teams: [
          { rank: 1, pokemon: [130, 149, 248, 448, 497, 537] },
          { rank: 2, pokemon: [149, 248, 376, 448, 497, 537] },
          { rank: 3, pokemon: [149, 248, 376, 497, 537, 632] },
          { rank: 4, pokemon: [130, 376, 448, 497, 537, 635] },
          { rank: 5, pokemon: [130, 149, 248, 497, 530, 632] },
        ],
      },
      {
        starters: [500],
        name: 'Emboar',
        teams: [
          { rank: 1, pokemon: [149, 376, 500, 537, 598, 635] },
          { rank: 2, pokemon: [130, 149, 376, 500, 598, 635] },
          { rank: 3, pokemon: [130, 376, 472, 500, 598, 635] },
          { rank: 4, pokemon: [149, 340, 376, 500, 598, 635] },
          { rank: 5, pokemon: [149, 248, 376, 500, 537, 598] },
        ],
      },
      {
        starters: [503],
        name: 'Samurott',
        teams: [
          { rank: 1, pokemon: [149, 376, 448, 503, 598, 623] },
          { rank: 2, pokemon: [149, 376, 448, 503, 537, 635] },
          { rank: 3, pokemon: [149, 248, 376, 472, 503, 598] },
          { rank: 4, pokemon: [149, 248, 376, 448, 472, 503] },
          { rank: 5, pokemon: [248, 376, 472, 503, 632, 635] },
        ],
      },
    ],
    bstTeams: [
      { rank: 1, pokemon: [130, 149, 248, 376, 635, 637] },
      { rank: 2, pokemon: [149, 248, 376, 612, 635, 637] },
      { rank: 3, pokemon: [131, 149, 248, 376, 635, 637] },
      { rank: 4, pokemon: [149, 169, 248, 376, 635, 637] },
      { rank: 5, pokemon: [149, 248, 376, 465, 635, 637] },
    ],
    bstStarterTeams: [
      {
        starters: [497],
        name: 'Serperior',
        teams: [
          { rank: 1, pokemon: [149, 248, 376, 497, 635, 637] },
          { rank: 2, pokemon: [130, 149, 248, 376, 497, 635] },
          { rank: 3, pokemon: [149, 248, 376, 497, 612, 635] },
          { rank: 4, pokemon: [131, 149, 248, 376, 497, 635] },
          { rank: 5, pokemon: [149, 169, 248, 376, 497, 635] },
        ],
      },
      {
        starters: [500],
        name: 'Emboar',
        teams: [
          { rank: 1, pokemon: [149, 248, 376, 500, 635, 637] },
          { rank: 2, pokemon: [130, 149, 248, 376, 500, 635] },
          { rank: 3, pokemon: [149, 248, 376, 500, 612, 635] },
          { rank: 4, pokemon: [131, 149, 248, 376, 500, 635] },
          { rank: 5, pokemon: [149, 169, 248, 376, 500, 635] },
        ],
      },
      {
        starters: [503],
        name: 'Samurott',
        teams: [
          { rank: 1, pokemon: [149, 248, 376, 503, 635, 637] },
          { rank: 2, pokemon: [130, 149, 248, 376, 503, 635] },
          { rank: 3, pokemon: [149, 248, 376, 503, 612, 635] },
          { rank: 4, pokemon: [131, 149, 248, 376, 503, 635] },
          { rank: 5, pokemon: [149, 169, 248, 376, 503, 635] },
        ],
      },
    ],
  },
  {
    gameId: 'white',
    name: 'White',
    badge: '⬜',
    teams: [
      { rank: 1, pokemon: [149, 248, 376, 472, 598, 632] },
      { rank: 2, pokemon: [62, 149, 248, 376, 472, 598] },
      { rank: 3, pokemon: [149, 248, 376, 598, 623, 632] },
      { rank: 4, pokemon: [149, 248, 376, 537, 598, 632] },
      { rank: 5, pokemon: [149, 248, 376, 537, 632, 635] },
    ],
    starterTeams: [
      {
        starters: [497],
        name: 'Serperior',
        teams: [
          { rank: 1, pokemon: [130, 149, 248, 448, 497, 537] },
          { rank: 2, pokemon: [149, 248, 376, 448, 497, 537] },
          { rank: 3, pokemon: [149, 248, 376, 497, 537, 632] },
          { rank: 4, pokemon: [130, 376, 448, 497, 537, 635] },
          { rank: 5, pokemon: [130, 149, 248, 497, 530, 632] },
        ],
      },
      {
        starters: [500],
        name: 'Emboar',
        teams: [
          { rank: 1, pokemon: [149, 376, 500, 537, 598, 635] },
          { rank: 2, pokemon: [130, 149, 376, 500, 598, 635] },
          { rank: 3, pokemon: [130, 376, 472, 500, 598, 635] },
          { rank: 4, pokemon: [149, 340, 376, 500, 598, 635] },
          { rank: 5, pokemon: [149, 248, 376, 500, 537, 598] },
        ],
      },
      {
        starters: [503],
        name: 'Samurott',
        teams: [
          { rank: 1, pokemon: [149, 376, 448, 503, 598, 623] },
          { rank: 2, pokemon: [149, 376, 448, 503, 537, 635] },
          { rank: 3, pokemon: [149, 248, 376, 472, 503, 598] },
          { rank: 4, pokemon: [149, 248, 376, 448, 472, 503] },
          { rank: 5, pokemon: [248, 376, 472, 503, 632, 635] },
        ],
      },
    ],
    bstTeams: [
      { rank: 1, pokemon: [130, 149, 248, 376, 635, 637] },
      { rank: 2, pokemon: [149, 248, 376, 612, 635, 637] },
      { rank: 3, pokemon: [131, 149, 248, 376, 635, 637] },
      { rank: 4, pokemon: [149, 169, 248, 376, 635, 637] },
      { rank: 5, pokemon: [149, 248, 376, 465, 635, 637] },
    ],
    bstStarterTeams: [
      {
        starters: [497],
        name: 'Serperior',
        teams: [
          { rank: 1, pokemon: [149, 248, 376, 497, 635, 637] },
          { rank: 2, pokemon: [130, 149, 248, 376, 497, 635] },
          { rank: 3, pokemon: [149, 248, 376, 497, 612, 635] },
          { rank: 4, pokemon: [131, 149, 248, 376, 497, 635] },
          { rank: 5, pokemon: [149, 169, 248, 376, 497, 635] },
        ],
      },
      {
        starters: [500],
        name: 'Emboar',
        teams: [
          { rank: 1, pokemon: [149, 248, 376, 500, 635, 637] },
          { rank: 2, pokemon: [130, 149, 248, 376, 500, 635] },
          { rank: 3, pokemon: [149, 248, 376, 500, 612, 635] },
          { rank: 4, pokemon: [131, 149, 248, 376, 500, 635] },
          { rank: 5, pokemon: [149, 169, 248, 376, 500, 635] },
        ],
      },
      {
        starters: [503],
        name: 'Samurott',
        teams: [
          { rank: 1, pokemon: [149, 248, 376, 503, 635, 637] },
          { rank: 2, pokemon: [130, 149, 248, 376, 503, 635] },
          { rank: 3, pokemon: [149, 248, 376, 503, 612, 635] },
          { rank: 4, pokemon: [131, 149, 248, 376, 503, 635] },
          { rank: 5, pokemon: [149, 169, 248, 376, 503, 635] },
        ],
      },
    ],
  },
  {
    gameId: 'black-2',
    name: 'Black 2',
    badge: '🌑',
    teams: [
      { rank: 1, pokemon: [130, 376, 445, 462, 632, 635] },
      { rank: 2, pokemon: [62, 130, 376, 445, 462, 635] },
      { rank: 3, pokemon: [130, 149, 445, 448, 462, 593] },
      { rank: 4, pokemon: [149, 376, 445, 448, 462, 593] },
      { rank: 5, pokemon: [149, 227, 445, 448, 462, 593] },
    ],
    starterTeams: [
      {
        starters: [497],
        name: 'Serperior',
        teams: [
          { rank: 1, pokemon: [130, 445, 448, 462, 497, 593] },
          { rank: 2, pokemon: [227, 445, 448, 462, 497, 593] },
          { rank: 3, pokemon: [130, 376, 445, 462, 497, 560] },
          { rank: 4, pokemon: [130, 306, 445, 448, 497, 593] },
          { rank: 5, pokemon: [227, 306, 445, 448, 497, 593] },
        ],
      },
      {
        starters: [500],
        name: 'Emboar',
        teams: [
          { rank: 1, pokemon: [130, 376, 445, 462, 500, 635] },
          { rank: 2, pokemon: [130, 227, 445, 462, 500, 635] },
          { rank: 3, pokemon: [130, 445, 462, 500, 632, 635] },
          { rank: 4, pokemon: [227, 445, 462, 500, 593, 635] },
          { rank: 5, pokemon: [149, 376, 462, 500, 537, 635] },
        ],
      },
      {
        starters: [503],
        name: 'Samurott',
        teams: [
          { rank: 1, pokemon: [149, 445, 448, 462, 503, 593] },
          { rank: 2, pokemon: [149, 376, 445, 462, 503, 560] },
          { rank: 3, pokemon: [62, 149, 376, 462, 503, 635] },
          { rank: 4, pokemon: [376, 462, 472, 503, 632, 635] },
          { rank: 5, pokemon: [62, 376, 462, 472, 503, 635] },
        ],
      },
    ],
    bstTeams: [
      { rank: 1, pokemon: [149, 248, 289, 376, 445, 635] },
      { rank: 2, pokemon: [59, 149, 248, 289, 376, 445] },
      { rank: 3, pokemon: [59, 149, 248, 289, 376, 635] },
      { rank: 4, pokemon: [59, 149, 248, 289, 445, 635] },
      { rank: 5, pokemon: [59, 149, 289, 376, 445, 635] },
    ],
    bstStarterTeams: [
      {
        starters: [497],
        name: 'Serperior',
        teams: [
          { rank: 1, pokemon: [149, 248, 289, 376, 445, 497] },
          { rank: 2, pokemon: [149, 248, 289, 376, 497, 635] },
          { rank: 3, pokemon: [149, 248, 289, 445, 497, 635] },
          { rank: 4, pokemon: [149, 289, 376, 445, 497, 635] },
          { rank: 5, pokemon: [248, 289, 376, 445, 497, 635] },
        ],
      },
      {
        starters: [500],
        name: 'Emboar',
        teams: [
          { rank: 1, pokemon: [149, 248, 289, 376, 445, 500] },
          { rank: 2, pokemon: [149, 248, 289, 376, 500, 635] },
          { rank: 3, pokemon: [149, 248, 289, 445, 500, 635] },
          { rank: 4, pokemon: [149, 289, 376, 445, 500, 635] },
          { rank: 5, pokemon: [248, 289, 376, 445, 500, 635] },
        ],
      },
      {
        starters: [503],
        name: 'Samurott',
        teams: [
          { rank: 1, pokemon: [149, 248, 289, 376, 445, 503] },
          { rank: 2, pokemon: [149, 248, 289, 376, 503, 635] },
          { rank: 3, pokemon: [149, 248, 289, 445, 503, 635] },
          { rank: 4, pokemon: [149, 289, 376, 445, 503, 635] },
          { rank: 5, pokemon: [248, 289, 376, 445, 503, 635] },
        ],
      },
    ],
  },
  {
    gameId: 'white-2',
    name: 'White 2',
    badge: '🌕',
    teams: [
      { rank: 1, pokemon: [149, 376, 462, 537, 632, 635] },
      { rank: 2, pokemon: [62, 149, 376, 462, 537, 635] },
      { rank: 3, pokemon: [62, 149, 289, 376, 462, 623] },
      { rank: 4, pokemon: [62, 130, 149, 376, 462, 635] },
      { rank: 5, pokemon: [62, 149, 227, 376, 462, 635] },
    ],
    starterTeams: [
      {
        starters: [497],
        name: 'Serperior',
        teams: [
          { rank: 1, pokemon: [149, 448, 462, 497, 537, 593] },
          { rank: 2, pokemon: [62, 130, 376, 462, 497, 635] },
          { rank: 3, pokemon: [149, 376, 462, 497, 537, 560] },
          { rank: 4, pokemon: [149, 306, 448, 497, 537, 593] },
          { rank: 5, pokemon: [62, 130, 306, 376, 497, 635] },
        ],
      },
      {
        starters: [500],
        name: 'Emboar',
        teams: [
          { rank: 1, pokemon: [149, 376, 462, 500, 537, 635] },
          { rank: 2, pokemon: [149, 227, 462, 500, 537, 635] },
          { rank: 3, pokemon: [130, 149, 376, 462, 500, 635] },
          { rank: 4, pokemon: [130, 376, 462, 472, 500, 635] },
          { rank: 5, pokemon: [149, 462, 500, 537, 632, 635] },
        ],
      },
      {
        starters: [503],
        name: 'Samurott',
        teams: [
          { rank: 1, pokemon: [62, 149, 376, 462, 503, 635] },
          { rank: 2, pokemon: [376, 462, 472, 503, 632, 635] },
          { rank: 3, pokemon: [62, 376, 462, 472, 503, 635] },
          { rank: 4, pokemon: [149, 448, 462, 472, 503, 593] },
          { rank: 5, pokemon: [130, 149, 448, 462, 503, 623] },
        ],
      },
    ],
    bstTeams: [
      { rank: 1, pokemon: [59, 149, 248, 289, 376, 635] },
      { rank: 2, pokemon: [149, 248, 289, 376, 635, 637] },
      { rank: 3, pokemon: [130, 149, 248, 289, 376, 635] },
      { rank: 4, pokemon: [149, 242, 248, 289, 376, 635] },
      { rank: 5, pokemon: [149, 248, 289, 376, 612, 635] },
    ],
    bstStarterTeams: [
      {
        starters: [497],
        name: 'Serperior',
        teams: [
          { rank: 1, pokemon: [149, 248, 289, 376, 497, 635] },
          { rank: 2, pokemon: [59, 149, 248, 289, 376, 497] },
          { rank: 3, pokemon: [59, 149, 248, 289, 497, 635] },
          { rank: 4, pokemon: [59, 149, 289, 376, 497, 635] },
          { rank: 5, pokemon: [59, 248, 289, 376, 497, 635] },
        ],
      },
      {
        starters: [500],
        name: 'Emboar',
        teams: [
          { rank: 1, pokemon: [149, 248, 289, 376, 500, 635] },
          { rank: 2, pokemon: [59, 149, 248, 289, 376, 500] },
          { rank: 3, pokemon: [59, 149, 248, 289, 500, 635] },
          { rank: 4, pokemon: [59, 149, 289, 376, 500, 635] },
          { rank: 5, pokemon: [59, 248, 289, 376, 500, 635] },
        ],
      },
      {
        starters: [503],
        name: 'Samurott',
        teams: [
          { rank: 1, pokemon: [149, 248, 289, 376, 503, 635] },
          { rank: 2, pokemon: [59, 149, 248, 289, 376, 503] },
          { rank: 3, pokemon: [59, 149, 248, 289, 503, 635] },
          { rank: 4, pokemon: [59, 149, 289, 376, 503, 635] },
          { rank: 5, pokemon: [59, 248, 289, 376, 503, 635] },
        ],
      },
    ],
  },
];
