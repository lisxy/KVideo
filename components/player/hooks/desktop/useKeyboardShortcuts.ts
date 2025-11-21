import { useEffect } from 'react';

interface UseKeyboardShortcutsProps {
    videoRef: React.RefObject<HTMLVideoElement>;
    isPlaying: boolean;
    volume: number;
    isPiPSupported: boolean;
    togglePlay: () => void;
    toggleMute: () => void;
    toggleFullscreen: () => void;
    togglePictureInPicture: () => void;
    skipForward: () => void;
    skipBackward: () => void;
    showVolumeBarTemporarily: () => void;
    setShowControls: (show: boolean) => void;
    setVolume: (volume: number) => void;
    setIsMuted: (muted: boolean) => void;
    controlsTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
}

export function useKeyboardShortcuts({
    videoRef,
    isPlaying,
    volume,
    isPiPSupported,
    togglePlay,
    toggleMute,
    toggleFullscreen,
    togglePictureInPicture,
    skipForward,
    skipBackward,
    showVolumeBarTemporarily,
    setShowControls,
    setVolume,
    setIsMuted,
    controlsTimeoutRef
}: UseKeyboardShortcutsProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
                return;
            }

            const shortcuts = [' ', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'f', 'F', 'm', 'M', 'i', 'I', '<', '>', ',', '.'];
            if (shortcuts.includes(e.key)) {
                e.preventDefault();
                setShowControls(true);
                if (controlsTimeoutRef.current) {
                    clearTimeout(controlsTimeoutRef.current);
                }
                if (isPlaying) {
                    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
                }
            }

            switch (e.key) {
                case ' ':
                    togglePlay();
                    break;
                case 'ArrowLeft':
                case '<':
                case ',':
                    skipBackward();
                    break;
                case 'ArrowRight':
                case '>':
                case '.':
                    skipForward();
                    break;
                case 'm':
                case 'M':
                    toggleMute();
                    showVolumeBarTemporarily();
                    break;
                case 'ArrowUp':
                    if (videoRef.current) {
                        const newVolume = Math.min(1, volume + 0.05);
                        setVolume(newVolume);
                        videoRef.current.volume = newVolume;
                        setIsMuted(newVolume === 0);
                        showVolumeBarTemporarily();
                    }
                    break;
                case 'ArrowDown':
                    if (videoRef.current) {
                        const newVolume = Math.max(0, volume - 0.05);
                        setVolume(newVolume);
                        videoRef.current.volume = newVolume;
                        setIsMuted(newVolume === 0);
                        showVolumeBarTemporarily();
                    }
                    break;
                case 'f':
                case 'F':
                    toggleFullscreen();
                    break;
                case 'i':
                case 'I':
                    if (isPiPSupported) {
                        togglePictureInPicture();
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isPlaying, volume, isPiPSupported, togglePlay, toggleMute, toggleFullscreen, togglePictureInPicture, skipForward, skipBackward, showVolumeBarTemporarily, setShowControls, controlsTimeoutRef, videoRef, setVolume, setIsMuted]);
}
