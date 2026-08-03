import React, { useState, useEffect, memo } from 'react';
import { GAME_DEXES, GAME_VERSIONS } from '../data/pokemonData';
import { getAvailableSpriteOptions } from '../utils/spriteUtils';
import { Share2, Trash2, Check, Shuffle } from 'lucide-react';
import { PokeballIcon } from './PokeballIcon';

interface HeaderProps {
  selectedGameId: string;
  onGameChange: (gameId: string) => void;
  selectedVersionId: string;
  onVersionChange: (versionId: string) => void;
  spriteStyle: string;
  onSpriteStyleChange: (style: string) => void;
  onClearTeam: () => void;
  onRandomizeTeam: () => void;
  teamCount: number;
}

export const Header: React.FC<HeaderProps> = memo(({
  selectedGameId,
  onGameChange,
  selectedVersionId,
  onVersionChange,
  spriteStyle,
  onSpriteStyleChange,
  onClearTeam,
  onRandomizeTeam,
  teamCount
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch (e) {
      console.error('Failed to copy link', e);
    }
  };

  const versionOptions = GAME_VERSIONS[selectedGameId] || GAME_VERSIONS['national'];
  const spriteOptions = getAvailableSpriteOptions(selectedGameId);

  return (
    <header className="app-header">
      <div className="logo-area">
        <div className="logo-icon">
          <PokeballIcon size={20} />
        </div>
        <div>
          <h1 className="brand-title">Pokémon Ultimate Team Planner</h1>
        </div>
      </div>

      <div className="header-controls">
        <div className="select-wrapper" title="Select Pokémon Generation / Dex">
          <span className="select-icon-label">Dex:</span>
          <select
            className="game-select"
            value={selectedGameId}
            onChange={(e) => onGameChange(e.target.value)}
            aria-label="Select Game Generation"
          >
            {GAME_DEXES.map((dex) => (
              <option key={dex.id} value={dex.id}>
                {dex.badge} - {dex.name}
              </option>
            ))}
          </select>
        </div>

        <div className="select-wrapper" title="Select Game Version (Catchable Availability)">
          <span className="select-icon-label">Version:</span>
          <select
            className="game-select"
            value={selectedVersionId}
            onChange={(e) => onVersionChange(e.target.value)}
            aria-label="Select Game Version"
          >
            {versionOptions.map((v) => (
              <option key={v.id} value={v.id}>
                {v.badge}
              </option>
            ))}
          </select>
        </div>

        <div className="select-wrapper" title="Select Sprite Appearance Style">
          <span className="select-icon-label">Sprites:</span>
          <select
            className="game-select"
            value={spriteStyle}
            onChange={(e) => onSpriteStyleChange(e.target.value)}
            aria-label="Select Sprite Style"
          >
            {spriteOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <button className="btn" onClick={onRandomizeTeam} title="Generate Random Team">
          <Shuffle size={16} />
          <span>Randomize</span>
        </button>

        <button className="btn" onClick={handleShare} title="Copy Shareable Team Link">
          {copied ? <Check size={16} color="#10b981" /> : <Share2 size={16} />}
          <span>{copied ? 'Copied!' : 'Share'}</span>
        </button>

        <button
          className="btn btn-danger"
          onClick={onClearTeam}
          disabled={teamCount === 0}
          title={teamCount > 0 ? "Clear All Team Members" : "No team members to clear"}
        >
          <Trash2 size={16} />
          <span>Clear</span>
        </button>
      </div>
    </header>
  );
});

Header.displayName = 'Header';
