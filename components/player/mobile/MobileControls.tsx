import React from 'react';
import { MobileProgressBar } from './MobileProgressBar';
import { MobileVolumeMenu } from './MobileVolumeMenu';
import { MobileSpeedMenu } from './MobileSpeedMenu';
import { CompactControls } from './CompactControls';
import { FullControls } from './FullControls';

interface MobileControlsProps {
    showControls: boolean;
    isCompactLayout: boolean;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    isMuted: boolean;
    isFullscreen: boolean;
    playbackRate: number;
    showMoreMenu: boolean;
    showVolumeMenu: boolean;
    showSpeedMenu: boolean;
    isPiPSupported: boolean;
    progressBarRef: React.RefObject<HTMLDivElement | null>;
    onTogglePlay: () => void;
    onSkipVideo: (seconds: number, side: 'left' | 'right') => void;
    onToggleMute: () => void;
    onToggleFullscreen: () => void;
    onToggleMoreMenu: () => void;
    onToggleVolumeMenu: () => void;
    onToggleSpeedMenu: () => void;
    onTogglePiP: () => void;
    onVolumeChange: (volume: number) => void;
    onSpeedChange: (speed: number) => void;
    onCopyLink: () => void;
    onProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
    onProgressTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void;
    onProgressTouchMove: (e: React.TouchEvent<HTMLDivElement>) => void;
    onProgressTouchEnd: (e: React.TouchEvent<HTMLDivElement>) => void;
    formatTime: (seconds: number) => string;
    speeds: number[];
}

export function MobileControls(props: MobileControlsProps) {
    const {
        showControls,
        isCompactLayout,
        progressBarRef,
        currentTime,
        duration,
        onProgressClick,
        onProgressTouchStart,
        onProgressTouchMove,
        onProgressTouchEnd,
        showVolumeMenu,
        showSpeedMenu,
        isMuted,
        volume,
        playbackRate,
        speeds,
        onToggleMute,
        onVolumeChange,
        onSpeedChange,
        onToggleVolumeMenu,
        onToggleSpeedMenu
    } = props;

    const iconSize = isCompactLayout ? 20 : 22;
    const buttonPadding = isCompactLayout ? 'p-2' : 'p-2.5';
    const controlsGap = isCompactLayout ? 'gap-2' : 'gap-3';
    const textSize = isCompactLayout ? 'text-xs' : 'text-sm';
    const controlsPadding = isCompactLayout ? 'px-3 pb-3' : 'px-4 pb-4';

    return (
        <div
            className={`absolute bottom-0 left-0 right-0 z-50 transition-all duration-300 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
            style={{ pointerEvents: showControls ? 'auto' : 'none' }}
        >
            <MobileProgressBar
                progressBarRef={progressBarRef}
                currentTime={currentTime}
                duration={duration}
                onProgressClick={onProgressClick}
                onProgressTouchStart={onProgressTouchStart}
                onProgressTouchMove={onProgressTouchMove}
                onProgressTouchEnd={onProgressTouchEnd}
            />

            <div className={`bg-gradient-to-t from-black/90 via-black/70 to-transparent ${controlsPadding} pt-2`}>
                {isCompactLayout ? (
                    <CompactControls
                        {...props}
                        iconSize={iconSize}
                        buttonPadding={buttonPadding}
                        controlsGap={controlsGap}
                        textSize={textSize}
                    />
                ) : (
                    <FullControls
                        {...props}
                        iconSize={iconSize}
                        buttonPadding={buttonPadding}
                        controlsGap={controlsGap}
                        textSize={textSize}
                    />
                )}

                <MobileVolumeMenu
                    showVolumeMenu={showVolumeMenu}
                    isCompactLayout={true}
                    isMuted={isMuted}
                    volume={volume}
                    onToggleMute={onToggleMute}
                    onVolumeChange={onVolumeChange}
                    onClose={onToggleVolumeMenu}
                />

                <MobileSpeedMenu
                    showSpeedMenu={showSpeedMenu}
                    isCompactLayout={true}
                    playbackRate={playbackRate}
                    speeds={speeds}
                    onSpeedChange={onSpeedChange}
                    onClose={onToggleSpeedMenu}
                />
            </div>
        </div>
    );
}
