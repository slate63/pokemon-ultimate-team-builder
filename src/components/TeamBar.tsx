import React, { memo } from 'react';
import { ResolvedTeam, ResolvedTeamMember, PokemonType } from '../types';
import { getPokemonSprite } from '../data/pokemonData';
import { getPokemonSprite as getPokemonRetroSprite } from '../utils/spriteUtils';
import { ALL_NATURES, getNatureTag } from '../utils/natureUtils';
import { Sparkles, X, Plus, Info } from 'lucide-react';
import { HighlightInfo } from './CoverageMatrix';

interface TeamSlotProps {
  member: ResolvedTeamMember | null;
  idx: number;
  isSelected: boolean;
  isHighlighted?: boolean;
  highlightLabel?: string;
  highlightCategory?: string;
  highlightType?: PokemonType;
  hasAnyHighlight?: boolean;
  activeGen: number;
  spriteStyle: string;
  onSlotSelect: (index: number) => void;
  onRemoveMember: (index: number) => void;
  onToggleShiny: (index: number) => void;
  onNatureChange: (index: number, natureId: string) => void;
  onInspectMember: (member: ResolvedTeamMember) => void;
}

const TeamSlot: React.FC<TeamSlotProps> = memo(({
  member,
  idx,
  isSelected,
  isHighlighted,
  highlightLabel,
  highlightCategory,
  highlightType,
  hasAnyHighlight,
  activeGen,
  spriteStyle,
  onSlotSelect,
  onRemoveMember,
  onToggleShiny,
  onNatureChange,
  onInspectMember,
}) => {
  if (!member) {
    return (
      <div
        className={`slot-card empty ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''} ${hasAnyHighlight && !isHighlighted ? 'dimmed' : ''}`}
        onClick={() => onSlotSelect(idx)}
        style={{ borderColor: isSelected ? 'var(--accent-blue)' : undefined }}
      >
        <span className="slot-number">#{idx + 1}</span>
        <Plus size={24} color="var(--text-dim)" style={{ marginBottom: '0.25rem' }} />
        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Select Slot</span>
      </div>
    );
  }

  const spriteUrl = getPokemonRetroSprite(member.pokemon, spriteStyle, !!member.isShiny, false);

  return (
    <div
      className={`slot-card filled ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''} ${hasAnyHighlight && !isHighlighted ? 'dimmed' : ''}`}
      style={{ borderColor: isSelected ? 'var(--accent-blue)' : undefined }}
      onClick={() => onSlotSelect(idx)}
    >
      <span className="slot-number">#{idx + 1}</span>

      {highlightLabel && (
        <div className={`slot-highlight-badge badge-cat-${highlightCategory || 'default'} ${highlightCategory === 'type' && highlightType ? `type-${highlightType}` : ''}`}>
          {highlightLabel}
        </div>
      )}

      <div className="slot-actions" onClick={(e) => e.stopPropagation()}>
        <button
          className="icon-btn"
          onClick={() => onInspectMember(member)}
          title="Inspect Base Stats & Moves"
        >
          <Info size={13} />
        </button>
        <button
          className="icon-btn"
          onClick={() => onRemoveMember(idx)}
          title="Remove from Team"
        >
          <X size={13} />
        </button>
      </div>

      <img
        src={spriteUrl}
        alt={member.pokemon.name}
        className="slot-sprite"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).src = getPokemonSprite(member.pokemon.id, false);
        }}
      />

      <div className="slot-name">{member.nickname || member.pokemon.name}</div>

      {activeGen > 1 && spriteStyle !== 'red-blue' && spriteStyle !== 'yellow' && (
        <button
          className={`shiny-btn ${member.isShiny ? 'shiny-active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleShiny(idx);
          }}
          title="Toggle Shiny Sprite"
        >
          <Sparkles size={14} />
          <span>{member.isShiny ? 'Shiny' : 'Normal'}</span>
        </button>
      )}

      {activeGen >= 3 && (
        <div className="nature-selector-container" onClick={(e) => e.stopPropagation()}>
          <select
            className="nature-select-input"
            value={member.selectedNature || 'hardy'}
            onChange={(e) => onNatureChange(idx, e.target.value)}
            title="Select Nature (+10% / -10% stat change)"
          >
            {ALL_NATURES.map((n) => (
              <option key={n.id} value={n.id}>
                {n.name} ({getNatureTag(n)})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="type-badges-row">
        {member.pokemon.types.map((type) => {
          const typeStr = typeof type === 'string' ? type : ((type as any)?.type?.name || (type as any)?.name || String(type));
          return (
            <span key={typeStr} className={`type-badge type-${typeStr}`}>
              {typeStr}
            </span>
          );
        })}
      </div>
    </div>
  );
});

TeamSlot.displayName = 'TeamSlot';

interface TeamBarProps {
  team: ResolvedTeam;
  activeSlotIndex: number | null;
  highlightedSlots?: HighlightInfo[];
  activeGen: number;
  onSlotSelect: (index: number) => void;
  onRemoveMember: (index: number) => void;
  onToggleShiny: (index: number) => void;
  onNatureChange: (index: number, natureId: string) => void;
  onInspectMember: (member: ResolvedTeamMember) => void;
  spriteStyle: string;
}

export const TeamBar: React.FC<TeamBarProps> = memo(({
  team,
  activeSlotIndex,
  highlightedSlots = [],
  activeGen,
  onSlotSelect,
  onRemoveMember,
  onToggleShiny,
  onNatureChange,
  onInspectMember,
  spriteStyle,
}) => {
  const hasAnyHighlight = highlightedSlots.length > 0;
  const highlightMap = new Map<number, HighlightInfo>();
  highlightedSlots.forEach((item) => highlightMap.set(item.slotIndex, item));

  return (
    <section className="team-bar-section">
      <div className="team-slots-grid">
        {team.map((member, idx) => {
          const highlightItem = highlightMap.get(idx);
          return (
            <TeamSlot
              key={idx}
              member={member}
              idx={idx}
              isSelected={activeSlotIndex === idx}
              isHighlighted={!!highlightItem}
              highlightLabel={highlightItem?.label}
              highlightCategory={highlightItem?.category}
              highlightType={highlightItem?.type}
              hasAnyHighlight={hasAnyHighlight}
              activeGen={activeGen}
              spriteStyle={spriteStyle}
              onSlotSelect={onSlotSelect}
              onRemoveMember={onRemoveMember}
              onToggleShiny={onToggleShiny}
              onNatureChange={onNatureChange}
              onInspectMember={onInspectMember}
            />
          );
        })}
      </div>
    </section>
  );
});

TeamBar.displayName = 'TeamBar';

