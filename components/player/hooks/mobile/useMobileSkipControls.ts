import { useCallback } from 'react';

interface UseMobileSkipControlsProps {
    videoRef: React.RefObject<HTMLVideoElement>;
    duration: number;
    setCurrentTime: (time: number) => void;
    skipAmount: number;
    skipSide: 'left' | 'right' | null;
    setSkipAmount: (amount: number) => void;
    setSkipSide: (side: 'left' | 'right' | null) => void;
    setShowSkipIndicator: (show: boolean) => void;
    skipTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
}

export function useMobileSkipControls({
    videoRef,
    duration,
    setCurrentTime,
    skipAmount,
    skipSide,
    setSkipAmount,
    setSkipSide,
    setShowSkipIndicator,
    skipTimeoutRef
}: UseMobileSkipControlsProps) {
    const skipVideo = useCallback((seconds: number, side: 'left' | 'right') => {
        if (!videoRef.current) return;

        if (skipTimeoutRef.current) {
            clearTimeout(skipTimeoutRef.current);
        }

        const newSkipAmount = skipSide === side ? skipAmount + Math.abs(seconds) : Math.abs(seconds);
        setSkipAmount(newSkipAmount);
        setSkipSide(side);
        setShowSkipIndicator(true);

        const targetTime = side === 'left'
            ? Math.max(videoRef.current.currentTime - Math.abs(seconds), 0)
            : Math.min(videoRef.current.currentTime + Math.abs(seconds), duration);

        videoRef.current.currentTime = targetTime;
        setCurrentTime(targetTime);

        skipTimeoutRef.current = setTimeout(() => {
            setShowSkipIndicator(false);
            setSkipAmount(0);
            setSkipSide(null);
        }, 1500);
    }, [duration, skipAmount, skipSide, videoRef, skipTimeoutRef, setSkipAmount, setSkipSide, setShowSkipIndicator, setCurrentTime]);

    return {
        skipVideo
    };
}
