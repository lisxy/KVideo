import React from 'react';
import { Icons } from '@/components/ui/Icon';
import { MobileVolumeMenu } from './MobileVolumeMenu';
import { MobileSpeedMenu } from './MobileSpeedMenu';

interface FullControlsProps {
    isPlaying: boolean;
    isFullscreen: boolean;
    showVolumeMenu: boolean;
    showSpeedMenu: boolean;
    isMuted: boolean;
    volume: number;
    playbackRate: number;
    isPiPSupported: boolean;
    currentTime: number;
    duration: number;
    speeds: number[];
    formatTime: (seconds: number) => string;
    onTogglePlay: () => void;
    onSkipVideo: (seconds: number, side: 'left' | 'right') => void;
    onToggleFullscreen: () => void;
    onToggleVolumeMenu: () => void;
    onToggleSpeedMenu: () => void;
    onTogglePiP: () => void;
    onToggleMoreMenu: () => void;
    onToggleMute: () => void;
    onVolumeChange: (volume: number) => void;
    onSpeedChange: (speed: number) => void;
    iconSize: number;
    buttonPadding: string;
    controlsGap: string;
    textSize: string;
}

export function FullControls({
    isPlaying,
    isFullscreen,
    showVolumeMenu,
    showSpeedMenu,
    isMuted,
    volume,
    playbackRate,
    isPiPSupported,
    currentTime,
    duration,
    speeds,
    formatTime,
    onTogglePlay,
    onSkipVideo,
    onToggleFullscreen,
    onToggleVolumeMenu,
    onToggleSpeedMenu,
    onTogglePiP,
    onToggleMoreMenu,
    onToggleMute,
    onVolumeChange,
    onSpeedChange,
    iconSize,
    buttonPadding,
    controlsGap,
    textSize
}: FullControlsProps) {
    return (
        <div className={`flex items-center ${controlsGap}`}>
            <div className={`flex items-center ${controlsGap}`}>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onTogglePlay();
                    }}
                    className={`btn-icon ${buttonPadding} flex-shrink-0 touch-manipulation relative z-[60]`}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                    {isPlaying ? <Icons.Pause size={iconSize} /> : <Icons.Play size={iconSize} />}
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onSkipVideo(10, 'left');
                    }}
                    className={`btn-icon ${buttonPadding} flex-shrink-0 touch-manipulation`}
                    aria-label="后退 10 秒"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                    <Icons.SkipBack size={iconSize} />
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onSkipVideo(10, 'right');
                    }}
                    className={`btn-icon ${buttonPadding} flex-shrink-0 touch-manipulation`}
                    aria-label="前进 10 秒"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                    <Icons.SkipForward size={iconSize} />
                </button>

                <div className="relative">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleVolumeMenu();
                        }}
                        className={`btn-icon ${buttonPadding} flex-shrink-0 touch-manipulation`}
                        aria-label="音量"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                        {isMuted || volume === 0 ? <Icons.VolumeX size={iconSize} /> : <Icons.Volume2 size={iconSize} />}
                    </button>

                    <MobileVolumeMenu
                        showVolumeMenu={showVolumeMenu}
                        isCompactLayout={false}
                        isMuted={isMuted}
                        volume={volume}
                        onToggleMute={onToggleMute}
                        onVolumeChange={onVolumeChange}
                        onClose={onToggleVolumeMenu}
                    />
                </div>

                <span className={`text-white ${textSize} font-medium tabular-nums whitespace-nowrap`}>
                    {formatTime(currentTime)} / {formatTime(duration)}
                </span>
            </div>

            <div className="flex-1" />

            <div className={`flex items-center ${controlsGap} flex-shrink-0`}>
                <div className="relative">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleSpeedMenu();
                        }}
                        className={`btn-icon ${buttonPadding} flex-shrink-0 touch-manipulation`}
                        aria-label="播放速度"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                        <span className={`text-white ${textSize} font-medium`}>{playbackRate}x</span>
                    </button>

                    <MobileSpeedMenu
                        showSpeedMenu={showSpeedMenu}
                        isCompactLayout={false}
                        playbackRate={playbackRate}
                        speeds={speeds}
                        onSpeedChange={onSpeedChange}
                        onClose={onToggleSpeedMenu}
                    />
                </div>

                {isPiPSupported && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onTogglePiP();
                        }}
                        className={`btn-icon ${buttonPadding} flex-shrink-0 touch-manipulation`}
                        aria-label="画中画"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                        <Icons.PictureInPicture size={iconSize} />
                    </button>
                )}

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleMoreMenu();
                    }}
                    className={`btn-icon ${buttonPadding} flex-shrink-0 touch-manipulation`}
                    aria-label="更多"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                    </svg>
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleFullscreen();
                    }}
                    className={`btn-icon ${buttonPadding} flex-shrink-0 touch-manipulation relative z-[60]`}
                    aria-label={isFullscreen ? '退出全屏' : '全屏'}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                    {isFullscreen ? <Icons.Minimize size={iconSize} /> : <Icons.Maximize size={iconSize} />}
                </button>
            </div>
        </div>
    );
}
