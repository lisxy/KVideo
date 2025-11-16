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

  return (
    <div 
      onClick={onClick}
      className={`
        bg-[var(--glass-bg)]
        backdrop-blur-[25px]
        saturate-[180%]
        [-webkit-backdrop-filter:blur(25px)_saturate(180%)]
        rounded-[var(--radius-2xl)]
        shadow-[var(--shadow-md)]
        border
        border-[var(--glass-border)]
        p-6
        relative
        ${hoverStyles}
        ${className}
      `}
    >
      {children}
    </div>
  );
}


