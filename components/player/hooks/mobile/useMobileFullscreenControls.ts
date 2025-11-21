import { useCallback, useEffect } from 'react';
import { useIsIOS } from '@/lib/hooks/useMobilePlayer';

interface UseMobileFullscreenProps {
    containerRef: React.RefObject<HTMLDivElement>;
    videoRef: React.RefObject<HTMLVideoElement>;
    isFullscreen: boolean;
    setIsFullscreen: (fullscreen: boolean) => void;
    isPiPSupported: boolean;
    setIsPiPSupported: (supported: boolean) => void;
}

export function useMobileFullscreenControls({
    containerRef,
    videoRef,
    isFullscreen,
    setIsFullscreen,
    isPiPSupported,
    setIsPiPSupported
}: UseMobileFullscreenProps) {
    const isIOS = useIsIOS();

    useEffect(() => {
        if (typeof document !== 'undefined') {
            setIsPiPSupported('pictureInPictureEnabled' in document);
        }
    }, [setIsPiPSupported]);

    const toggleFullscreen = useCallback(() => {
        if (!containerRef.current) return;

        if (!isFullscreen) {
            if (isIOS && videoRef.current && (videoRef.current as any).webkitEnterFullscreen) {
                (videoRef.current as any).webkitEnterFullscreen();
                return;
            }

            if (containerRef.current.requestFullscreen) {
                containerRef.current.requestFullscreen().catch((err: Error) => console.warn('Fullscreen request failed:', err));
            } else if ((containerRef.current as any).webkitRequestFullscreen) {
                (containerRef.current as any).webkitRequestFullscreen();
            } else if ((containerRef.current as any).webkitRequestFullScreen) {
                (containerRef.current as any).webkitRequestFullScreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch((err: Error) => console.warn('Exit fullscreen failed:', err));
            } else if ((document as any).webkitExitFullscreen) {
                (document as any).webkitExitFullscreen();
            } else if ((document as any).webkitCancelFullScreen) {
                (document as any).webkitCancelFullScreen();
            }
        }
    }, [containerRef, isFullscreen, isIOS, videoRef]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            const isInFullscreen = !!(
                document.fullscreenElement ||
                (document as any).webkitFullscreenElement ||
                (document as any).webkitCurrentFullScreenElement
            );
            setIsFullscreen(isInFullscreen);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
        };
    }, [setIsFullscreen]);

    const togglePictureInPicture = useCallback(async () => {
        if (!videoRef.current || !isPiPSupported) return;

        try {
            if (document.pictureInPictureElement) {
                await document.exitPictureInPicture();
            } else {
                await videoRef.current.requestPictureInPicture();
            }
        } catch (error) {
            console.error('Failed to toggle Picture-in-Picture:', error);
        }
    }, [videoRef, isPiPSupported]);

    return {
        toggleFullscreen,
        togglePictureInPicture
    };
}
