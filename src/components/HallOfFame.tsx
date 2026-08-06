import React, { memo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { HALL_OF_FAME_DATA, HallOfFameGame, HallOfFameTeam } from '../data/hallOfFameData';

interface HallOfFameProps {
  onBack: () => void;
}

function TeamRow({ team, gameId }: { team: HallOfFameTeam; gameId: string }) {
  const medalColors = ['#fbbf24', '#c0c0c0', '#cd7f32'];
  const medal = team.rank <= 3 ? medalColors[team.rank - 1] : undefined;

  return (
    <div className="hof-team-row">
      <div className="hof-rank" style={medal ? { color: medal } : undefined}>
        #{team.rank}
      </div>
      <div className="hof-team-sprites">
        {team.pokemon.map((id, i) => (
          <img
            key={`${gameId}-${team.rank}-${i}`}
            className="hof-sprite"
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
            alt={`Pokemon #${id}`}
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
}

function GameSection({ game }: { game: HallOfFameGame }) {
  return (
    <div className="hof-game-section">
      <h2 className="hof-game-title">{game.badge} {game.name}</h2>
      <div className="hof-teams-list">
        {game.teams.map((team) => (
          <TeamRow key={team.rank} team={team} gameId={game.gameId} />
        ))}
      </div>
    </div>
  );
}

export const HallOfFame: React.FC<HallOfFameProps> = memo(({ onBack }) => {
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
            <GameSection key={game.gameId} game={game} />
          ))}
        </div>
      )}
    </div>
  );
});

HallOfFame.displayName = 'HallOfFame';
