import React from 'react';
import { CoinIcon } from '../halloween/icons';

interface CoinDisplayProps {
  coins: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const CoinDisplay: React.FC<CoinDisplayProps> = ({ coins, className = '', size = 'md' }) => {
  const textSize = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base';
  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 22 : 18;

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <CoinIcon size={iconSize} className="text-halloween-amber" />
      <span className={`font-semibold text-halloween-amber ${textSize}`}>
        {coins.toLocaleString()}
      </span>
    </div>
  );
};

export default CoinDisplay;
