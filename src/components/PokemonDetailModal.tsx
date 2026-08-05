import React, { memo } from 'react';
import { ResolvedPokemon } from '../types';
import { getPokemonArtwork } from '../data/pokemonData';
import { getPokemonSprite as getPokemonRetroSprite } from '../utils/spriteUtils';
import { ALL_NATURES, getNature, getNatureTag, applyNatureToStats } from '../utils/natureUtils';
import { X, Plus } from 'lucide-react';
import { StatRadarChart } from './StatRadarChart';

const GAME_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  red: { bg: "rgba(239, 68, 68, 0.15)", border: "rgba(239, 68, 68, 0.3)", text: "rgb(248, 113, 113)" },
  blue: { bg: "rgba(59, 130, 246, 0.15)", border: "rgba(59, 130, 246, 0.3)", text: "rgb(96, 165, 250)" },
  yellow: { bg: "rgba(234, 179, 8, 0.15)", border: "rgba(234, 179, 8, 0.3)", text: "rgb(253, 224, 71)" },
  gold: { bg: "rgba(245, 158, 11, 0.15)", border: "rgba(245, 158, 11, 0.3)", text: "rgb(251, 191, 36)" },
  silver: { bg: "rgba(148, 163, 184, 0.15)", border: "rgba(148, 163, 184, 0.3)", text: "rgb(203, 213, 225)" },
  crystal: { bg: "rgba(6, 182, 212, 0.15)", border: "rgba(6, 182, 212, 0.3)", text: "rgb(34, 211, 238)" },
  ruby: { bg: "rgba(220, 38, 38, 0.15)", border: "rgba(220, 38, 38, 0.3)", text: "rgb(239, 68, 68)" },
  sapphire: { bg: "rgba(37, 99, 235, 0.15)", border: "rgba(37, 99, 235, 0.3)", text: "rgb(59, 130, 246)" },
  emerald: { bg: "rgba(16, 185, 129, 0.15)", border: "rgba(16, 185, 129, 0.3)", text: "rgb(52, 211, 153)" },
  firered: { bg: "rgba(249, 115, 22, 0.15)", border: "rgba(249, 115, 22, 0.3)", text: "rgb(251, 146, 60)" },
  leafgreen: { bg: "rgba(132, 204, 22, 0.15)", border: "rgba(132, 204, 22, 0.3)", text: "rgb(163, 230, 53)" },
  diamond: { bg: "rgba(14, 165, 233, 0.15)", border: "rgba(14, 165, 233, 0.3)", text: "rgb(56, 189, 248)" },
  pearl: { bg: "rgba(236, 72, 153, 0.15)", border: "rgba(236, 72, 153, 0.3)", text: "rgb(244, 114, 182)" },
  platinum: { bg: "rgba(100, 116, 139, 0.15)", border: "rgba(100, 116, 139, 0.3)", text: "rgb(148, 163, 184)" },
  heartgold: { bg: "rgba(234, 179, 8, 0.15)", border: "rgba(234, 179, 8, 0.3)", text: "rgb(250, 204, 21)" },
  soulsilver: { bg: "rgba(203, 213, 225, 0.15)", border: "rgba(203, 213, 225, 0.3)", text: "rgb(226, 232, 240)" },
  black: { bg: "rgba(71, 85, 105, 0.2)", border: "rgba(71, 85, 105, 0.4)", text: "rgb(203, 213, 225)" },
  white: { bg: "rgba(241, 245, 249, 0.15)", border: "rgba(241, 245, 249, 0.3)", text: "rgb(248, 250, 252)" },
  "black-2": { bg: "rgba(51, 65, 85, 0.25)", border: "rgba(51, 65, 85, 0.5)", text: "rgb(148, 163, 184)" },
  "white-2": { bg: "rgba(226, 232, 240, 0.2)", border: "rgba(226, 232, 240, 0.4)", text: "rgb(241, 245, 249)" },
  x: { bg: "rgba(37, 99, 235, 0.15)", border: "rgba(37, 99, 235, 0.3)", text: "rgb(96, 165, 250)" },
  y: { bg: "rgba(225, 29, 72, 0.15)", border: "rgba(225, 29, 72, 0.3)", text: "rgb(251, 113, 133)" },
  "omega-ruby": { bg: "rgba(185, 28, 28, 0.15)", border: "rgba(185, 28, 28, 0.3)", text: "rgb(248, 113, 113)" },
  "alpha-sapphire": { bg: "rgba(29, 78, 216, 0.15)", border: "rgba(29, 78, 216, 0.3)", text: "rgb(96, 165, 250)" },
  sun: { bg: "rgba(245, 158, 11, 0.15)", border: "rgba(245, 158, 11, 0.3)", text: "rgb(251, 191, 36)" },
  moon: { bg: "rgba(147, 51, 234, 0.15)", border: "rgba(147, 51, 234, 0.3)", text: "rgb(192, 132, 252)" },
  "ultra-sun": { bg: "rgba(217, 119, 6, 0.15)", border: "rgba(217, 119, 6, 0.3)", text: "rgb(251, 191, 36)" },
  "ultra-moon": { bg: "rgba(126, 34, 206, 0.15)", border: "rgba(126, 34, 206, 0.3)", text: "rgb(192, 132, 252)" },
  sword: { bg: "rgba(14, 165, 233, 0.15)", border: "rgba(14, 165, 233, 0.3)", text: "rgb(56, 189, 248)" },
  shield: { bg: "rgba(225, 29, 72, 0.15)", border: "rgba(225, 29, 72, 0.3)", text: "rgb(251, 113, 133)" },
  "brilliant-diamond": { bg: "rgba(56, 189, 248, 0.15)", border: "rgba(56, 189, 248, 0.3)", text: "rgb(125, 211, 252)" },
  "shining-pearl": { bg: "rgba(244, 114, 182, 0.15)", border: "rgba(244, 114, 182, 0.3)", text: "rgb(247, 162, 209)" },
  "legends-arceus": { bg: "rgba(217, 119, 6, 0.15)", border: "rgba(217, 119, 6, 0.3)", text: "rgb(251, 191, 36)" },
  scarlet: { bg: "rgba(220, 38, 38, 0.15)", border: "rgba(220, 38, 38, 0.3)", text: "rgb(239, 68, 68)" },
  violet: { bg: "rgba(139, 92, 246, 0.15)", border: "rgba(139, 92, 246, 0.3)", text: "rgb(167, 139, 250)" },
};

interface PokemonDetailModalProps {
  pokemon: ResolvedPokemon | null;
  selectedNature?: string;
  onClose: () => void;
  onAddToTeam: (pokemon: ResolvedPokemon) => void;
  onNatureChange?: (natureId: string) => void;
  spriteStyle: string;
}

export const PokemonDetailModal: React.FC<PokemonDetailModalProps> = memo(({
  pokemon,
  selectedNature = 'hardy',
  onClose,
  onAddToTeam,
  onNatureChange,
  spriteStyle
}) => {
  if (!pokemon) return null;

  const artworkUrl = getPokemonArtwork(pokemon.id);
  const spriteUrl = getPokemonRetroSprite(pokemon, spriteStyle, false, false);

  const isGen1 = pokemon.generation === 1;
  const isGen3Plus = pokemon.generation >= 3;

  const activeNature = isGen3Plus ? getNature(selectedNature) : null;
  const currentStats = isGen3Plus ? applyNatureToStats(pokemon.stats, selectedNature, pokemon.generation) : pokemon.stats;

  const bst =
    currentStats.hp +
    currentStats.attack +
    currentStats.defense +
    (isGen1 ? (currentStats.special ?? 0) : currentStats.special_attack + currentStats.special_defense) +
    currentStats.speed;

  const maxStatVal = 180;

  const stats = isGen1
    ? [
        { key: 'hp', label: 'HP', val: currentStats.hp },
        { key: 'attack', label: 'Attack', val: currentStats.attack },
        { key: 'defense', label: 'Defense', val: currentStats.defense },
        { key: 'special', label: 'Special', val: currentStats.special ?? 0 },
        { key: 'speed', label: 'Speed', val: currentStats.speed },
      ]
    : [
        { key: 'hp', label: 'HP', val: currentStats.hp },
        { key: 'attack', label: 'Attack', val: currentStats.attack },
        { key: 'defense', label: 'Defense', val: currentStats.defense },
        { key: 'special_attack', label: 'Sp. Atk', val: currentStats.special_attack },
        { key: 'special_defense', label: 'Sp. Def', val: currentStats.special_defense },
        { key: 'speed', label: 'Speed', val: currentStats.speed },
      ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="modal-header-row">
          <img
            src={artworkUrl}
            alt={pokemon.name}
            className="modal-artwork"
            onError={(e) => {
              (e.target as HTMLImageElement).src = spriteUrl;
            }}
          />
          <div>
            <span className="modal-subtext">
              #{String(pokemon.id).padStart(3, '0')} • Generation {pokemon.generation}
            </span>
            <h2 className="modal-title">{pokemon.name}</h2>
            <div className="type-badges-row modal-type-row">
              {pokemon.types.map((t) => {
                const typeStr = typeof t === 'string' ? t : ((t as any)?.type?.name || (t as any)?.name || String(t));
                return (
                  <span key={typeStr} className={`type-badge type-${typeStr}`}>
                    {typeStr}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        <div className="modal-grid">
          <div className="modal-grid-left">
            {isGen3Plus && (
              <div className="modal-nature-bar">
                <span className="modal-nature-label">
                  Pokémon Nature:
                </span>
                <select
                  className="nature-select-input modal-nature-select"
                  value={selectedNature}
                  onChange={(e) => onNatureChange?.(e.target.value)}
                >
                  {ALL_NATURES.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.name} ({getNatureTag(n)})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="modal-section-mb">
              <div className="modal-stats-header">
                <span>Stats Breakdown {isGen3Plus ? '(Nature Highlighted)' : ''}</span>
                <span className="modal-bst-total">Total: {bst}</span>
              </div>

              {stats.map((s) => {
                const isIncreased = activeNature && activeNature.increasedStat === s.key && activeNature.increasedStat !== activeNature.decreasedStat;
                const isDecreased = activeNature && activeNature.decreasedStat === s.key && activeNature.increasedStat !== activeNature.decreasedStat;

                let labelColor = 'var(--text-main)';
                let valColor = 'var(--text-main)';
                let barBgGradient = undefined;
                let barGlow = undefined;

                if (isIncreased) {
                  labelColor = '#10b981';
                  valColor = '#10b981';
                  barBgGradient = 'linear-gradient(90deg, #10b981, #34d399)';
                  barGlow = '0 0 8px rgba(16, 185, 129, 0.5)';
                } else if (isDecreased) {
                  labelColor = '#f43f5e';
                  valColor = '#f43f5e';
                  barBgGradient = 'linear-gradient(90deg, #f43f5e, #fb7185)';
                }

                return (
                  <div key={s.label} className="stat-bar-container">
                    <span className="stat-name" style={{ color: labelColor, fontWeight: isIncreased || isDecreased ? 700 : 500 }}>
                      {s.label}
                    </span>
                    <span className="stat-val" style={{ color: valColor, fontWeight: isIncreased || isDecreased ? 700 : 600 }}>
                      {s.val}
                    </span>
                    <div className="stat-bar-bg">
                      <div
                        className="stat-bar-fill"
                        style={{
                          width: `${Math.min(100, (s.val / maxStatVal) * 100)}%`,
                          background: barBgGradient,
                          boxShadow: barGlow,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {pokemon.abilities && pokemon.abilities.length > 0 && (
              <div className="modal-info-row">
                <strong className="modal-info-label">Abilities: </strong>
                <span className="modal-info-val">{pokemon.abilities.join(', ')}</span>
              </div>
            )}

            {pokemon.availability && pokemon.availability.length > 0 ? (
              <div className="modal-info-row">
                <strong className="modal-info-label">Catchable in: </strong>
                <div className="type-badges-row modal-type-row" style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0.35rem', verticalAlign: 'middle', marginLeft: '0.4rem' }}>
                  {pokemon.availability.map((game) => {
                    const color = GAME_COLORS[game] || { bg: 'rgba(255, 255, 255, 0.05)', border: 'rgba(255, 255, 255, 0.1)', text: 'var(--text-main)' };
                    return (
                      <span
                        key={game}
                        className="availability-badge"
                        style={{
                          backgroundColor: color.bg,
                          borderColor: color.border,
                          color: color.text,
                        }}
                      >
                        {game}
                      </span>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="modal-info-row">
                <strong className="modal-info-label">Catchable in: </strong>
                <span className="availability-badge availability-badge-event">
                  Event Only
                </span>
              </div>
            )}
          </div>

          <div className="modal-grid-right">
            <StatRadarChart
              pokemonStats={currentStats}
              pokemonGen={pokemon.generation}
              pokemonName={pokemon.name}
              className="modal-radar-card"
            />
          </div>
        </div>

        <div className="modal-footer-actions">
          <button className="btn" onClick={onClose}>
            Close
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              onAddToTeam(pokemon);
              onClose();
            }}
          >
            <Plus size={16} />
            <span>Add to Team</span>
          </button>
        </div>
      </div>
    </div>
  );
});

PokemonDetailModal.displayName = 'PokemonDetailModal';
