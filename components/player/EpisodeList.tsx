'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Icons } from '@/components/ui/Icon';

interface Episode {
  name?: string;
  url: string;
}

interface EpisodeListProps {
  episodes: Episode[] | null;
  currentEpisode: number;
  onEpisodeClick: (episode: Episode, index: number) => void;
}

export function EpisodeList({ episodes, currentEpisode, onEpisodeClick }: EpisodeListProps) {
  return (
    <Card hover={false} className="lg:sticky lg:top-32">
      <h3 className="text-lg sm:text-xl font-bold text-[var(--text-color)] mb-4 flex items-center gap-2">
        <Icons.List size={20} className="sm:w-6 sm:h-6" />
        <span>选集</span>
        {episodes && (
          <Badge variant="primary">{episodes.length}</Badge>
        )}
      </h3>

      <div className="max-h-[400px] sm:max-h-[600px] overflow-y-auto space-y-2 pr-2">
        {episodes && episodes.length > 0 ? (
          episodes.map((episode, index) => (
            <button
              key={index}
              onClick={() => onEpisodeClick(episode, index)}
              className={`
                w-full px-3 py-2 sm:px-4 sm:py-3 rounded-[var(--radius-2xl)] text-left transition-[var(--transition-fluid)]
                ${currentEpisode === index
                  ? 'bg-[var(--accent-color)] text-white shadow-[0_4px_12px_color-mix(in_srgb,var(--accent-color)_50%,transparent)] brightness-110'
                  : 'bg-[var(--glass-bg)] hover:bg-[var(--glass-hover)] text-[var(--text-color)] border border-[var(--glass-border)]'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm sm:text-base">
                  {episode.name || `第 ${index + 1} 集`}
                </span>
                {currentEpisode === index && (
                  <Icons.Play size={16} />
                )}
              </div>
            </button>
          ))
        ) : (
          <div className="text-center py-8 text-[var(--text-secondary)]">
            <Icons.Inbox size={48} className="text-[var(--text-color-secondary)] mx-auto mb-2" />
            <p>暂无剧集信息</p>
          </div>
        )}
      </div>
    </Card>
  );
}
