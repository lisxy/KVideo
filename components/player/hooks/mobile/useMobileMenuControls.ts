import { useEffect } from 'react';

interface UseMobileMenuControlsProps {
    videoRef: React.RefObject<HTMLVideoElement>;
    isPlaying: boolean;
    showMoreMenu: boolean;
    showVolumeMenu: boolean;
    showSpeedMenu: boolean;
    wasPlayingBeforeMenu: boolean;
    setShowControls: (show: boolean) => void;
    setShowMoreMenu: (show: boolean) => void;
    setShowVolumeMenu: (show: boolean) => void;
    setShowSpeedMenu: (show: boolean) => void;
    setWasPlayingBeforeMenu: (was: boolean) => void;
    controlsTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
    menuIdleTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
}

export function useMobileMenuControls({
    videoRef,
    isPlaying,
    showMoreMenu,
    showVolumeMenu,
    showSpeedMenu,
    wasPlayingBeforeMenu,
    setShowControls,
    setShowMoreMenu,
    setShowVolumeMenu,
    setShowSpeedMenu,
    setWasPlayingBeforeMenu,
    controlsTimeoutRef,
    menuIdleTimeoutRef
}: UseMobileMenuControlsProps) {
    useEffect(() => {
        if (!isPlaying) {
            setShowControls(true);
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
            return;
        }

        const hideControls = () => {
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
            controlsTimeoutRef.current = setTimeout(() => {
                if (isPlaying) {
                    setShowControls(false);
                    setShowSpeedMenu(false);
                    setShowVolumeMenu(false);
                    setShowMoreMenu(false);
                }
            }, 3000);
        };

        hideControls();
        return () => {
            if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        };
    }, [isPlaying, setShowControls, setShowSpeedMenu, setShowVolumeMenu, setShowMoreMenu, controlsTimeoutRef]);

    useEffect(() => {
        if (showMoreMenu) {
            if (videoRef.current && isPlaying) {
                setWasPlayingBeforeMenu(true);
                videoRef.current.pause();
            }
            if (menuIdleTimeoutRef.current) clearTimeout(menuIdleTimeoutRef.current);
            menuIdleTimeoutRef.current = setTimeout(() => {
                setShowMoreMenu(false);
                if (wasPlayingBeforeMenu && videoRef.current) {
                    videoRef.current.play().catch((err: Error) => console.warn('Resume play error:', err));
                    setWasPlayingBeforeMenu(false);
                }
            }, 2000);
        }
        return () => {
            if (menuIdleTimeoutRef.current) clearTimeout(menuIdleTimeoutRef.current);
        };
    }, [showMoreMenu, isPlaying, wasPlayingBeforeMenu, videoRef, menuIdleTimeoutRef, setShowMoreMenu, setWasPlayingBeforeMenu]);

    useEffect(() => {
        if (showVolumeMenu || showSpeedMenu) {
            if (videoRef.current && isPlaying) {
                setWasPlayingBeforeMenu(true);
                videoRef.current.pause();
            }
        }
    }, [showVolumeMenu, showSpeedMenu, isPlaying, videoRef, setWasPlayingBeforeMenu]);

    useEffect(() => {
        const handleClickOutside = (e: any) => {
            const target = e.target as HTMLElement;
            const isMenuClick = target.closest('.menu-container') || target.closest('[aria-label="更多"]');

            if (!isMenuClick && (showMoreMenu || showVolumeMenu || showSpeedMenu)) {
                setShowMoreMenu(false);
                setShowVolumeMenu(false);
                setShowSpeedMenu(false);

                if (wasPlayingBeforeMenu && videoRef.current) {
                    videoRef.current.play().catch((err: Error) => console.warn('Resume play error:', err));
                    setWasPlayingBeforeMenu(false);
                }
            }
        };

        if (showMoreMenu || showVolumeMenu || showSpeedMenu) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [showMoreMenu, showVolumeMenu, showSpeedMenu, wasPlayingBeforeMenu, videoRef, setShowMoreMenu, setShowVolumeMenu, setShowSpeedMenu, setWasPlayingBeforeMenu]);
}
