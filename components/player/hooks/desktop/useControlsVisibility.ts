import { useEffect, useCallback } from 'react';

interface UseControlsVisibilityProps {
    isPlaying: boolean;
    showControls: boolean;
    showSpeedMenu: boolean;
    setShowControls: (show: boolean) => void;
    setShowSpeedMenu: (show: boolean) => void;
    controlsTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
    speedMenuTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
    mouseMoveThrottleRef: React.MutableRefObject<NodeJS.Timeout | null>;
}

export function useControlsVisibility({
    isPlaying,
    showControls,
    showSpeedMenu,
    setShowControls,
    setShowSpeedMenu,
    controlsTimeoutRef,
    speedMenuTimeoutRef,
    mouseMoveThrottleRef
}: UseControlsVisibilityProps) {
    useEffect(() => {
        if (!isPlaying) return;

        const hideControls = () => {
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
            controlsTimeoutRef.current = setTimeout(() => {
                if (isPlaying && !showSpeedMenu) {
                    setShowControls(false);
                }
            }, 3000);
        };

        hideControls();

        return () => {
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
        };
    }, [isPlaying, showSpeedMenu, setShowControls, controlsTimeoutRef]);

    const handleMouseMove = useCallback(() => {
        if (mouseMoveThrottleRef.current) return;

        mouseMoveThrottleRef.current = setTimeout(() => {
            mouseMoveThrottleRef.current = null;
        }, 200);

        if (!showControls) {
            setShowControls(true);
        }
        if (isPlaying && controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
            controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
        }
    }, [showControls, isPlaying, setShowControls, controlsTimeoutRef, mouseMoveThrottleRef]);

    const startSpeedMenuTimeout = useCallback(() => {
        if (speedMenuTimeoutRef.current) {
            clearTimeout(speedMenuTimeoutRef.current);
        }
        speedMenuTimeoutRef.current = setTimeout(() => {
            setShowSpeedMenu(false);
        }, 1500);
    }, [speedMenuTimeoutRef, setShowSpeedMenu]);

    const clearSpeedMenuTimeout = useCallback(() => {
        if (speedMenuTimeoutRef.current) {
            clearTimeout(speedMenuTimeoutRef.current);
        }
    }, [speedMenuTimeoutRef]);

    useEffect(() => {
        if (showSpeedMenu) {
            startSpeedMenuTimeout();
        } else {
            clearSpeedMenuTimeout();
        }
        return () => clearSpeedMenuTimeout();
    }, [showSpeedMenu, startSpeedMenuTimeout, clearSpeedMenuTimeout]);

    return {
        handleMouseMove,
        startSpeedMenuTimeout,
        clearSpeedMenuTimeout
    };
}
