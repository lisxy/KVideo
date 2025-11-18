/**
 * SearchHistoryDropdown Component
 * Liquid Glass design system compliant dropdown for search history
 * Features: frosted glass effect, rounded-2xl corners, smooth animations
 */

'use client';

import { useEffect, useRef } from 'react';
import { Icons } from '@/components/ui/Icon';
import type { SearchHistoryItem } from '@/lib/store/search-history-store';

interface SearchHistoryDropdownProps {
  isOpen: boolean;
  searchHistory: SearchHistoryItem[];
  highlightedIndex: number;
  triggerRef: React.RefObject<HTMLInputElement | null>;
  onSelectItem: (query: string) => void;
  onRemoveItem: (query: string) => void;
  onClearAll: () => void;
}

export function SearchHistoryDropdown({
  isOpen,
  searchHistory,
  highlightedIndex,
  triggerRef,
  onSelectItem,
  onRemoveItem,
  onClearAll,
}: SearchHistoryDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Position dropdown below input field
  useEffect(() => {
    if (!isOpen || !triggerRef.current || !dropdownRef.current) return;

    const updatePosition = () => {
      if (!triggerRef.current || !dropdownRef.current) return;

      const inputRect = triggerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownMaxHeight = 400;
      const spaceBelow = viewportHeight - inputRect.bottom;

      // Position below input
      dropdownRef.current.style.top = `${inputRect.bottom + 8}px`;
      dropdownRef.current.style.left = `${inputRect.left}px`;
      dropdownRef.current.style.width = `${inputRect.width}px`;

      // Adjust max height if not enough space
      if (spaceBelow < dropdownMaxHeight) {
        dropdownRef.current.style.maxHeight = `${spaceBelow - 20}px`;
      } else {
        dropdownRef.current.style.maxHeight = `${dropdownMaxHeight}px`;
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, { passive: true });

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isOpen, triggerRef]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex === -1 || !dropdownRef.current) return;

    const highlightedElement = dropdownRef.current.querySelector(
      `[data-index="${highlightedIndex}"]`
    );

    if (highlightedElement) {
      highlightedElement.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [highlightedIndex]);

  if (!isOpen || searchHistory.length === 0) {
    return null;
  }

  return (
    <div
      ref={dropdownRef}
      className="search-history-dropdown"
      role="listbox"
      aria-label="搜索历史"
    >
      {/* Header with clear all button */}
      <div className="search-history-header">
        <div className="flex items-center gap-2">
          <Icons.Clock size={16} className="text-[var(--text-color-secondary)]" />
          <span className="text-sm font-medium text-[var(--text-color-secondary)]">
            搜索历史
          </span>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClearAll();
          }}
          className="text-xs text-[var(--accent-color)] hover:underline transition-all"
          aria-label="清除所有历史"
        >
          清除全部
        </button>
      </div>

      {/* Divider */}
      <div className="search-history-divider" />

      {/* History items */}
      <div className="search-history-list">
        {searchHistory.map((item, index) => (
          <div
            key={`${item.query}-${item.timestamp}`}
            data-index={index}
            role="option"
            aria-selected={index === highlightedIndex}
            className={`search-history-item ${
              index === highlightedIndex ? 'highlighted' : ''
            }`}
            onClick={() => onSelectItem(item.query)}
            onMouseEnter={() => {
              // Visual feedback on hover
            }}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Icons.Search
                size={16}
                className="flex-shrink-0 text-[var(--text-color-secondary)]"
              />
              <span className="text-[var(--text-color)] truncate flex-1">
                {item.query}
              </span>
              {item.resultCount !== undefined && (
                <span className="text-xs text-[var(--text-color-secondary)] flex-shrink-0">
                  {item.resultCount} 个结果
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveItem(item.query);
              }}
              className="search-history-remove"
              aria-label={`删除 "${item.query}"`}
            >
              <Icons.X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
