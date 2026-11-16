import React, { useMemo } from 'react';

interface Particle {
  id: number;
  left: string;
  animationDuration: string;
  animationDelay: string;
  size: string;
  opacity: string;
}

interface SpookyBackgroundProps {
  particleCount?: number;
  showBats?: boolean;
  className?: string;
}

const SpookyBackground: React.FC<SpookyBackgroundProps> = ({
  particleCount = 15,
  showBats = true,
  className = '',
}) => {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      left: `${(i * 7 + 3) % 100}%`,
      animationDuration: `${6 + (i % 5) * 2}s`,
      animationDelay: `${(i * 0.8) % 8}s`,
      size: `${3 + (i % 4)}px`,
      opacity: `${0.3 + (i % 4) * 0.15}`,
    }));
  }, [particleCount]);

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}>
      {/* Base gradient */}
      <div className="absolute inset-0 bg-halloween-gradient" />

      {/* Radial glow spots */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-halloween-purple/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-halloween-orange/5 blur-3xl" />
      <div className="absolute top-3/4 left-1/2 w-64 h-64 rounded-full bg-halloween-purple-light/5 blur-3xl" />

      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-halloween-orange/40 animate-particle-float"
          style={{
            left: p.left,
            bottom: '-10px',
            width: p.size,
            height: p.size,
            animationDuration: p.animationDuration,
            animationDelay: p.animationDelay,
            opacity: p.opacity,
          }}
        />
      ))}

      {/* Bats */}
      {showBats && (
        <>
          <div
            className="absolute text-halloween-ghost-dim animate-bat-fly"
            style={{ top: '15%', animationDelay: '0s', animationDuration: '12s', fontSize: '12px' }}
          >
            🦇
          </div>
          <div
            className="absolute text-halloween-ghost-dim animate-bat-fly"
            style={{ top: '30%', animationDelay: '5s', animationDuration: '15s', fontSize: '10px' }}
          >
            🦇
          </div>
          <div
            className="absolute text-halloween-ghost-dim animate-bat-fly"
            style={{ top: '8%', animationDelay: '9s', animationDuration: '10s', fontSize: '8px' }}
          >
            🦇
          </div>
        </>
      )}

      {/* Moon */}
      <div className="absolute top-8 right-12 w-16 h-16 rounded-full bg-halloween-amber/80 shadow-[0_0_40px_rgba(255,165,0,0.4)] animate-pulse-glow" style={{ animationDuration: '4s' }} />

      {/* Stars */}
      {[...Array(20)].map((_, i) => (
        <div
          key={`star-${i}`}
          className="absolute rounded-full bg-white animate-flicker"
          style={{
            left: `${(i * 13 + 7) % 95}%`,
            top: `${(i * 11 + 5) % 40}%`,
            width: `${1 + (i % 2)}px`,
            height: `${1 + (i % 2)}px`,
            animationDelay: `${(i * 0.4) % 3}s`,
            animationDuration: `${2 + (i % 3)}s`,
          }}
        />
      ))}
    </div>
  );
};

export default SpookyBackground;
