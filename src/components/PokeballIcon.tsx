import React, { useState, memo } from 'react';

const BALL_NAMES = ['pokeball', 'great-ball', 'ultra-ball', 'master-ball', 'safari-ball'];

interface PokeballIconProps {
  size?: number;
}

export const PokeballIcon: React.FC<PokeballIconProps> = memo(({ size = 20 }) => {
  const [ballName] = useState(() => BALL_NAMES[Math.floor(Math.random() * BALL_NAMES.length)]);

  return (
    <img
      src={`/${ballName}.svg`}
      width={size}
      height={size}
      alt="Pokéball Icon"
      style={{ display: 'block' }}
    />
  );
});

PokeballIcon.displayName = 'PokeballIcon';