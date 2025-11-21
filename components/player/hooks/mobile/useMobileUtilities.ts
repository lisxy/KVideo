import { useCallback, useEffect } from 'react';

interface UseMobileUtilitiesProps {
    src: string;
    volume: number;
    isMuted: boolean;
    videoRef: React.RefObject<HTMLVideoElement>;
    setVolume: (volume: number) => void;
    setIsMuted: (muted: boolean) => void;
    setViewportWidth: (width: number) => void;
    setToastMessage: (message: string | null) => void;
    setShowToast: (show: boolean) => void;
    toastTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
}

export function useMobileUtilities({
    src,
    volume,
    isMuted,
    videoRef,
    setVolume,
    setIsMuted,
    setViewportWidth,
    setToastMessage,
    setShowToast,
    toastTimeoutRef
}: UseMobileUtilitiesProps) {
    useEffect(() => {
        const updateViewportWidth = () => {
            setViewportWidth(window.innerWidth);
        };
        updateViewportWidth();
        window.addEventListener('resize', updateViewportWidth);
        return () => window.removeEventListener('resize', updateViewportWidth);
    }, [setViewportWidth]);

    const toggleMute = useCallback(() => {
        if (!videoRef.current) return;
        if (isMuted) {
            videoRef.current.volume = volume;
            setIsMuted(false);
        } else {
            videoRef.current.volume = 0;
            setIsMuted(true);
        }
    }, [videoRef, isMuted, volume, setIsMuted]);

    const showToastNotification = useCallback((message: string) => {
        setToastMessage(message);
        setShowToast(true);

        if (toastTimeoutRef.current) {
            clearTimeout(toastTimeoutRef.current);
        }

        toastTimeoutRef.current = setTimeout(() => {
            setShowToast(false);
            setTimeout(() => setToastMessage(null), 300);
        }, 3000);
    }, [setToastMessage, setShowToast, toastTimeoutRef]);

    const handleCopyLink = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(src);
            showToastNotification('链接已复制到剪贴板');
        } catch (error) {
            console.error('Copy failed:', error);
            showToastNotification('复制失败，请重试');
        }
    }, [src, showToastNotification]);

    return {
        toggleMute,
        showToastNotification,
        handleCopyLink
    };
}
