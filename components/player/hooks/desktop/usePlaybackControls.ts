import { useCallback } from 'react';

interface UsePlaybackControlsProps {
    videoRef: React.RefObject<HTMLVideoElement>;
    isPlaying: boolean;
    setIsPlaying: (playing: boolean) => void;
    setIsLoading: (loading: boolean) => void;
    initialTime: number;
    setDuration: (duration: number) => void;
    setCurrentTime: (time: number) => void;
    onTimeUpdate?: (currentTime: number, duration: number) => void;
    onError?: (error: string) => void;
    isDraggingProgressRef: React.MutableRefObject<boolean>;
}

export function usePlaybackControls({
    videoRef,
    isPlaying,
    setIsPlaying,
    setIsLoading,
    initialTime,
    setDuration,
    setCurrentTime,
    onTimeUpdate,
    onError,
    isDraggingProgressRef
}: UsePlaybackControlsProps) {
    const togglePlay = useCallback(() => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
    }, [isPlaying, videoRef]);

    const handlePlay = useCallback(() => setIsPlaying(true), [setIsPlaying]);
    const handlePause = useCallback(() => setIsPlaying(false), [setIsPlaying]);

    const handleTimeUpdateEvent = useCallback(() => {
        if (!videoRef.current || isDraggingProgressRef.current) return;
        const current = videoRef.current.currentTime;
        const total = videoRef.current.duration;
        setCurrentTime(current);
        setDuration(total);
        if (onTimeUpdate) {
            onTimeUpdate(current, total);
        }
    }, [videoRef, isDraggingProgressRef, setCurrentTime, setDuration, onTimeUpdate]);

    const handleLoadedMetadata = useCallback(() => {
        if (!videoRef.current) return;
        setDuration(videoRef.current.duration);
        setIsLoading(false);
        if (initialTime > 0) {
            videoRef.current.currentTime = initialTime;
        }
        videoRef.current.play().catch((err: Error) => {
            console.warn('Autoplay was prevented:', err);
        });
    }, [videoRef, setDuration, setIsLoading, initialTime]);

    const handleVideoError = useCallback(() => {
        setIsLoading(false);
        if (onError) {
            onError('Video failed to load');
        }
    }, [setIsLoading, onError]);

    const changePlaybackSpeed = useCallback((speed: number, speedMenuTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>, setPlaybackRate: (rate: number) => void, setShowSpeedMenu: (show: boolean) => void) => {
        if (!videoRef.current) return;
        videoRef.current.playbackRate = speed;
        setPlaybackRate(speed);
        setShowSpeedMenu(false);
        if (speedMenuTimeoutRef.current) {
            clearTimeout(speedMenuTimeoutRef.current);
        }
    }, [videoRef]);

    const formatTime = useCallback((seconds: number) => {
        if (isNaN(seconds)) return '0:00:00';
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, []);

    return {
        togglePlay,
        handlePlay,
        handlePause,
        handleTimeUpdateEvent,
        handleLoadedMetadata,
        handleVideoError,
        changePlaybackSpeed,
        formatTime
    };
}
