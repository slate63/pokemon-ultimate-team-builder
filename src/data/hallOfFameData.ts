export interface HallOfFameTeam {
  rank: number;
  pokemon: number[];
}

export interface HallOfFameStarterGroup {
  /** National dex number of the fully-evolved starter every team is built around. */
  starter: number;
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
        starter: 3,
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
        starter: 6,
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
        starter: 9,
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
        starter: 154,
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
        starter: 157,
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
        starter: 160,
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
  },
];
