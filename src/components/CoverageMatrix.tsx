import React, { useMemo, memo } from 'react';
import { ResolvedTeam, PokemonType } from '../types';
import {
  calculateTeamDefensiveCoverage,
  calculateTeamOffensiveCoverage,
  getWeaknessAlerts,
  POKEMON_TYPES
} from '../utils/coverage';
import { TypeChartData } from '../utils/typeChart';
import { AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import { StatRadarChart } from './StatRadarChart';

interface CoverageMatrixProps {
  team: ResolvedTeam;
  /** Generation-specific type chart + type list. Falls back to defaults when null. */
  typeChartData?: TypeChartData | null;
  activeGen?: number;
}

export const CoverageMatrix: React.FC<CoverageMatrixProps> = memo(({ team, typeChartData, activeGen }) => {
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
                  <td className="text-left">
                    <span className={`type-badge type-${type} type-badge-sm`}>
                      {type}
                    </span>
                  </td>
                  
                  <td>
                    {def.weak2x > 0 ? (
                      <span className="val-weak">{def.weak2x}</span>
                    ) : (
                      <span className="val-neutral">-</span>
                    )}
                  </td>

                  <td>
                    {def.weak4x > 0 ? (
                      <span className="val-weak-4x">{def.weak4x}</span>
                    ) : (
                      <span className="val-neutral">-</span>
                    )}
                  </td>

                  <td>
                    {totalResist > 0 ? (
                      <span className="val-resist">{totalResist}</span>
                    ) : (
                      <span className="val-neutral">-</span>
                    )}
                  </td>

                  <td>
                    {def.immune > 0 ? (
                      <span className="val-immune">{def.immune}</span>
                    ) : (
                      <span className="val-neutral">-</span>
                    )}
                  </td>

                  <td>
                    {offCount > 0 ? (
                      <span className="hit-count-active">
                        ⚡ {offCount}
                      </span>
                    ) : (
                      <span className="val-neutral">-</span>
                    )}
                  </td>
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
