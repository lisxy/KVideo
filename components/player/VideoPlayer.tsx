'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icons } from '@/components/ui/Icon';
import { useHistoryStore } from '@/lib/store/history-store';
import { CustomVideoPlayer } from './CustomVideoPlayer';

interface VideoPlayerProps {
  playUrl: string;
  videoId?: string;
  currentEpisode: number;
  onBack: () => void;
}

export function VideoPlayer({ playUrl, videoId, currentEpisode, onBack }: VideoPlayerProps) {
  const [videoError, setVideoError] = useState<string>('');
  const searchParams = useSearchParams();
  const { addToHistory } = useHistoryStore();
  
  // Get video metadata from URL params
  const source = searchParams.get('source') || '';
  const title = searchParams.get('title') || '未知视频';
  
  // Get saved progress for this video
  const getSavedProgress = () => {
    if (!videoId) return 0;
    const savedTime = localStorage.getItem(`video_progress_${videoId}_${currentEpisode}`);
    return savedTime ? parseFloat(savedTime) : 0;
  };

  // Handle time updates and save progress
  const handleTimeUpdate = (currentTime: number, duration: number) => {
    if (!videoId || !playUrl || duration === 0) return;

    // Save progress every few seconds
    if (currentTime > 1) {
      addToHistory(
        videoId,
        title,
        playUrl,
        currentEpisode,
        source,
        currentTime,
        duration,
        undefined,
        []
      );
    }
  };

  // Handle video errors
  const handleVideoError = (error: string) => {
    console.error('Video playback error:', error);
    setVideoError(error);
  };

  if (!playUrl) {
    return (
      <Card hover={false} className="p-0 overflow-hidden">
        <div className="aspect-video bg-[var(--glass-bg)] backdrop-blur-[25px] saturate-[180%] rounded-[var(--radius-2xl)] flex items-center justify-center border border-[var(--glass-border)]">
          <div className="text-center text-[var(--text-secondary)]">
            <Icons.TV size={64} className="text-[var(--text-color-secondary)] mx-auto mb-4" />
            <p>暂无播放源</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card hover={false} className="p-0 overflow-hidden">
      {videoError ? (
        <div className="aspect-video bg-black rounded-[var(--radius-2xl)] flex items-center justify-center">
          <div 
            className="text-center text-white max-w-md px-4"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <Icons.AlertTriangle size={48} className="mx-auto mb-4 text-red-500" />
            <p className="text-lg font-semibold mb-2">播放失败</p>
            <p className="text-sm text-gray-300 mb-4">{videoError}</p>
            <div className="flex gap-2 justify-center flex-wrap">
              <Button 
                variant="primary"
                onClick={() => setVideoError('')}
                className="flex items-center gap-2"
              >
                <Icons.RefreshCw size={16} />
                <span>重试</span>
              </Button>
              <Button 
                variant="secondary"
                onClick={onBack}
                className="flex items-center gap-2"
              >
                <Icons.ChevronLeft size={16} />
                <span>返回</span>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <CustomVideoPlayer
          src={playUrl}
          onError={handleVideoError}
          onTimeUpdate={handleTimeUpdate}
          initialTime={getSavedProgress()}
        />
      )}
    </Card>
  );
}
