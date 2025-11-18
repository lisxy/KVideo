'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Icons } from '@/components/ui/Icon';

interface TypeBadge {
  type: string;
  count: number;
}

interface TypeBadgesProps {
  badges: TypeBadge[];
  selectedTypes: Set<string>;
  onToggleType: (type: string) => void;
  className?: string;
}

/**
 * TypeBadges - Displays collected type badges from search results
 * Auto-collects unique type_name values and shows counts
 * Badges disappear when all videos of that type are removed
 * Responsive: Desktop shows expand/collapse, Mobile shows horizontal scroll
 */
export function TypeBadges({ 
  badges, 
  selectedTypes,
  onToggleType,
  className = '' 
}: TypeBadgesProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (badges.length === 0) {
    return null;
  }

  return (
    <Card 
      hover={false} 
      className={`p-4 animate-fade-in ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-2 shrink-0 pt-1">
          <Icons.Tag size={16} className="text-[var(--accent-color)]" />
          <span className="text-sm font-semibold text-[var(--text-color)]">
            分类标签 ({badges.length}):
          </span>
        </div>
        
        {/* Desktop: Expandable Grid */}
        <div className="hidden md:flex md:flex-col md:flex-1">
          <div className={`flex items-center gap-2 flex-wrap transition-all duration-300 ${
            !isExpanded ? 'max-h-[2.5rem] overflow-hidden' : ''
          }`}>
            {badges.map((badge) => {
              const isSelected = selectedTypes.has(badge.type);
              
              return (
                <button
                  key={badge.type}
                  onClick={() => onToggleType(badge.type)}
                  className={`
                    inline-flex items-center gap-1.5 px-3 py-1.5 
                    border border-[var(--glass-border)]
                    text-xs font-medium
                    transition-all duration-[var(--transition-fluid)]
                    hover:scale-105 hover:shadow-[var(--shadow-sm)]
                    active:scale-95
                    ${isSelected 
                      ? 'bg-[var(--accent-color)] text-white border-[var(--accent-color)]' 
                      : 'bg-[var(--glass-bg)] text-[var(--text-color)] backdrop-blur-[10px]'
                    }
                  `}
                  style={{ borderRadius: 'var(--radius-full)' }}
                >
                  <span>{badge.type}</span>
                  <span className={`
                    px-1.5 py-0.5 rounded-full text-[10px] font-semibold
                    ${isSelected 
                      ? 'bg-white/20 text-white' 
                      : 'bg-[var(--accent-color)]/10 text-[var(--accent-color)]'
                    }
                  `}>
                    {badge.count}
                  </span>
                </button>
              );
            })}
          </div>
          
          {badges.length > 5 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-xs text-[var(--text-color-secondary)] hover:text-[var(--accent-color)] 
                       flex items-center gap-1 transition-colors self-start"
            >
              <span>{isExpanded ? '收起' : '展开更多'}</span>
              <Icons.ChevronDown 
                size={14} 
                className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              />
            </button>
          )}
        </div>

        {/* Mobile & Tablet: Horizontal Scroll */}
        <div className="flex md:hidden flex-1 overflow-hidden">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
            {badges.map((badge) => {
              const isSelected = selectedTypes.has(badge.type);
              
              return (
                <button
                  key={badge.type}
                  onClick={() => onToggleType(badge.type)}
                  className={`
                    inline-flex items-center gap-1.5 px-3 py-1.5 
                    border border-[var(--glass-border)]
                    text-xs font-medium whitespace-nowrap
                    transition-all duration-[var(--transition-fluid)]
                    active:scale-95 snap-start
                    ${isSelected 
                      ? 'bg-[var(--accent-color)] text-white border-[var(--accent-color)]' 
                      : 'bg-[var(--glass-bg)] text-[var(--text-color)] backdrop-blur-[10px]'
                    }
                  `}
                  style={{ borderRadius: 'var(--radius-full)' }}
                >
                  <span>{badge.type}</span>
                  <span className={`
                    px-1.5 py-0.5 rounded-full text-[10px] font-semibold
                    ${isSelected 
                      ? 'bg-white/20 text-white' 
                      : 'bg-[var(--accent-color)]/10 text-[var(--accent-color)]'
                    }
                  `}>
                    {badge.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      {selectedTypes.size > 0 && (
        <div className="mt-3 pt-3 border-t border-[var(--glass-border)]">
          <button
            onClick={() => selectedTypes.forEach(type => onToggleType(type))}
            className="text-xs text-[var(--text-color-secondary)] hover:text-[var(--accent-color)] 
                     flex items-center gap-1 transition-colors"
          >
            <Icons.X size={12} />
            清除筛选 ({selectedTypes.size})
          </button>
        </div>
      )}
    </Card>
  );
}
