import React from 'react';

interface XPBarProps {
  xp: number;
  level: number;
  className?: string;
  showLabel?: boolean;
  compact?: boolean;
}

function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

function xpForCurrentLevel(totalXp: number, level: number): number {
  let accumulated = 0;
  for (let l = 1; l < level; l++) {
    accumulated += xpForLevel(l);
  }
  return totalXp - accumulated;
}

const XPBar: React.FC<XPBarProps> = ({
  xp,
  level,
  className = '',
  showLabel = true,
  compact = false,
}) => {
  const neededForNext = xpForLevel(level);
  const currentProgress = xpForCurrentLevel(xp, level);
  const percent = Math.min((currentProgress / neededForNext) * 100, 100);

  return (
    <div className={`space-y-1 ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs text-halloween-ghost-muted">
          <span className="font-cinzel text-halloween-orange font-semibold">Level {level}</span>
          <span>
            {currentProgress.toLocaleString()} / {neededForNext.toLocaleString()} XP
          </span>
        </div>
      )}
      <div
        className={`bg-halloween-darker rounded-full overflow-hidden ${compact ? 'h-1.5' : 'h-3'}`}
      >
        <div
          className="h-full bg-xp-bar rounded-full transition-all duration-700 ease-out shadow-halloween"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default XPBar;
