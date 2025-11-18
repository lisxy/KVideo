import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = '', hover = true, onClick }: CardProps) {
  const hoverStyles = hover 
    ? "hover:translate-y-[-5px] hover:scale-[1.02] hover:shadow-[0_8px_24px_var(--shadow-color)] cursor-pointer transition-all duration-[var(--transition-fluid)]" 
    : "transition-all duration-[var(--transition-fluid)]";

  const baseClasses = `
    bg-[var(--glass-bg)]
    backdrop-blur-[25px]
    saturate-[180%]
    [-webkit-backdrop-filter:blur(25px)_saturate(180%)]
    rounded-[var(--radius-2xl)]
    shadow-[0_2px_8px_var(--shadow-color)] md:shadow-[var(--shadow-md)]
    border
    border-[var(--glass-border)]
    p-4 md:p-6
    relative
    ${hoverStyles}
    ${className}
  `;

  // Use semantic button when interactive
  if (onClick) {
    return (
      <button 
        type="button"
        onClick={onClick}
        className={`${baseClasses} text-left w-full`}
      >
        {children}
      </button>
    );
  }

  // Use div for non-interactive cards
  return (
    <div className={baseClasses}>
      {children}
    </div>
  );
}


