import React, { useState, memo } from 'react';

const BALL_SVGS: Record<string, React.ReactElement> = {
  pokeball: (
    <g clipPath="url(#header-ball-clip)">
      <circle cx="50" cy="50" r="50" fill="#F5F5F5" />
      <path d="M 0 50 A 50 50 0 0 1 100 50 Z" fill="#EE0000" />
      <rect x="0" y="44" width="100" height="12" fill="black" />
      <circle cx="50" cy="50" r="14" fill="#F5F5F5" stroke="black" strokeWidth="4" />
      <circle cx="50" cy="50" r="6" fill="black" />
    </g>
  ),
  greatball: (
    <g clipPath="url(#header-ball-clip)">
      <circle cx="50" cy="50" r="50" fill="#F5F5F5" />
      <path d="M 0 50 A 50 50 0 0 1 100 50 Z" fill="#0B5ED7" />
      <path d="M 12 18 L 18 12 L 27 21 L 21 27 Z" fill="#DC3545" />
      <path d="M 88 18 L 82 12 L 73 21 L 79 27 Z" fill="#DC3545" />
      <rect x="0" y="44" width="100" height="12" fill="black" />
      <circle cx="50" cy="50" r="14" fill="#F5F5F5" stroke="black" strokeWidth="4" />
      <circle cx="50" cy="50" r="6" fill="black" />
    </g>
  ),
  ultraball: (
    <g clipPath="url(#header-ball-clip)">
      <circle cx="50" cy="50" r="50" fill="#F5F5F5" />
      <path d="M 0 50 A 50 50 0 0 1 100 50 Z" fill="#1A1A1A" />
      <rect x="13.32" y="4" width="15.36" height="46" fill="#FFD700" />
      <rect x="71.32" y="4" width="15.36" height="46" fill="#FFD700" />
      <rect x="0" y="44" width="100" height="12" fill="black" />
      <circle cx="50" cy="50" r="14" fill="#F5F5F5" stroke="black" strokeWidth="4" />
      <circle cx="50" cy="50" r="6" fill="black" />
    </g>
  ),
  masterball: (
    <g clipPath="url(#header-ball-clip)">
      <circle cx="50" cy="50" r="50" fill="#F5F5F5" />
      <path d="M 0 50 A 50 50 0 0 1 100 50 Z" fill="#7E22CE" />
      <circle cx="15" cy="15" r="8.4" fill="#EC4899" />
      <circle cx="85" cy="15" r="8.4" fill="#EC4899" />
      <path d="M 38 40 L 38 18 L 50 32 L 62 18 L 62 40" fill="none" stroke="#FFFFFF" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
      <rect x="0" y="44" width="100" height="12" fill="black" />
      <circle cx="50" cy="50" r="14" fill="#F5F5F5" stroke="black" strokeWidth="4" />
      <circle cx="50" cy="50" r="6" fill="black" />
    </g>
  ),
};

const BALL_NAMES = Object.keys(BALL_SVGS);

interface PokeballIconProps {
  size?: number;
}

export const PokeballIcon: React.FC<PokeballIconProps> = memo(({ size = 20 }) => {
  const [ballName] = useState(() => BALL_NAMES[Math.floor(Math.random() * BALL_NAMES.length)]);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="header-ball-clip">
          <circle cx="50" cy="50" r="50" />
        </clipPath>
      </defs>
      {BALL_SVGS[ballName]}
      <circle cx="50" cy="50" r="49" fill="none" stroke="black" strokeWidth="2" />
    </svg>
  );
});

PokeballIcon.displayName = 'PokeballIcon';