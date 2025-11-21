import React from 'react';
import { Icons } from '@/components/ui/Icon';
import { MobileMoreMenu } from './MobileMoreMenu';

interface CompactControlsProps {
    isPlaying: boolean;
    isFullscreen: boolean;
    showMoreMenu: boolean;
    isMuted: boolean;
    volume: number;
    playbackRate: number;
    isPiPSupported: boolean;
    currentTime: number;
    duration: number;
    formatTime: (seconds: number) => string;
    onTogglePlay: () => void;
    onToggleFullscreen: () => void;
    onToggleMoreMenu: () => void;
    onToggleVolumeMenu: () => void;
    onToggleSpeedMenu: () => void;
    onTogglePiP: () => void;
    onCopyLink: () => void;
    iconSize: number;
    buttonPadding: string;
    controlsGap: string;
    textSize: string;
}

export function CompactControls({
    isPlaying,
    isFullscreen,
    showMoreMenu,
    isMuted,
    volume,
    playbackRate,
    isPiPSupported,
    currentTime,
    duration,
    formatTime,
    onTogglePlay,
    onToggleFullscreen,
    onToggleMoreMenu,
    onToggleVolumeMenu,
    onToggleSpeedMenu,
    onTogglePiP,
    onCopyLink,
    iconSize,
    buttonPadding,
    controlsGap,
    textSize
}: CompactControlsProps) {
    return (
        <div className={`flex items-center justify-between ${controlsGap}`}>
            <div className={`flex items-center ${controlsGap} min-w-0`}>
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

                <span className={`text-white ${textSize} font-medium tabular-nums whitespace-nowrap`}>
                    {formatTime(currentTime)} / {formatTime(duration)}
                </span>
            </div>

            <div className={`flex items-center ${controlsGap} flex-shrink-0`}>
                <div className="relative z-[60]">
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

                    <MobileMoreMenu
                        showMoreMenu={showMoreMenu}
                        isMuted={isMuted}
                        volume={volume}
                        playbackRate={playbackRate}
                        isPiPSupported={isPiPSupported}
                        onCopyLink={() => {
                            onToggleMoreMenu();
                            onCopyLink();
                        }}
                        onToggleVolumeMenu={() => {
                            onToggleMoreMenu();
                            onToggleVolumeMenu();
                        }}
                        onToggleSpeedMenu={() => {
                            onToggleMoreMenu();
                            onToggleSpeedMenu();
                        }}
                        onTogglePiP={() => {
                            onToggleMoreMenu();
                            onTogglePiP();
                        }}
                    />
                </div>

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
