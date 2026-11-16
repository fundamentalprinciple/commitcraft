import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'hover' | 'glow';
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', variant = 'default', onClick }) => {
  const variantClass =
    variant === 'hover' ? 'card-hover' : variant === 'glow' ? 'card-glow' : 'card';

  return (
    <div className={`${variantClass} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
