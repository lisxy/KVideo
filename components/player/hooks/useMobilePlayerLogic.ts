import { useMobilePlaybackControls } from './mobile/useMobilePlaybackControls';
import { useMobileProgressControls } from './mobile/useMobileProgressControls';
import { useMobileSkipControls } from './mobile/useMobileSkipControls';
import { useMobileFullscreenControls } from './mobile/useMobileFullscreenControls';
import { useMobileMenuControls } from './mobile/useMobileMenuControls';
import { useMobileUtilities } from './mobile/useMobileUtilities';

interface UseMobilePlayerLogicProps {
    src: string;
    poster?: string;
    initialTime: number;
    onError?: (error: string) => void;
    onTimeUpdate?: (currentTime: number, duration: number) => void;
    refs: any;
    state: any;
}

export function useMobilePlayerLogic({
    src,
    initialTime,
    onError,
    onTimeUpdate,
    refs,
    state
}: UseMobilePlayerLogicProps) {
    const {
        videoRef,
        containerRef,
        progressBarRef,
        controlsTimeoutRef,
        skipTimeoutRef,
        isDraggingProgressRef,
        menuIdleTimeoutRef,
        isTogglingRef,
        toastTimeoutRef
    } = refs;

    const {
        isPlaying, setIsPlaying,
        currentTime, setCurrentTime,
        duration, setDuration,
        volume, setVolume,
        isMuted, setIsMuted,
        isFullscreen, setIsFullscreen,
        setShowControls,
        setIsLoading,
        setPlaybackRate,
        showSpeedMenu, setShowSpeedMenu,
        showVolumeMenu, setShowVolumeMenu,
        showMoreMenu, setShowMoreMenu,
        isPiPSupported, setIsPiPSupported,
        skipAmount, setSkipAmount,
        skipSide, setSkipSide,
        setShowSkipIndicator,
        wasPlayingBeforeMenu, setWasPlayingBeforeMenu,
        setToastMessage,
        setShowToast,
        setViewportWidth
    } = state;

    const playbackControls = useMobilePlaybackControls({
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
    });

    const progressControls = useMobileProgressControls({
        videoRef,
        progressBarRef,
        duration,
        setCurrentTime,
        isDraggingProgressRef
    });

    const skipControls = useMobileSkipControls({
        videoRef,
        duration,
        setCurrentTime,
        skipAmount,
        skipSide,
        setSkipAmount,
        setSkipSide,
        setShowSkipIndicator,
        skipTimeoutRef
    });

    const fullscreenControls = useMobileFullscreenControls({
        containerRef,
        videoRef,
        isFullscreen,
        setIsFullscreen,
        isPiPSupported,
        setIsPiPSupported
    });

    const utilities = useMobileUtilities({
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
    });

    useMobileMenuControls({
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
    });

    return {
        skipVideo: skipControls.skipVideo,
        togglePlay: playbackControls.togglePlay,
        handlePlay: playbackControls.handlePlay,
        handlePause: playbackControls.handlePause,
        handleTimeUpdateEvent: playbackControls.handleTimeUpdateEvent,
        handleLoadedMetadata: playbackControls.handleLoadedMetadata,
        handleVideoError: playbackControls.handleVideoError,
        handleProgressTouchStart: progressControls.handleProgressTouchStart,
        handleProgressTouchMove: progressControls.handleProgressTouchMove,
        handleProgressTouchEnd: progressControls.handleProgressTouchEnd,
        handleProgressClick: progressControls.handleProgressClick,
        toggleMute: utilities.toggleMute,
        toggleFullscreen: fullscreenControls.toggleFullscreen,
        togglePictureInPicture: fullscreenControls.togglePictureInPicture,
        changePlaybackSpeed: playbackControls.changePlaybackSpeed,
        showToastNotification: utilities.showToastNotification,
        handleCopyLink: utilities.handleCopyLink,
        formatTime: playbackControls.formatTime
    };
}
