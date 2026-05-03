import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'white' | 'color' | 'none';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', variant = 'color' }) => {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Carga del Logo desde Public */}
      <div className={`${sizes[size]} shrink-0 transition-transform duration-300 hover:scale-110`}>
        <img 
          src="/logo.svg" 
          alt="TSegura" 
          className="w-full h-full object-contain drop-shadow-md"
        />
      </div>

      {/* Tipografía de la Marca */}
      {variant !== 'none' && (
        <span className={`font-black tracking-tighter transition-colors duration-300 ${
          size === 'xs' ? 'text-lg' : 
          size === 'sm' ? 'text-xl' : 
          size === 'md' ? 'text-3xl' : 'text-5xl'
        } ${variant === 'white' ? 'text-white' : 'text-gray-900'}`}>
          TSegura<span className={variant === 'white' ? 'text-amber-400' : 'text-[#1E5ADF]'}>.</span>
        </span>
      )}
    </div>
  );
};
