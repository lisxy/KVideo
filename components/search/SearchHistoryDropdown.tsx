/**
 * Search History Dropdown Component
 * 搜索历史下拉组件
 */

'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchHistoryStore } from '@/lib/store/search-history-store';
import { Icons } from '@/components/ui/Icon';

interface SearchHistoryDropdownProps {
  isVisible: boolean;
  onSelect: (query: string) => void;
  onClose: () => void;
  inputRect: DOMRect | null;
}

export function SearchHistoryDropdown({
  isVisible,
  onSelect,
  onClose,
  inputRect,
}: SearchHistoryDropdownProps) {
  const { searchHistory, removeSearchHistory, clearSearchHistory } = useSearchHistoryStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  if (!isVisible || searchHistory.length === 0) return null;

  const style = inputRect
    ? {
        position: 'fixed' as const,
        top: `${inputRect.bottom + 8}px`,
        left: `${inputRect.left}px`,
        width: `${inputRect.width}px`,
      }
    : {};

  const handleItemClick = (query: string, event: React.MouseEvent) => {
    // Check if middle mouse button (opens in new tab)
    if (event.button === 1 || event.ctrlKey || event.metaKey) {
      event.preventDefault();
      window.open(`/?q=${encodeURIComponent(query)}`, '_blank');
      return;
    }
    onSelect(query);
  };

  return (
    <div
      ref={dropdownRef}
      id="search-history-listbox"
      role="listbox"
      aria-label="搜索历史建议"
      style={style}
      className="z-[9999] bg-[var(--glass-bg)] backdrop-blur-[25px] saturate-[180%] rounded-[var(--radius-2xl)] shadow-[var(--shadow-md)] border border-[var(--glass-border)] p-2 opacity-0 animate-[slideIn_0.2s_ease-out_forwards]"
    >
      <div className="flex items-center justify-between px-3 py-2 mb-1">
        <span className="text-sm font-medium text-[var(--text-color-secondary)]">
          搜索历史
        </span>
        <button
          onClick={clearSearchHistory}
          className="text-xs text-[var(--text-color-secondary)] hover:text-[var(--accent-color)] transition-colors"
        >
          清空
        </button>
      </div>

      <div className="max-h-[300px] overflow-y-auto space-y-1">
        {searchHistory.map((item) => (
          <div
            key={item.timestamp}
            role="option"
            aria-selected="false"
            className="group flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-2xl)] hover:bg-[color-mix(in_srgb,var(--accent-color)_15%,transparent)] transition-all cursor-pointer"
          >
            <Icons.Clock 
              size={16} 
              className="text-[var(--text-color-secondary)] flex-shrink-0" 
            />
            <a
              href={`/?q=${encodeURIComponent(item.query)}`}
              onClick={(e) => {
                e.preventDefault();
                handleItemClick(item.query, e as any);
              }}
              onAuxClick={(e) => handleItemClick(item.query, e as any)}
              className="flex-1 text-sm text-[var(--text-color)] hover:text-[var(--accent-color)] transition-colors truncate"
              title={item.query}
            >
              {item.query}
            </a>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeSearchHistory(item.query);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[var(--glass-bg)] rounded-full"
              aria-label="删除"
            >
              <Icons.X size={14} className="text-[var(--text-color-secondary)]" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
