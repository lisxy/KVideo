/**
 * TypeBadgeList - Badge list container with responsive layout
 * Desktop: Expandable grid with show more/less
 * Mobile: Horizontal scroll with snap
 */

'use client';

import { useState } from 'react';
import { Icons } from '@/components/ui/Icon';
import { TypeBadgeItem } from './TypeBadgeItem';

interface TypeBadge {
  type: string;
  count: number;
}

interface TypeBadgeListProps {
  badges: TypeBadge[];
  selectedTypes: Set<string>;
  onToggleType: (type: string) => void;
}

export function TypeBadgeList({ badges, selectedTypes, onToggleType }: TypeBadgeListProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Desktop: Expandable Grid */}
      <div className="hidden md:flex md:flex-col md:flex-1">
        <div className={`flex items-center gap-2 flex-wrap transition-all duration-300 ${
          !isExpanded ? 'max-h-[2.5rem] overflow-hidden' : ''
        }`}>
          {badges.map((badge) => (
            <TypeBadgeItem
              key={badge.type}
              type={badge.type}
              count={badge.count}
              isSelected={selectedTypes.has(badge.type)}
              onToggle={() => onToggleType(badge.type)}
            />
          ))}
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
          {badges.map((badge) => (
            <TypeBadgeItem
              key={badge.type}
              type={badge.type}
              count={badge.count}
              isSelected={selectedTypes.has(badge.type)}
              onToggle={() => onToggleType(badge.type)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
