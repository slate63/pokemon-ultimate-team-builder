import { useState } from 'react';
import { Header } from './components/Header';
import { TeamBar } from './components/TeamBar';
import { CoverageMatrix, HighlightInfo } from './components/CoverageMatrix';
import { FilterToolbar } from './components/FilterToolbar';
import { PokemonGrid } from './components/PokemonGrid';
import { PokemonDetailModal } from './components/PokemonDetailModal';
import {
  usePokemonData,
  useGameSelection,
  useTeam,
  useFilters,
  useUrlSync,
  usePokemonInspector,
} from './hooks';

export default function App() {
  const { pokemonRoster, loading, rosterById } = usePokemonData();

  const [highlightedSlots, setHighlightedSlots] = useState<HighlightInfo[]>([]);

  const {
    selectedGameId,
    setSelectedGameId,
    selectedVersionId,
    setSelectedVersionId,
    spriteStyle,
    setSpriteStyle,
    activeGen,
    typeChartData,
    handleGameChange,
    handleVersionChange,
  } = useGameSelection();

  const {
    team,
    setTeam,
    activeSlotIndex,
    setActiveSlotIndex,
    resolvedTeam,
    handleAddPokemonToTeam,
    handleRemoveMember,
    handleToggleShiny,
    handleNatureChange,
    handleClearTeam,
    handleRandomizeTeam,
  } = useTeam(rosterById, activeGen, spriteStyle);

  const {
    searchQuery,
    setSearchQuery,
    selectedType1,
    setSelectedType1,
    selectedType2,
    setSelectedType2,
    fullyEvolvedOnly,
    setFullyEvolvedOnly,
    excludeTrades,
    setExcludeTrades,
    includeLegendaries,
    setIncludeLegendaries,
    includeMythicals,
    setIncludeMythicals,
    sortBy,
    setSortBy,
    filteredRoster,
  } = useFilters(pokemonRoster, activeGen, selectedGameId, selectedVersionId);

  useUrlSync(
    pokemonRoster,
    loading,
    selectedGameId,
    setSelectedGameId,
    selectedVersionId,
    setSelectedVersionId,
    team,
    setTeam,
    handleVersionChange
  );

  const {
    inspectedPokemon,
    inspectedNature,
    setInspectedNature,
    inspectedSlotIndex,
    handleInspectPokemon,
    handleCloseInspector,
  } = usePokemonInspector(rosterById, activeGen);

  return (
    <div className="app-container">
      <Header
        selectedGameId={selectedGameId}
        onGameChange={handleGameChange}
        selectedVersionId={selectedVersionId}
        onVersionChange={handleVersionChange}
        spriteStyle={spriteStyle}
        onSpriteStyleChange={setSpriteStyle}
        onClearTeam={handleClearTeam}
        onRandomizeTeam={() => handleRandomizeTeam(filteredRoster)}
        teamCount={team.filter(Boolean).length}
      />


      <TeamBar
        team={resolvedTeam}
        activeSlotIndex={activeSlotIndex}
        highlightedSlots={highlightedSlots}
        activeGen={activeGen}
        onSlotSelect={setActiveSlotIndex}
        onRemoveMember={handleRemoveMember}
        onToggleShiny={handleToggleShiny}
        onNatureChange={handleNatureChange}
        onInspectMember={(m) => handleInspectPokemon(m.pokemon, m.selectedNature, m.slotIndex)}
        spriteStyle={spriteStyle}
      />

      <main className="main-content-layout">
        <CoverageMatrix
          team={resolvedTeam}
          typeChartData={typeChartData}
          activeGen={activeGen}
          onHighlightSlots={setHighlightedSlots}
        />



        <section className="roster-section">
          <FilterToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedType1={selectedType1}
            onType1Change={setSelectedType1}
            selectedType2={selectedType2}
            onType2Change={setSelectedType2}
            fullyEvolvedOnly={fullyEvolvedOnly}
            onFullyEvolvedToggle={setFullyEvolvedOnly}
            excludeTrades={excludeTrades}
            onExcludeTradesToggle={setExcludeTrades}
            includeLegendaries={includeLegendaries}
            onLegendariesToggle={setIncludeLegendaries}
            includeMythicals={includeMythicals}
            onMythicalsToggle={setIncludeMythicals}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            totalFilteredCount={filteredRoster.length}
            types={typeChartData?.types}
          />

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              Loading Pokémon roster data...
            </div>
          ) : (
            <PokemonGrid
              pokemonList={filteredRoster}
              onSelectPokemon={handleAddPokemonToTeam}
              onInspectPokemon={handleInspectPokemon}
              spriteStyle={spriteStyle}
            />
          )}
        </section>
      </main>

      <PokemonDetailModal
        pokemon={inspectedPokemon}
        selectedNature={inspectedNature}
        onClose={handleCloseInspector}
        onAddToTeam={handleAddPokemonToTeam}
        onNatureChange={(natureId) => {
          setInspectedNature(natureId);
          if (inspectedSlotIndex !== null) {
            handleNatureChange(inspectedSlotIndex, natureId);
          }
        }}
        spriteStyle={spriteStyle}
      />
    </div>
  );
}
