import { useCallback, useEffect } from 'react';

interface UseMobileProgressControlsProps {
    videoRef: React.RefObject<HTMLVideoElement>;
    progressBarRef: React.RefObject<HTMLDivElement>;
    duration: number;
    setCurrentTime: (time: number) => void;
    isDraggingProgressRef: React.MutableRefObject<boolean>;
}

export function useMobileProgressControls({
    videoRef,
    progressBarRef,
    duration,
    setCurrentTime,
    isDraggingProgressRef
}: UseMobileProgressControlsProps) {
    const updateProgressFromEvent = useCallback((e: any) => {
        if (!videoRef.current || !progressBarRef.current) return;

        const rect = progressBarRef.current.getBoundingClientRect();
        let clientX: number;

        if ('touches' in e) {
            const touch = e.touches[0] || e.changedTouches?.[0];
            if (!touch) return;
            clientX = touch.clientX;
        } else {
            clientX = e.clientX;
        }

        const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        return pos * duration;
    }, [videoRef, progressBarRef, duration]);

    const handleProgressTouchStart = useCallback((e: any) => {
        isDraggingProgressRef.current = true;
        const newTime = updateProgressFromEvent(e);
        if (newTime !== undefined) {
            setCurrentTime(newTime);
        }
    }, [isDraggingProgressRef, updateProgressFromEvent, setCurrentTime]);

    const handleProgressTouchMove = useCallback((e: any) => {
        if (!isDraggingProgressRef.current) return;
        e.preventDefault();
        const newTime = updateProgressFromEvent(e);
        if (newTime !== undefined) {
            setCurrentTime(newTime);
            if (videoRef.current) {
                videoRef.current.currentTime = newTime;
            }
        }
    }, [isDraggingProgressRef, updateProgressFromEvent, setCurrentTime, videoRef]);

    const handleProgressTouchEnd = useCallback((e: any) => {
        if (!isDraggingProgressRef.current) return;
        isDraggingProgressRef.current = false;
        const newTime = updateProgressFromEvent(e);
        if (newTime !== undefined && videoRef.current) {
            videoRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    }, [isDraggingProgressRef, updateProgressFromEvent, videoRef, setCurrentTime]);

    const handleProgressClick = useCallback((e: any) => {
        const newTime = updateProgressFromEvent(e);
        if (newTime !== undefined && videoRef.current) {
            videoRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    }, [updateProgressFromEvent, videoRef, setCurrentTime]);

    return {
        handleProgressTouchStart,
        handleProgressTouchMove,
        handleProgressTouchEnd,
        handleProgressClick
    };
}
