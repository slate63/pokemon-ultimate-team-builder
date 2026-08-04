import React, { useMemo, memo } from 'react';
import { ResolvedTeam, PokemonType } from '../types';
import {
  calculateTeamDefensiveCoverage,
  calculateTeamOffensiveCoverage,
  getWeaknessAlerts,
  getMatchingTeamSlots,
  MatrixCategory,
  POKEMON_TYPES
} from '../utils/coverage';
import { TypeChartData } from '../utils/typeChart';
import { AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import { StatRadarChart } from './StatRadarChart';

export interface HighlightInfo {
  slotIndex: number;
  label: string;
  type: PokemonType;
  category: MatrixCategory;
}

interface CoverageMatrixProps {
  team: ResolvedTeam;
  /** Generation-specific type chart + type list. Falls back to defaults when null. */
  typeChartData?: TypeChartData | null;
  activeGen?: number;
  onHighlightSlots?: (highlights: HighlightInfo[]) => void;
}

export const CoverageMatrix: React.FC<CoverageMatrixProps> = memo(({
  team,
  typeChartData,
  activeGen,
  onHighlightSlots
}) => {
  const chart = typeChartData?.chart;
  const types: PokemonType[] = typeChartData?.types ?? POKEMON_TYPES;

  const defensiveCoverage = useMemo(
    () => calculateTeamDefensiveCoverage(team, chart, types),
    [team, chart, types]
  );
  const offensiveCoverage = useMemo(
    () => calculateTeamOffensiveCoverage(team, chart, types),
    [team, chart, types]
  );
  const weaknessAlerts = useMemo(
    () => getWeaknessAlerts(defensiveCoverage, types),
    [defensiveCoverage, types]
  );

  const activeCount = team.filter(Boolean).length;

  const getCategoryShortLabel = (category: MatrixCategory, type?: PokemonType): string => {
    switch (category) {
      case 'weak2x': return '2x Weak';
      case 'weak4x': return '4x Weak';
      case 'resist': return 'Resists';
      case 'immune': return 'Immune';
      case 'hit': return 'STAB Hit';
      case 'type': return type ? `${type.toUpperCase()} TYPE` : 'SAME TYPE';
    }
  };

  const handleCellMouseEnter = (type: PokemonType, category: MatrixCategory) => {
    const slots = getMatchingTeamSlots(team, chart, type, category);
    const label = getCategoryShortLabel(category, type);
    const highlights: HighlightInfo[] = slots.map((slotIndex) => ({
      slotIndex,
      label,
      type,
      category,
    }));
    onHighlightSlots?.(highlights);
  };

  const handleTypeHeaderMouseEnter = (type: PokemonType) => {
    const slots = getMatchingTeamSlots(team, chart, type, 'type');
    const label = getCategoryShortLabel('type', type);
    const highlights: HighlightInfo[] = slots.map((slotIndex) => ({
      slotIndex,
      label,
      type,
      category: 'type',
    }));
    onHighlightSlots?.(highlights);
  };

  const handleCellMouseLeave = () => {
    onHighlightSlots?.([]);
  };

  const renderCell = (
    type: PokemonType,
    category: MatrixCategory,
    count: number,
    valClassName: string,
    prefix?: React.ReactNode
  ) => {
    const isInteractive = count > 0;
    return (
      <td
        className={isInteractive ? 'matrix-cell-interactive' : ''}
        onMouseEnter={() => isInteractive && handleCellMouseEnter(type, category)}
        onMouseLeave={() => isInteractive && handleCellMouseLeave()}
        title={isInteractive ? `Hover to highlight matching Pokémon in Team Bar` : undefined}
      >
        {count > 0 ? (
          <span className={`${valClassName} ${isInteractive ? 'cell-hover-badge' : ''}`}>
            {prefix}
            <span>{count}</span>
          </span>
        ) : (
          <span className="val-neutral">-</span>
        )}
      </td>
    );
  };

  return (
    <aside className="analysis-panel">
      <div className="panel-title">
        <span className="panel-title-content">
          <ShieldCheck size={18} color="var(--accent-blue)" />
          Team Defense Matrix
        </span>
      </div>

      {activeCount > 0 && weaknessAlerts.length > 0 && (
        <div className="alerts-box">
          <div className="alerts-header">
            <AlertTriangle size={15} />
            Shared Team Weaknesses (3+ Members)
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

      {activeCount === 0 ? (
        <p className="matrix-empty-msg">
          Add Pokémon to your team to see type weaknesses, resistances, and offensive coverage analysis.
        </p>
      ) : (
        <table className="matrix-table">
          <thead>
            <tr>
              <th rowSpan={2} className="text-left">Type</th>
              <th colSpan={2} className="th-weakness-group">WEAKNESS</th>
              <th rowSpan={2} title="Resist (0.5x or 0.25x damage taken)">Resist</th>
              <th rowSpan={2} title="Immune (0x damage taken)">Immune</th>
              <th rowSpan={2} title="Team STAB Super Effective Coverage"><Zap size={12} className="inline-icon" /> Hit</th>
            </tr>
            <tr>
              <th title="Weak (2x damage taken)">2x</th>
              <th title="Double Weak (4x damage taken)">4x</th>
            </tr>
          </thead>
          <tbody>
            {types.map((type) => {
              const def = defensiveCoverage[type];
              const offCount = offensiveCoverage[type];
              const totalResist = def.resistHalf + def.resistQuarter;

              return (
                <tr key={type}>
                  <td
                    className="text-left matrix-cell-interactive"
                    onMouseEnter={() => handleTypeHeaderMouseEnter(type)}
                    onMouseLeave={handleCellMouseLeave}
                    title="Hover to highlight Pokémon of this type in Team Bar"
                  >
                    <span className={`type-badge type-${type} type-badge-sm`}>
                      {type}
                    </span>
                  </td>
                  
                  {renderCell(type, 'weak2x', def.weak2x, 'val-weak')}
                  {renderCell(type, 'weak4x', def.weak4x, 'val-weak-4x')}
                  {renderCell(type, 'resist', totalResist, 'val-resist')}
                  {renderCell(type, 'immune', def.immune, 'val-immune')}
                  {renderCell(type, 'hit', offCount, 'hit-count-active', <Zap size={11} style={{ flexShrink: 0, marginRight: '2px' }} />)}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Team Average Base Stat Radar Chart */}
      <StatRadarChart team={team} activeGen={activeGen} />
    </aside>
  );
});


CoverageMatrix.displayName = 'CoverageMatrix';

