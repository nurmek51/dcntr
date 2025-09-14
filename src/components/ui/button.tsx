import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  type = 'button'
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-black text-white hover:bg-gray-800 focus:ring-gray-500 shadow-[3px_4px_4px_rgba(0,0,0,0.2)] hover:shadow-[4px_5px_5px_rgba(0,0,0,0.3)]',
    secondary: 'bg-gray-200 text-black hover:bg-gray-300 focus:ring-gray-400 shadow-[2px_3px_3px_rgba(0,0,0,0.1)] hover:shadow-[3px_4px_4px_rgba(0,0,0,0.15)]',
    outline: 'bg-white text-black border-2 border-gray-200 hover:border-black hover:bg-gray-50 focus:ring-gray-400 shadow-[2px_3px_3px_rgba(0,0,0,0.1)]',
    ghost: 'bg-transparent text-[#858898] hover:text-black hover:bg-gray-50 focus:ring-gray-400'
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-[14px] rounded-[8px]',
    md: 'px-6 py-3 text-[16px] rounded-[12px]',
    lg: 'px-8 py-4 text-[18px] rounded-[12px]'
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
      whileHover={disabled || loading ? {} : { scale: 1.02, y: -2 }}
      whileTap={disabled || loading ? {} : { scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      )}
      {children}
    </motion.button>
  );
};

export default Button;
