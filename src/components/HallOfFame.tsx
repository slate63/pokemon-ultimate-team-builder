import React, { memo, useState, useMemo, useEffect } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, ShieldCheck, AlertTriangle, Zap } from 'lucide-react';
import {
  HALL_OF_FAME_DATA,
  HallOfFameGame,
  HallOfFameStarterGroup,
  HallOfFameTeam,
} from '../data/hallOfFameData';
import { Pokemon, ResolvedTeam, PokemonType } from '../types';
import { VERSION_TO_SPRITE_STYLE } from '../utils/spriteUtils';
import { resolvePokemon, GAME_DEXES } from '../data/pokemonData';
import { StatRadarChart } from './StatRadarChart';
import {
  calculateTeamDefensiveCoverage,
  calculateTeamOffensiveCoverage,
  getWeaknessAlerts,
  POKEMON_TYPES,
} from '../utils/coverage';
import { loadTypeChartForGen, TypeChartData } from '../utils/typeChart';

interface HallOfFameProps {
  onBack: () => void;
  rosterById: Map<number, Pokemon>;
}

const GAME_ID_TO_GEN: Record<string, number> = {};
for (const dex of GAME_DEXES) {
  for (const game of dex.games) {
    GAME_ID_TO_GEN[game] = dex.generation;
  }
}

function buildSpritePath(id: number, name: string, gameId: string): string {
  const paddedId = id < 1000 ? String(id).padStart(3, '0') : String(id);
  const dirName = `${paddedId}-${name.toLowerCase().replace(/ /g, '-')}`;
  const spriteStyle = VERSION_TO_SPRITE_STYLE[gameId] || 'standard';
  return `./data/pokemon/${dirName}/sprites/${spriteStyle}/front_default.png`;
}

function buildPokemonDataPath(id: number, name: string): string {
  const paddedId = id < 1000 ? String(id).padStart(3, '0') : String(id);
  const dirName = `${paddedId}-${name.toLowerCase().replace(/ /g, '-')}`;
  return `./data/pokemon/${dirName}/data.json`;
}

const pokemonDataCache = new Map<number, Pokemon>();

async function loadAndResolveTeam(
  pokemonIds: number[],
  gen: number,
  rosterById: Map<number, Pokemon>
): Promise<ResolvedTeam> {
  const results = await Promise.all(
    pokemonIds.map(async (id, i) => {
      let fullPokemon = pokemonDataCache.get(id);
      if (!fullPokemon) {
        const indexEntry = rosterById.get(id);
        if (!indexEntry) return null;
        try {
          const res = await fetch(buildPokemonDataPath(id, indexEntry.name));
          if (!res.ok) return null;
          fullPokemon = await res.json() as Pokemon;
          pokemonDataCache.set(id, fullPokemon);
        } catch {
          return null;
        }
      }
      const resolved = resolvePokemon(fullPokemon, gen);
      if (!resolved) return null;
      return { slotIndex: i, pokemon: resolved };
    })
  );
  return results;
}

function HofDefenseMatrix({ resolvedTeam, typeChartData }: {
  resolvedTeam: ResolvedTeam;
  typeChartData: TypeChartData | null;
}) {
  const chart = typeChartData?.chart;
  const types: PokemonType[] = typeChartData?.types ?? POKEMON_TYPES;

  const defensiveCoverage = useMemo(
    () => calculateTeamDefensiveCoverage(resolvedTeam, chart, types),
    [resolvedTeam, chart, types]
  );
  const offensiveCoverage = useMemo(
    () => calculateTeamOffensiveCoverage(resolvedTeam, chart, types),
    [resolvedTeam, chart, types]
  );
  const weaknessAlerts = useMemo(
    () => getWeaknessAlerts(defensiveCoverage, types),
    [defensiveCoverage, types]
  );

  const totals = useMemo(() => {
    let weak2x = 0, weak4x = 0, resist = 0, immune = 0, hit = 0;
    types.forEach((type) => {
      const def = defensiveCoverage[type];
      if (def) {
        weak2x += def.weak2x;
        weak4x += def.weak4x;
        resist += def.resistHalf + def.resistQuarter;
        immune += def.immune;
      }
      hit += offensiveCoverage[type] ?? 0;
    });
    return { weak2x, weak4x, resist, immune, hit };
  }, [types, defensiveCoverage, offensiveCoverage]);

  return (
    <div className="hof-defense-matrix">
      <div className="panel-title">
        <span className="panel-title-content">
          <ShieldCheck size={16} color="var(--accent-blue)" />
          Team Defense Matrix
        </span>
      </div>

      {weaknessAlerts.length > 0 && (
        <div className="alerts-box" style={{ marginBottom: '0.5rem' }}>
          <div className="alerts-header">
            <AlertTriangle size={14} />
            Shared Weaknesses (3+)
          </div>
          <div className="alerts-list">
            {weaknessAlerts.map(({ type, count }) => (
              <span key={type} className="alert-tag">
                ⚠️ {count} weak to <strong>{type.toUpperCase()}</strong>
              </span>
            ))}
          </div>
        </div>
      )}

      <table className="matrix-table">
        <thead>
          <tr>
            <th rowSpan={2} className="text-left">Type</th>
            <th colSpan={2} className="th-weakness-group">WEAKNESS</th>
            <th rowSpan={2} title="Resist">Resist</th>
            <th rowSpan={2} title="Immune">Immune</th>
            <th rowSpan={2} title="STAB Hit"><Zap size={11} className="inline-icon" /> Hit</th>
          </tr>
          <tr>
            <th title="2x">2x</th>
            <th title="4x">4x</th>
          </tr>
        </thead>
        <tbody>
          {types.map((type) => {
            const def = defensiveCoverage[type];
            const offCount = offensiveCoverage[type];
            const totalResist = def.resistHalf + def.resistQuarter;
            return (
              <tr key={type}>
                <td className="text-left">
                  <span className={`type-badge type-${type} type-badge-sm`}>{type}</span>
                </td>
                <td>{def.weak2x > 0 ? <span className="val-weak">{def.weak2x}</span> : <span className="val-neutral">-</span>}</td>
                <td>{def.weak4x > 0 ? <span className="val-weak-4x">{def.weak4x}</span> : <span className="val-neutral">-</span>}</td>
                <td>{totalResist > 0 ? <span className="val-resist">{totalResist}</span> : <span className="val-neutral">-</span>}</td>
                <td>{def.immune > 0 ? <span className="val-immune">{def.immune}</span> : <span className="val-neutral">-</span>}</td>
                <td>{offCount > 0 ? <span className="hit-count-active"><Zap size={10} style={{ flexShrink: 0, marginRight: '2px' }} /><span>{offCount}</span></span> : <span className="val-neutral">-</span>}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="matrix-total-row">
            <td className="text-left matrix-total-label">Total</td>
            <td><span className={totals.weak2x > 0 ? 'val-weak' : 'val-neutral'}>{totals.weak2x}</span></td>
            <td><span className={totals.weak4x > 0 ? 'val-weak-4x' : 'val-neutral'}>{totals.weak4x}</span></td>
            <td><span className={totals.resist > 0 ? 'val-resist' : 'val-neutral'}>{totals.resist}</span></td>
            <td><span className={totals.immune > 0 ? 'val-immune' : 'val-neutral'}>{totals.immune}</span></td>
            <td>
              <span className={totals.hit > 0 ? 'hit-count-active' : 'val-neutral'}>
                {totals.hit > 0 && <Zap size={10} style={{ flexShrink: 0, marginRight: '2px' }} />}
                <span>{totals.hit}</span>
              </span>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function TeamRow({ team, gameId, gen, rosterById, typeChartData }: {
  team: HallOfFameTeam;
  gameId: string;
  gen: number;
  rosterById: Map<number, Pokemon>;
  typeChartData: TypeChartData | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const [resolvedTeam, setResolvedTeam] = useState<ResolvedTeam>([]);
  const medalColors = ['#fbbf24', '#c0c0c0', '#cd7f32'];
  const medal = team.rank <= 3 ? medalColors[team.rank - 1] : undefined;

  useEffect(() => {
    if (!expanded) return;
    let cancelled = false;
    loadAndResolveTeam(team.pokemon, gen, rosterById).then((result) => {
      if (!cancelled) setResolvedTeam(result);
    });
    return () => { cancelled = true; };
  }, [expanded, team.pokemon, gen, rosterById]);

  return (
    <div className={`hof-team-entry ${expanded ? 'hof-team-expanded' : ''}`}>
      <div className="hof-team-row" onClick={() => setExpanded(!expanded)} style={{ cursor: 'pointer' }}>
        <div className="hof-rank" style={medal ? { color: medal } : undefined}>
          #{team.rank}
        </div>
        <div className="hof-team-sprites">
          {team.pokemon.map((id, i) => {
            const pokemon = rosterById.get(id);
            const src = pokemon
              ? buildSpritePath(id, pokemon.name, gameId)
              : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
            return (
              <img
                key={`${gameId}-${team.rank}-${i}`}
                className="hof-sprite"
                src={src}
                alt={pokemon ? pokemon.name : `Pokemon #${id}`}
                loading="lazy"
                onError={(e) => {
                  const img = e.currentTarget;
                  const fallback = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
                  if (img.src !== fallback) img.src = fallback;
                }}
              />
            );
          })}
        </div>
        <div className="hof-expand-icon">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {expanded && resolvedTeam.some(Boolean) && (
        <div className="hof-team-details">
          <div className="hof-details-grid">
            <HofDefenseMatrix resolvedTeam={resolvedTeam} typeChartData={typeChartData} />
            <StatRadarChart team={resolvedTeam} activeGen={gen} className="hof-radar" />
          </div>
        </div>
      )}
    </div>
  );
}

function StarterGroup({ group, gameId, gen, rosterById, typeChartData }: {
  group: HallOfFameStarterGroup;
  gameId: string;
  gen: number;
  rosterById: Map<number, Pokemon>;
  typeChartData: TypeChartData | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`hof-starter-group ${open ? 'hof-starter-open' : ''}`}>
      <button
        type="button"
        className="hof-starter-header"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="hof-starter-sprites">
          {group.starters.map((id) => {
            const starter = rosterById.get(id);
            return (
              <img
                key={id}
                className="hof-sprite hof-starter-sprite"
                src={buildSpritePath(id, starter?.name ?? group.name, gameId)}
                alt={starter?.name ?? `Pokemon #${id}`}
                loading="lazy"
                onError={(e) => {
                  const img = e.currentTarget;
                  const fallback = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
                  if (img.src !== fallback) img.src = fallback;
                }}
              />
            );
          })}
        </span>
        <span className="hof-starter-name">{group.name}</span>
        <span className="hof-expand-icon">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      {open && (
        <div className="hof-teams-list">
          {group.teams.map((team) => (
            <TeamRow
              key={team.rank}
              team={team}
              gameId={gameId}
              gen={gen}
              rosterById={rosterById}
              typeChartData={typeChartData}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function GameSection({ game, gen, typeChartData, rosterById }: {
  game: HallOfFameGame;
  gen: number;
  typeChartData: TypeChartData | null;
  rosterById: Map<number, Pokemon>;
}) {
  return (
    <div className="hof-game-section">
      <h2 className="hof-game-title">{game.badge} {game.name}</h2>
      <div className="hof-teams-list">
        {game.teams.map((team) => (
          <TeamRow key={team.rank} team={team} gameId={game.gameId} gen={gen} rosterById={rosterById} typeChartData={typeChartData} />
        ))}
      </div>

      {game.starterTeams && game.starterTeams.length > 0 && (
        <div className="hof-starters">
          <h3 className="hof-starters-title">Best team with each starter</h3>
          {game.starterTeams.map((group) => (
            <StarterGroup
              key={group.name}
              group={group}
              gameId={game.gameId}
              gen={gen}
              rosterById={rosterById}
              typeChartData={typeChartData}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const GEN_LABELS: Record<number, string> = {
  1: 'Generation I',
  2: 'Generation II',
  3: 'Generation III',
  4: 'Generation IV',
  5: 'Generation V',
  6: 'Generation VI',
  7: 'Generation VII',
  8: 'Generation VIII',
  9: 'Generation IX',
};

function GenRow({ gen, games, rosterById }: {
  gen: number;
  games: HallOfFameGame[];
  rosterById: Map<number, Pokemon>;
}) {
  const [typeChartData, setTypeChartData] = useState<TypeChartData | null>(null);

  useEffect(() => {
    loadTypeChartForGen(gen).then(setTypeChartData).catch(() => {});
  }, [gen]);

  return (
    <div className="hof-gen-row">
      <h2 className="hof-gen-title">{GEN_LABELS[gen] ?? `Generation ${gen}`}</h2>
      <div className={`hof-gen-games${games.length === 5 ? ' hof-gen-games--wrap3' : ''}`}>
        {games.map((game) => (
          <GameSection key={game.gameId} game={game} gen={gen} typeChartData={typeChartData} rosterById={rosterById} />
        ))}
      </div>
    </div>
  );
}

export const HallOfFame: React.FC<HallOfFameProps> = memo(({ onBack, rosterById }) => {
  const genGroups = useMemo(() => {
    const groups: { gen: number; games: HallOfFameGame[] }[] = [];
    const seen = new Map<number, HallOfFameGame[]>();
    for (const game of HALL_OF_FAME_DATA) {
      const gen = GAME_ID_TO_GEN[game.gameId] ?? 1;
      if (!seen.has(gen)) {
        const arr: HallOfFameGame[] = [];
        seen.set(gen, arr);
        groups.push({ gen, games: arr });
      }
      seen.get(gen)!.push(game);
    }
    return groups;
  }, []);

  return (
    <div className="hof-container">
      <div className="hof-header">
        <button className="btn" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
        <h1 className="hof-title">Hall of Fame</h1>
      </div>

      {HALL_OF_FAME_DATA.length === 0 ? (
        <div className="hof-empty">
          No Hall of Fame data yet. Check back soon!
        </div>
      ) : (
        <div className="hof-games-grid">
          {genGroups.map(({ gen, games }) => (
            <GenRow key={gen} gen={gen} games={games} rosterById={rosterById} />
          ))}
        </div>
      )}
    </div>
  );
});

HallOfFame.displayName = 'HallOfFame';
