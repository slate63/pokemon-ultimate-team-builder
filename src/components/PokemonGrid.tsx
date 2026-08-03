import React, { memo } from 'react';
import { ResolvedPokemon } from '../types';
import { getPokemonSprite } from '../data/pokemonData';
import { getPokemonSprite as getPokemonRetroSprite } from '../utils/spriteUtils';

interface PokemonCardProps {
  pokemon: ResolvedPokemon;
  spriteStyle: string;
  onSelectPokemon: (pokemon: ResolvedPokemon) => void;
  onInspectPokemon: (pokemon: ResolvedPokemon) => void;
}

const PokemonCard: React.FC<PokemonCardProps> = memo(({
  pokemon,
  spriteStyle,
  onSelectPokemon,
  onInspectPokemon,
}) => {
  const spriteUrl = getPokemonRetroSprite(pokemon, spriteStyle, false, false);

  return (
    <div
      className="pokemon-card"
      onClick={() => onSelectPokemon(pokemon)}
      onContextMenu={(e) => {
        e.preventDefault();
        onInspectPokemon(pokemon);
      }}
      title="Left Click to Add to Team | Right Click to Inspect Stats"
    >
      <span className="card-dex-num">#{String(pokemon.id).padStart(3, '0')}</span>

      <img
        src={spriteUrl}
        alt={pokemon.name}
        className="card-sprite"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).src = getPokemonSprite(pokemon.id, false);
        }}
      />

      <div className="card-name">{pokemon.name}</div>

      <div className="type-badges-row">
        {pokemon.types.map((type) => {
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

PokemonCard.displayName = 'PokemonCard';

interface PokemonGridProps {
  pokemonList: ResolvedPokemon[];
  onSelectPokemon: (pokemon: ResolvedPokemon) => void;
  onInspectPokemon: (pokemon: ResolvedPokemon) => void;
  spriteStyle: string;
}

export const PokemonGrid: React.FC<PokemonGridProps> = memo(({
  pokemonList,
  onSelectPokemon,
  onInspectPokemon,
  spriteStyle,
}) => {
  if (pokemonList.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-dim)' }}>
        <p>No Pokémon found matching your search and filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="pokemon-grid">
      {pokemonList.map((pokemon) => (
        <PokemonCard
          key={pokemon.id}
          pokemon={pokemon}
          spriteStyle={spriteStyle}
          onSelectPokemon={onSelectPokemon}
          onInspectPokemon={onInspectPokemon}
        />
      ))}
    </div>
  );
});

PokemonGrid.displayName = 'PokemonGrid';
