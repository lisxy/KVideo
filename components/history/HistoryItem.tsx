/**
 * HistoryItem - Individual watch history item
 * Displays video thumbnail, title, episode, progress, and delete button
 */

import Image from 'next/image';
import { Icons } from '@/components/ui/Icon';

interface HistoryItemProps {
  videoId: string | number;
  source: string;
  title: string;
  poster?: string;
  episodeIndex: number;
  episodes?: Array<{ name: string }>;
  playbackPosition: number;
  duration: number;
  timestamp: number;
  onRemove: () => void;
}

export function HistoryItem({
  videoId,
  source,
  title,
  poster,
  episodeIndex,
  episodes,
  playbackPosition,
  duration,
  timestamp,
  onRemove,
}: HistoryItemProps) {
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (ts: number): string => {
    const date = new Date(ts);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return '今天';
    if (days === 1) return '昨天';
    if (days < 7) return `${days}天前`;

    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  };

  const getVideoUrl = (): string => {
    const params = new URLSearchParams({
      id: videoId.toString(),
      source,
      title,
      episode: episodeIndex.toString(),
    });
    return `/player?${params.toString()}`;
  };

  const handleClick = (event: React.MouseEvent) => {
    // Middle mouse or Ctrl/Cmd+click opens in new tab
    if (event.button === 1 || event.ctrlKey || event.metaKey) {
      event.preventDefault();
      window.open(getVideoUrl(), '_blank');
      return;
    }
  };

  const progress = (playbackPosition / duration) * 100;
  const episodeText = episodes && episodes.length > 0
    ? episodes[episodeIndex]?.name || `第${episodeIndex + 1}集`
    : '';

  return (
    <div className="group bg-[color-mix(in_srgb,var(--glass-bg)_50%,transparent)] rounded-[var(--radius-2xl)] p-3 hover:bg-[color-mix(in_srgb,var(--accent-color)_10%,transparent)] transition-all border border-transparent hover:border-[var(--glass-border)]">
      <a
        href={getVideoUrl()}
        onClick={(e) => {
          e.preventDefault();
          handleClick(e as any);
          if (!e.ctrlKey && !e.metaKey) {
            window.location.href = getVideoUrl();
          }
        }}
        onAuxClick={(e) => handleClick(e as any)}
        className="block"
      >
        <div className="flex gap-3">
          {/* Poster */}
          <div className="relative w-28 h-16 flex-shrink-0 bg-[var(--glass-bg)] rounded-[var(--radius-2xl)] overflow-hidden">
            {poster ? (
              <Image
                src={poster}
                alt={title}
                fill
                className="object-cover"
                sizes="112px"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const fallback = document.createElement('div');
                    fallback.className = 'w-full h-full flex items-center justify-center';
                    fallback.innerHTML = '<svg class="text-[var(--text-color-secondary)] opacity-30" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>';
                    parent.appendChild(fallback);
                  }
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Icons.Film size={32} className="text-[var(--text-color-secondary)] opacity-30" />
              </div>
            )}
            {/* Progress overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
              <div
                className="h-full bg-[var(--accent-color)]"
                style={{ width: `${Math.min(100, progress)}%` }}
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-[var(--text-color)] truncate group-hover:text-[var(--accent-color)] transition-colors mb-1">
              {title}
            </h3>
            {episodeText && (
              <p className="text-xs text-[var(--text-color-secondary)] mb-1">
                {episodeText}
              </p>
            )}
            <div className="flex items-center justify-between text-xs text-[var(--text-color-secondary)]">
              <span>{formatTime(playbackPosition)} / {formatTime(duration)}</span>
              <span>{formatDate(timestamp)}</span>
            </div>
          </div>

          {/* Delete button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-[var(--glass-bg)] rounded-full self-start"
            aria-label="删除"
          >
            <Icons.Trash size={16} className="text-[var(--text-color-secondary)]" />
          </button>
        </div>
      </a>
    </div>
  );
}
