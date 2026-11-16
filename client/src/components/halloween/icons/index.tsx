import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const PumpkinIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 3C11 3 10 4 10 5H14C14 4 13 3 12 3Z" fill="currentColor" />
    <ellipse cx="12" cy="14" rx="8" ry="7" fill="currentColor" opacity="0.9" />
    <path d="M8 12L10 11L9 14Z" fill="#0D0D1A" />
    <path d="M16 12L14 11L15 14Z" fill="#0D0D1A" />
    <path d="M10 16Q12 18 14 16" stroke="#0D0D1A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <line x1="12" y1="5" x2="12" y2="7" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const GhostIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C7.58 2 4 5.58 4 10V20L7 18L10 20L12 18L14 20L17 18L20 20V10C20 5.58 16.42 2 12 2Z"
      fill="currentColor"
      opacity="0.9"
    />
    <circle cx="9" cy="11" r="1.5" fill="#0D0D1A" />
    <circle cx="15" cy="11" r="1.5" fill="#0D0D1A" />
  </svg>
);

export const BatIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 10C2 10 5 8 7 10C8 11 8 12 7 13C5 14 2 13 2 13L4 11Z"
      fill="currentColor"
    />
    <path
      d="M22 10C22 10 19 8 17 10C16 11 16 12 17 13C19 14 22 13 22 13L20 11Z"
      fill="currentColor"
    />
    <ellipse cx="12" cy="12" rx="4" ry="3" fill="currentColor" />
    <path d="M10 10C10 10 11 8 12 8C13 8 14 10 14 10" stroke="currentColor" strokeWidth="1" fill="none" />
  </svg>
);

export const SkullIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse cx="12" cy="10" rx="7" ry="7" fill="currentColor" opacity="0.9" />
    <rect x="8" y="17" width="2.5" height="3" rx="0.5" fill="currentColor" />
    <rect x="11" y="17" width="2" height="3" rx="0.5" fill="currentColor" />
    <rect x="13.5" y="17" width="2.5" height="3" rx="0.5" fill="currentColor" />
    <circle cx="9.5" cy="10" r="2" fill="#0D0D1A" />
    <circle cx="14.5" cy="10" r="2" fill="#0D0D1A" />
    <path d="M10 14H14" stroke="#0D0D1A" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

export const StarIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2L14.4 9.2H22L16 13.6L18.4 20.8L12 16.4L5.6 20.8L8 13.6L2 9.2H9.6L12 2Z" />
  </svg>
);

export const CoinIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="9" fill="currentColor" />
    <circle cx="12" cy="12" r="7" fill="currentColor" opacity="0.6" />
    <text x="12" y="16" textAnchor="middle" fill="#0D0D1A" fontSize="8" fontWeight="bold">G</text>
  </svg>
);

export const FlameIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C12 2 8 7 8 12C8 14.5 9.5 16.5 12 17C14.5 16.5 16 14.5 16 12C16 10 14.5 8 14.5 8C14.5 8 14 10 12 10C10 10 10 7 12 2Z"
      fill="currentColor"
    />
    <path
      d="M12 13C11 13 10.5 14 10.5 15C10.5 16.4 11.2 17 12 17C12.8 17 13.5 16.4 13.5 15C13.5 14 13 13 12 13Z"
      fill="currentColor"
      opacity="0.7"
    />
  </svg>
);
