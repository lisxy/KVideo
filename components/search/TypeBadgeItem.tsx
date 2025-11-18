/**
 * TypeBadgeItem - Individual badge component
 * Displays a single type badge with count, supports selection state
 */

interface TypeBadgeItemProps {
  type: string;
  count: number;
  isSelected: boolean;
  onToggle: () => void;
}

export function TypeBadgeItem({ type, count, isSelected, onToggle }: TypeBadgeItemProps) {
  return (
    <button
      onClick={onToggle}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 
        border border-[var(--glass-border)]
        text-xs font-medium whitespace-nowrap
        transition-all duration-[var(--transition-fluid)]
        hover:scale-105 hover:shadow-[var(--shadow-sm)]
        active:scale-95 snap-start
        ${isSelected 
          ? 'bg-[var(--accent-color)] text-white border-[var(--accent-color)]' 
          : 'bg-[var(--glass-bg)] text-[var(--text-color)] backdrop-blur-[10px]'
        }
      `}
      style={{ borderRadius: 'var(--radius-full)' }}
    >
      <span>{type}</span>
      <span className={`
        px-1.5 py-0.5 rounded-full text-[10px] font-semibold
        ${isSelected 
          ? 'bg-white/20 text-white' 
          : 'bg-[var(--accent-color)]/10 text-[var(--accent-color)]'
        }
      `}>
        {count}
      </span>
    </button>
  );
}
