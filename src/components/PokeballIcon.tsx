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
      <path d="M 0 50 A 50 50 0 0 1 100 50 Z" fill="#0075FF" />
      <rect x="-7" y="-12" width="14" height="24" rx="4" fill="#EE0000" transform="translate(18, 18) rotate(-45)" />
      <rect x="-7" y="-12" width="14" height="24" rx="4" fill="#EE0000" transform="translate(82, 18) rotate(45)" />
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
  safariball: (
    <g clipPath="url(#header-ball-clip)">
      <circle cx="50" cy="50" r="50" fill="#F5F5F5" />
      <path d="M 0 50 A 50 50 0 0 1 100 50 Z" fill="#4A7C38" />
      <path d="M 8 30 C 12 15, 30 10, 38 22 C 44 32, 28 42, 18 38 C 10 35, 5 38, 8 30 Z" fill="#1B3D14" />
      <path d="M 62 10 C 78 6, 88 18, 84 30 C 78 40, 60 36, 54 26 C 50 18, 52 12, 62 10 Z" fill="#1B3D14" />
      <path d="M 34 26 C 44 20, 56 26, 54 36 C 52 46, 36 48, 30 40 C 26 34, 28 28, 34 26 Z" fill="#1B3D14" />
      <path d="M 40 4 C 54 2, 64 12, 58 20 C 52 26, 38 22, 36 14 C 34 8, 34 4, 40 4 Z" fill="#7D8D44" />
      <path d="M 0 42 C 6 32, 22 34, 22 44 C 22 48, 14 50, 0 50 Z" fill="#7D8D44" />
      <path d="M 74 30 C 86 24, 98 32, 98 42 C 98 48, 84 50, 72 46 C 68 40, 68 34, 74 30 Z" fill="#7D8D44" />
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