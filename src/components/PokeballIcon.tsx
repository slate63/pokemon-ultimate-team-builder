import React, { useState, memo } from 'react';

const BALL_NAMES = ['pokeball', 'great-ball', 'ultra-ball', 'master-ball', 'safari-ball'];

interface PokeballIconProps {
  size?: number;
}

export const PokeballIcon: React.FC<PokeballIconProps> = memo(({ size = 20 }) => {
  const [ballName] = useState(() => BALL_NAMES[Math.floor(Math.random() * BALL_NAMES.length)]);

  const baseUrl = import.meta.env.BASE_URL || './';
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const ballUrl = `${cleanBaseUrl}${ballName}.svg`;

  return (
    <img
      src={ballUrl}
      width={size}
      height={size}
      alt="Pokéball Icon"
      style={{ display: 'block' }}
    />
  );
});

PokeballIcon.displayName = 'PokeballIcon';