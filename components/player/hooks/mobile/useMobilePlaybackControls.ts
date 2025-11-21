import { useCallback, useEffect } from 'react';

interface UseMobilePlaybackProps {
    videoRef: React.RefObject<HTMLVideoElement>;
    isPlaying: boolean;
    setIsPlaying: (playing: boolean) => void;
    setIsLoading: (loading: boolean) => void;
    initialTime: number;
    setDuration: (duration: number) => void;
    setCurrentTime: (time: number) => void;
    setPlaybackRate: (rate: number) => void;
    setShowMoreMenu: (show: boolean) => void;
    setShowVolumeMenu: (show: boolean) => void;
    setShowSpeedMenu: (show: boolean) => void;
    onTimeUpdate?: (currentTime: number, duration: number) => void;
    onError?: (error: string) => void;
    isDraggingProgressRef: React.MutableRefObject<boolean>;
    isTogglingRef: React.MutableRefObject<boolean>;
}

export function useMobilePlaybackControls({
    videoRef,
    isPlaying,
    setIsPlaying,
    setIsLoading,
    initialTime,
    setDuration,
    setCurrentTime,
    setPlaybackRate,
    setShowMoreMenu,
    setShowVolumeMenu,
    setShowSpeedMenu,
    onTimeUpdate,
    onError,
    isDraggingProgressRef,
    isTogglingRef
}: UseMobilePlaybackProps) {
    const togglePlay = useCallback(async () => {
        if (!videoRef.current || isTogglingRef.current) return;
        isTogglingRef.current = true;

        try {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                setShowMoreMenu(false);
                setShowVolumeMenu(false);
                setShowSpeedMenu(false);
                await videoRef.current.play();
            }
        } catch (error) {
            console.warn('Play/pause error:', error);
        } finally {
            isTogglingRef.current = false;
        }
    }, [isPlaying, videoRef, isTogglingRef, setShowMoreMenu, setShowVolumeMenu, setShowSpeedMenu]);

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

    const changePlaybackSpeed = useCallback((speed: number) => {
        if (!videoRef.current) return;
        videoRef.current.playbackRate = speed;
        setPlaybackRate(speed);
        setShowSpeedMenu(false);
    }, [videoRef, setPlaybackRate, setShowSpeedMenu]);

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
