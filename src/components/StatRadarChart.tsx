import React, { useState, memo, useId } from 'react';
import { ResolvedTeam } from '../types';
import { Activity } from 'lucide-react';

interface StatRadarChartProps {
  team?: ResolvedTeam;
  activeGen?: number;
  pokemonStats?: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
    special?: number;
    special_attack?: number;
    special_defense?: number;
  };
  pokemonGen?: number;
  pokemonName?: string;
  className?: string;
}

interface StatAttribute {
  key: string;
  label: string;
  angleDeg: number;
}

const GEN1_ATTRIBUTES: StatAttribute[] = [
  { key: 'hp', label: 'HP', angleDeg: -90 },
  { key: 'attack', label: 'Attack', angleDeg: -18 },
  { key: 'defense', label: 'Defense', angleDeg: 54 },
  { key: 'speed', label: 'Speed', angleDeg: 126 },
  { key: 'special', label: 'Special', angleDeg: 198 },
];

const GEN2_PLUS_ATTRIBUTES: StatAttribute[] = [
  { key: 'hp', label: 'HP', angleDeg: -90 },
  { key: 'attack', label: 'Attack', angleDeg: -30 },
  { key: 'defense', label: 'Defense', angleDeg: 30 },
  { key: 'speed', label: 'Speed', angleDeg: 90 },
  { key: 'spDef', label: 'Sp. Def', angleDeg: 150 },
  { key: 'spAtk', label: 'Sp. Atk', angleDeg: -150 },
];

export const StatRadarChart: React.FC<StatRadarChartProps> = memo(({
  team,
  activeGen,
  pokemonStats,
  pokemonGen,
  pokemonName,
  className
}) => {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const idSuffix = useId().replace(/:/g, '');
  const fillGradientId = `radarFillGradient-${idSuffix}`;
  const glowFilterId = `yellowGlow-${idSuffix}`;

  const activeMembers = team ? team.filter((m): m is NonNullable<typeof m> => m !== null) : [];
  const count = team ? activeMembers.length : 1;

  const isGen1 = pokemonStats
    ? pokemonGen === 1
    : (activeGen === 1 || (count > 0 && activeMembers[0].pokemon.generation === 1));
  const attributes = isGen1 ? GEN1_ATTRIBUTES : GEN2_PLUS_ATTRIBUTES;

  let avgStats: Record<string, number> = {};

  if (pokemonStats) {
    avgStats = isGen1
      ? {
          hp: pokemonStats.hp,
          attack: pokemonStats.attack,
          defense: pokemonStats.defense,
          speed: pokemonStats.speed,
          special: pokemonStats.special ?? pokemonStats.special_attack ?? 0,
        }
      : {
          hp: pokemonStats.hp,
          attack: pokemonStats.attack,
          defense: pokemonStats.defense,
          speed: pokemonStats.speed,
          spDef: pokemonStats.special_defense ?? pokemonStats.special ?? 0,
          spAtk: pokemonStats.special_attack ?? pokemonStats.special ?? 0,
        };
  } else {
    let hpSum = 0;
    let atkSum = 0;
    let defSum = 0;
    let spdSum = 0;
    let specialSum = 0;
    let spDefSum = 0;
    let spAtkSum = 0;

    if (count > 0) {
      for (const m of activeMembers) {
        const s = m.pokemon.stats;
        hpSum += s.hp;
        atkSum += s.attack;
        defSum += s.defense;
        spdSum += s.speed;

        if (isGen1) {
          specialSum += s.special ?? s.special_attack ?? 0;
        } else {
          spAtkSum += s.special_attack ?? s.special ?? 0;
          spDefSum += s.special_defense ?? s.special ?? 0;
        }
      }
    }

    avgStats = isGen1
      ? {
          hp: count > 0 ? hpSum / count : 0,
          attack: count > 0 ? atkSum / count : 0,
          defense: count > 0 ? defSum / count : 0,
          speed: count > 0 ? spdSum / count : 0,
          special: count > 0 ? specialSum / count : 0,
        }
      : {
          hp: count > 0 ? hpSum / count : 0,
          attack: count > 0 ? atkSum / count : 0,
          defense: count > 0 ? defSum / count : 0,
          speed: count > 0 ? spdSum / count : 0,
          spDef: count > 0 ? spDefSum / count : 0,
          spAtk: count > 0 ? spAtkSum / count : 0,
        };
  }

  const avgBst = Math.round(Object.values(avgStats).reduce((acc, v) => acc + v, 0));

  const maxAvgValue = Math.max(...Object.values(avgStats), 0);
  const scaleMax = Math.max(150, Math.ceil(maxAvgValue / 10) * 10);

  const width = 320;
  const height = 280;
  const cx = width / 2;
  const cy = height / 2 - 5;
  const radius = 80;

  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  const getCoordinates = (angleDeg: number, r: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  const dataPolygonPoints = attributes.map((attr) => {
    const val = avgStats[attr.key] ?? 0;
    const r = (val / scaleMax) * radius;
    const { x, y } = getCoordinates(attr.angleDeg, r);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  const outerVertices = attributes.map((attr) => getCoordinates(attr.angleDeg, radius));

  const centerPolyPoints = attributes
    .map((attr) => {
      const { x, y } = getCoordinates(attr.angleDeg, 6);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <div className={`stat-radar-card ${className || ''}`}>
      <div className="stat-radar-header">
        <div className="radar-header-title">
          <Activity size={16} color="var(--accent-gold)" />
          <span className="radar-title-text">
            {pokemonName ? `${pokemonName}'s Base Stats` : `Team Average Base Stats ${isGen1 ? '(Gen 1)' : ''}`}
          </span>
        </div>
        {count > 0 && (
          <span className="radar-bst-badge">
            {pokemonName ? `BST: ${avgBst}` : `Avg BST: ${avgBst}`}
          </span>
        )}
      </div>

      <div className="stat-radar-container">
        <svg viewBox={`0 0 ${width} ${height}`} className="stat-radar-svg">
          <defs>
            <radialGradient id={fillGradientId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#acc229" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#7a8a1c" stopOpacity="0.55" />
            </radialGradient>
            <filter id={glowFilterId} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {gridLevels.map((level, idx) => {
            const levelRadius = radius * level;
            const pointsStr = attributes.map((attr) => {
              const { x, y } = getCoordinates(attr.angleDeg, levelRadius);
              return `${x.toFixed(1)},${y.toFixed(1)}`;
            }).join(' ');

            return (
              <polygon
                key={idx}
                points={pointsStr}
                fill="none"
                stroke={level === 1.0 ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.15)'}
                strokeWidth={level === 1.0 ? 1.5 : 1}
              />
            );
          })}

          {outerVertices.map((vertex, idx) => (
            <line
              key={idx}
              x1={cx}
              y1={cy}
              x2={vertex.x}
              y2={vertex.y}
              stroke="rgba(255, 255, 255, 0.25)"
              strokeWidth={1}
            />
          ))}

          {outerVertices.map((vertex, idx) => (
            <circle key={idx} cx={vertex.x} cy={vertex.y} r={3} fill="#ffffff" />
          ))}

          {count > 0 && (
            <polygon
              points={dataPolygonPoints}
              fill={`url(#${fillGradientId})`}
              stroke="#c5df29"
              strokeWidth={2}
              strokeLinejoin="round"
            />
          )}

          {count > 0 &&
            attributes.map((attr) => {
              const val = avgStats[attr.key] ?? 0;
              const r = (val / scaleMax) * radius;
              const { x, y } = getCoordinates(attr.angleDeg, r);
              const isHovered = hoveredKey === attr.key;

              return (
                <g key={attr.key}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 5 : 3.5}
                    fill="#facc15"
                    stroke="#ffffff"
                    strokeWidth={1.5}
                    filter={isHovered ? `url(#${glowFilterId})` : undefined}
                    style={{ transition: 'all 0.2s ease', cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredKey(attr.key)}
                    onMouseLeave={() => setHoveredKey(null)}
                  />
                </g>
              );
            })}

          <polygon points={centerPolyPoints} fill="#facc15" stroke="#eab308" strokeWidth={1} />

          {attributes.map((attr) => {
            const val = avgStats[attr.key] ?? 0;
            const isHovered = hoveredKey === attr.key;

            const labelRadius = radius + 22;
            let textAnchor: 'middle' | 'start' | 'end' = 'middle';
            let dx = 0;
            let dy = 0;

            if (isGen1) {
              if (attr.angleDeg === -90) {
                textAnchor = 'middle';
                dy = -4;
              } else if (attr.angleDeg === -18) {
                textAnchor = 'start';
                dx = 6;
                dy = -2;
              } else if (attr.angleDeg === 54) {
                textAnchor = 'start';
                dx = 6;
                dy = 8;
              } else if (attr.angleDeg === 126) {
                textAnchor = 'end';
                dx = -6;
                dy = 8;
              } else if (attr.angleDeg === 198) {
                textAnchor = 'end';
                dx = -6;
                dy = -2;
              }
            } else {
              if (attr.angleDeg === -90) {
                textAnchor = 'middle';
                dy = -4;
              } else if (attr.angleDeg === -30) {
                textAnchor = 'start';
                dx = 6;
                dy = -2;
              } else if (attr.angleDeg === 30) {
                textAnchor = 'start';
                dx = 6;
                dy = 10;
              } else if (attr.angleDeg === 90) {
                textAnchor = 'middle';
                dy = 18;
              } else if (attr.angleDeg === 150) {
                textAnchor = 'end';
                dx = -6;
                dy = 10;
              } else if (attr.angleDeg === -150) {
                textAnchor = 'end';
                dx = -6;
                dy = -2;
              }
            }

            const { x, y } = getCoordinates(attr.angleDeg, labelRadius);

            return (
              <g
                key={attr.key}
                className="radar-label-group"
                onMouseEnter={() => setHoveredKey(attr.key)}
                onMouseLeave={() => setHoveredKey(null)}
                style={{ cursor: 'pointer' }}
              >
                <text
                  x={x + dx}
                  y={y + dy}
                  textAnchor={textAnchor}
                  fill={isHovered ? '#ffffff' : '#fbbf24'}
                  fontSize="11"
                  fontWeight="700"
                  fontFamily="var(--font-heading)"
                  className="radar-label-text"
                >
                  {attr.label}
                </text>
                {count > 0 && (
                  <text
                    x={x + dx}
                    y={y + dy + 13}
                    textAnchor={textAnchor}
                    fill={isHovered ? '#38bdf8' : '#e5e7eb'}
                    fontSize="10"
                    fontWeight="600"
                    fontFamily="var(--font-body)"
                  >
                    {val.toFixed(1)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {count === 0 && (
        <p className="radar-empty-hint">
          Add Pokémon to team to calculate stat profile
        </p>
      )}
    </div>
  );
});

StatRadarChart.displayName = 'StatRadarChart';
