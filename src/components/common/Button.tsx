import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
}) => {
  const getBaseClasses = () => {
    const base = 'font-bold rounded-lg shadow-md transform transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const sizeClasses = {
      small: 'py-2 px-4 text-sm',
      medium: 'py-3 px-6 text-base',
      large: 'py-4 px-8 text-lg',
    };

    const variantClasses = {
      primary: 'bg-primary hover:bg-primary-dark text-white focus:ring-primary',
      secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400',
      success: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-400',
      warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-400',
      danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-400',
    };

    return `${base} ${sizeClasses[size]} ${variantClasses[variant]}`;
  };

  const getInteractionClasses = () => {
    if (disabled || loading) {
      return 'opacity-50 cursor-not-allowed transform-none';
    }
    return 'hover:scale-105 active:scale-95';
  };

  const classes = `${getBaseClasses()} ${getInteractionClasses()} ${className}`;

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && (
        <span className="mr-2">
          <svg className="animate-spin h-4 w-4 inline" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </span>
      )}
      {children}
    </button>
  );
};

export default Button;