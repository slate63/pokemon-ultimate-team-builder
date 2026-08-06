import React, { memo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { HALL_OF_FAME_DATA, HallOfFameGame, HallOfFameTeam } from '../data/hallOfFameData';
import { Pokemon } from '../types';
import { VERSION_TO_SPRITE_STYLE } from '../utils/spriteUtils';

interface HallOfFameProps {
  onBack: () => void;
  rosterById: Map<number, Pokemon>;
}

function buildSpritePath(id: number, name: string, gameId: string): string {
  const paddedId = id < 1000 ? String(id).padStart(3, '0') : String(id);
  const dirName = `${paddedId}-${name.toLowerCase().replace(/ /g, '-')}`;
  const spriteStyle = VERSION_TO_SPRITE_STYLE[gameId] || 'standard';
  return `./data/pokemon/${dirName}/sprites/${spriteStyle}/front_default.png`;
}

function TeamRow({ team, gameId, rosterById }: { team: HallOfFameTeam; gameId: string; rosterById: Map<number, Pokemon> }) {
  const medalColors = ['#fbbf24', '#c0c0c0', '#cd7f32'];
  const medal = team.rank <= 3 ? medalColors[team.rank - 1] : undefined;

  return (
    <div className="hof-team-row">
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
    </div>
  );
}

function GameSection({ game, rosterById }: { game: HallOfFameGame; rosterById: Map<number, Pokemon> }) {
  return (
    <div className="hof-game-section">
      <h2 className="hof-game-title">{game.badge} {game.name}</h2>
      <div className="hof-teams-list">
        {game.teams.map((team) => (
          <TeamRow key={team.rank} team={team} gameId={game.gameId} rosterById={rosterById} />
        ))}
      </div>
    </div>
  );
}

export const HallOfFame: React.FC<HallOfFameProps> = memo(({ onBack, rosterById }) => {
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
          {HALL_OF_FAME_DATA.map((game) => (
            <GameSection key={game.gameId} game={game} rosterById={rosterById} />
          ))}
        </div>
      )}
    </div>
  );
});

HallOfFame.displayName = 'HallOfFame';
