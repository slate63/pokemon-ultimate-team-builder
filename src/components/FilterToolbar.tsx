import React, { memo } from 'react';
import { PokemonType } from '../types';
import { POKEMON_TYPES } from '../utils/coverage';
import { Search, ArrowUpDown } from 'lucide-react';

interface FilterToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedType1: PokemonType | '';
  onType1Change: (type: PokemonType | '') => void;
  selectedType2: PokemonType | '';
  onType2Change: (type: PokemonType | '') => void;
  fullyEvolvedOnly: boolean;
  onFullyEvolvedToggle: (checked: boolean) => void;
  includeLegendaries: boolean;
  onLegendariesToggle: (checked: boolean) => void;
  includeMythicals: boolean;
  onMythicalsToggle: (checked: boolean) => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
  totalFilteredCount: number;
  /** Generation-specific type list (e.g. 15 types in Gen 1). Falls back to all 18. */
  types?: PokemonType[];
}

export const FilterToolbar: React.FC<FilterToolbarProps> = memo(({
  searchQuery,
  onSearchChange,
  selectedType1,
  onType1Change,
  selectedType2,
  onType2Change,
  fullyEvolvedOnly,
  onFullyEvolvedToggle,
  includeLegendaries,
  onLegendariesToggle,
  includeMythicals,
  onMythicalsToggle,
  sortBy,
  onSortByChange,
  totalFilteredCount,
  types
}) => {
  const typeList = types ?? POKEMON_TYPES;
  return (
    <div className="filter-toolbar">
      <div className="filter-row">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by Pokémon name or Dex #..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <select
          className="game-select"
          value={selectedType1}
          onChange={(e) => onType1Change(e.target.value as PokemonType | '')}
          aria-label="Filter by Type 1"
        >
          <option value="">Any Type 1</option>
          {typeList.map((t) => (
            <option key={t} value={t}>
              {t.toUpperCase()}
            </option>
          ))}
        </select>

        <select
          className="game-select"
          value={selectedType2}
          onChange={(e) => onType2Change(e.target.value as PokemonType | '')}
          aria-label="Filter by Type 2"
        >
          <option value="">Any Type 2</option>
          {typeList.map((t) => (
            <option key={t} value={t}>
              {t.toUpperCase()}
            </option>
          ))}
        </select>

        <div className="sort-select-wrapper">
          <ArrowUpDown size={15} color="var(--text-dim)" />
          <select
            className="game-select"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            aria-label="Sort Pokémon By"
          >
            <option value="gen-num-type">Gen → Number → Type</option>
            <option value="id-asc">Dex # (Low to High)</option>
            <option value="id-desc">Dex # (High to Low)</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="bst-desc">Base Stat Total (BST High)</option>
            <option value="attack-desc">Highest Attack</option>
            <option value="spatk-desc">Highest Sp. Atk</option>
            <option value="speed-desc">Highest Speed</option>
          </select>
        </div>
      </div>

      <div className="filter-row filter-row-between">
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={fullyEvolvedOnly}
              onChange={(e) => onFullyEvolvedToggle(e.target.checked)}
            />
            Fully Evolved Only
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={includeLegendaries}
              onChange={(e) => onLegendariesToggle(e.target.checked)}
            />
            Include Legendaries
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={includeMythicals}
              onChange={(e) => onMythicalsToggle(e.target.checked)}
            />
            Include Mythicals
          </label>
        </div>

        <span className="filtered-count-label">
          Showing {totalFilteredCount} Pokémon
        </span>
      </div>
    </div>
  );
});

FilterToolbar.displayName = 'FilterToolbar';
