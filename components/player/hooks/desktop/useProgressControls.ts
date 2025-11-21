import { useCallback, useEffect } from 'react';

interface UseProgressControlsProps {
    videoRef: React.RefObject<HTMLVideoElement>;
    progressBarRef: React.RefObject<HTMLDivElement>;
    duration: number;
    setCurrentTime: (time: number) => void;
    isDraggingProgressRef: React.MutableRefObject<boolean>;
}

export function useProgressControls({
    videoRef,
    progressBarRef,
    duration,
    setCurrentTime,
    isDraggingProgressRef
}: UseProgressControlsProps) {
    const handleProgressClick = useCallback((e: any) => {
        if (!videoRef.current || !progressBarRef.current) return;
        const rect = progressBarRef.current.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        const newTime = pos * duration;
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    }, [videoRef, progressBarRef, duration, setCurrentTime]);

    const handleProgressMouseDown = useCallback((e: any) => {
        e.preventDefault();
        isDraggingProgressRef.current = true;
        handleProgressClick(e);
    }, [isDraggingProgressRef, handleProgressClick]);

    useEffect(() => {
        const handleProgressMouseMove = (e: MouseEvent) => {
            if (!isDraggingProgressRef.current || !progressBarRef.current || !videoRef.current) return;
            e.preventDefault();
            const rect = progressBarRef.current.getBoundingClientRect();
            const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            const newTime = pos * duration;
            videoRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        };

        const handleMouseUp = () => {
            if (isDraggingProgressRef.current) {
                isDraggingProgressRef.current = false;
            }
        };

        document.addEventListener('mousemove', handleProgressMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleProgressMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [duration, isDraggingProgressRef, progressBarRef, videoRef, setCurrentTime]);

    return {
        handleProgressClick,
        handleProgressMouseDown
    };
}
