import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'small' | 'medium' | 'large';
  hover?: boolean;
  shadow?: 'none' | 'small' | 'medium' | 'large';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'medium',
  hover = false,
  shadow = 'medium',
}) => {
  const getPaddingClasses = () => {
    const paddingClasses = {
      none: '',
      small: 'p-3',
      medium: 'p-4',
      large: 'p-6',
    };
    return paddingClasses[padding];
  };

  const getShadowClasses = () => {
    const shadowClasses = {
      none: '',
      small: 'shadow-sm',
      medium: 'shadow-md',
      large: 'shadow-lg',
    };
    return shadowClasses[shadow];
  };

  const classes = `
    bg-white rounded-lg border border-gray-200 
    ${getPaddingClasses()} 
    ${getShadowClasses()} 
    ${hover ? 'hover:shadow-lg transition-shadow duration-200' : ''}
    ${className}
  `;

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

export default Card;