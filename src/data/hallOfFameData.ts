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
  },
];
