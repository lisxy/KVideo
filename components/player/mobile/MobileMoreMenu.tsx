'use client';

import React from 'react';
import { Icons } from '@/components/ui/Icon';
import { usePlayerSettings } from '../hooks/usePlayerSettings';

interface MobileMoreMenuProps {
    showMoreMenu: boolean;
    isMuted: boolean;
    volume: number;
    playbackRate: number;
    isPiPSupported: boolean;
    isProxied?: boolean;
    onCopyLink: (type?: 'original' | 'proxy') => void;
    onToggleVolumeMenu: () => void;
    onToggleSpeedMenu: () => void;
    onTogglePiP: () => void;
}

export function MobileMoreMenu({
    showMoreMenu,
    isMuted,
    volume,
    playbackRate,
    isPiPSupported,
    isProxied = false,
    onCopyLink,
    onToggleVolumeMenu,
    onToggleSpeedMenu,
    onTogglePiP
}: MobileMoreMenuProps) {
    const {
        autoNextEpisode,
        autoSkipIntro,
        skipIntroSeconds,
        autoSkipOutro,
        skipOutroSeconds,
        setAutoNextEpisode,
        setAutoSkipIntro,
        setSkipIntroSeconds,
        setAutoSkipOutro,
        setSkipOutroSeconds,
    } = usePlayerSettings();

    if (!showMoreMenu) return null;

    return (
        <div className="absolute bottom-full right-0 mb-2 min-w-[200px] z-[100] menu-container">
            <div className="bg-[rgba(255,255,255,0.1)] backdrop-blur-[25px] rounded-[var(--radius-2xl)] border border-[rgba(255,255,255,0.2)] shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden">
                {/* Copy Link Option */}
                {isProxied ? (
                    <>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onCopyLink('original');
                            }}
                            className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/20 flex items-center gap-3 transition-all touch-manipulation cursor-pointer"
                            style={{ WebkitTapHighlightColor: 'transparent' }}
                        >
                            <Icons.Link size={18} />
                            <span>复制原链接</span>
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onCopyLink('proxy');
                            }}
                            className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/20 flex items-center gap-3 transition-all touch-manipulation cursor-pointer border-t border-white/10"
                            style={{ WebkitTapHighlightColor: 'transparent' }}
                        >
                            <Icons.Link size={18} />
                            <span>复制代理链接</span>
                        </button>
                    </>
                ) : (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onCopyLink('original');
                        }}
                        className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/20 flex items-center gap-3 transition-all touch-manipulation cursor-pointer"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                        <Icons.Link size={18} />
                        <span>复制链接</span>
                    </button>
                )}

                <div className="h-px bg-white/10 my-1" />

                {/* Auto Next Episode Switch */}
                <div
                    className="w-full px-4 py-3 flex items-center justify-between"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center gap-3 text-sm text-white">
                        <Icons.SkipForward size={18} />
                        <span>自动下一集</span>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setAutoNextEpisode(!autoNextEpisode);
                        }}
                        className={`relative w-10 h-6 rounded-full transition-colors cursor-pointer ${autoNextEpisode ? 'bg-[var(--accent-color)]' : 'bg-white/20'
                            }`}
                        aria-checked={autoNextEpisode}
                        role="switch"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                        <span
                            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${autoNextEpisode ? 'translate-x-4' : 'translate-x-0'
                                }`}
                        />
                    </button>
                </div>

                {/* Skip Intro Switch */}
                <div className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-sm text-white">
                            <Icons.FastForward size={18} />
                            <span>跳过片头</span>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setAutoSkipIntro(!autoSkipIntro);
                            }}
                            className={`relative w-10 h-6 rounded-full transition-colors cursor-pointer ${autoSkipIntro ? 'bg-[var(--accent-color)]' : 'bg-white/20'
                                }`}
                            aria-checked={autoSkipIntro}
                            role="switch"
                            style={{ WebkitTapHighlightColor: 'transparent' }}
                        >
                            <span
                                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${autoSkipIntro ? 'translate-x-4' : 'translate-x-0'
                                    }`}
                            />
                        </button>
                    </div>
                    {/* Expandable Input */}
                    {autoSkipIntro && (
                        <div className="mt-2 ml-7 flex items-center gap-2">
                            <span className="text-xs text-white/70">时长:</span>
                            <input
                                type="number"
                                inputMode="numeric"
                                min="0"
                                max="600"
                                value={skipIntroSeconds}
                                onChange={(e) => setSkipIntroSeconds(parseInt(e.target.value) || 0)}
                                className="w-16 px-2 py-1 text-sm text-center bg-white/10 border border-white/20 rounded-[var(--radius-2xl)] text-white focus:outline-none focus:border-[var(--accent-color)] no-spinner"
                                onClick={(e) => e.stopPropagation()}
                            />
                            <span className="text-xs text-white/70">秒</span>
                        </div>
                    )}
                </div>

                {/* Skip Outro Switch */}
                <div className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-sm text-white">
                            <Icons.Rewind size={18} />
                            <span>跳过片尾</span>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setAutoSkipOutro(!autoSkipOutro);
                            }}
                            className={`relative w-10 h-6 rounded-full transition-colors cursor-pointer ${autoSkipOutro ? 'bg-[var(--accent-color)]' : 'bg-white/20'
                                }`}
                            aria-checked={autoSkipOutro}
                            role="switch"
                            style={{ WebkitTapHighlightColor: 'transparent' }}
                        >
                            <span
                                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${autoSkipOutro ? 'translate-x-4' : 'translate-x-0'
                                    }`}
                            />
                        </button>
                    </div>
                    {/* Expandable Input */}
                    {autoSkipOutro && (
                        <div className="mt-2 ml-7 flex items-center gap-2">
                            <span className="text-xs text-white/70">剩余:</span>
                            <input
                                type="number"
                                inputMode="numeric"
                                min="0"
                                max="600"
                                value={skipOutroSeconds}
                                onChange={(e) => setSkipOutroSeconds(parseInt(e.target.value) || 0)}
                                className="w-16 px-2 py-1 text-sm text-center bg-white/10 border border-white/20 rounded-[var(--radius-2xl)] text-white focus:outline-none focus:border-[var(--accent-color)] no-spinner"
                                onClick={(e) => e.stopPropagation()}
                            />
                            <span className="text-xs text-white/70">秒</span>
                        </div>
                    )}
                </div>

                <div className="h-px bg-white/10 my-1" />

                {/* Volume Option */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleVolumeMenu();
                    }}
                    className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/20 flex items-center gap-3 transition-all touch-manipulation cursor-pointer"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                    {isMuted || volume === 0 ? <Icons.VolumeX size={18} /> : <Icons.Volume2 size={18} />}
                    <span>音量</span>
                </button>

                {/* Speed Option */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleSpeedMenu();
                    }}
                    className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/20 flex items-center gap-3 transition-all touch-manipulation cursor-pointer"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>速度 {playbackRate}x</span>
                </button>

                {/* PiP Option */}
                {isPiPSupported && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onTogglePiP();
                        }}
                        className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/20 flex items-center gap-3 transition-all touch-manipulation cursor-pointer"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                        <Icons.PictureInPicture size={18} />
                        <span>画中画</span>
                    </button>
                )}
            </div>
        </div>
    );
}
