'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePlayerSettings } from './usePlayerSettings';

interface UseAutoSkipProps {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    currentTime: number;
    duration: number;
    isPlaying: boolean;
    totalEpisodes?: number;
    currentEpisodeIndex?: number;
    onNextEpisode?: () => void;
}

/**
 * Hook to handle auto-skip intro/outro and auto-next episode logic
 * 
 * Skip intro: When currentTime < skipIntroSeconds, seek to skipIntroSeconds
 * Skip outro: When (duration - currentTime) <= skipOutroSeconds, trigger next episode
 * Auto next: When video ends, auto-advance to next episode if enabled
 */
export function useAutoSkip({
    videoRef,
    currentTime,
    duration,
    isPlaying,
    totalEpisodes = 1,
    currentEpisodeIndex = 0,
    onNextEpisode,
}: UseAutoSkipProps) {
    const {
        autoNextEpisode,
        autoSkipIntro,
        skipIntroSeconds,
        autoSkipOutro,
        skipOutroSeconds,
    } = usePlayerSettings();

    // Track if we've already skipped intro for this video session
    const hasSkippedIntroRef = useRef(false);
    // Track if we've triggered outro skip to prevent multiple triggers
    const hasTriggeredOutroSkipRef = useRef(false);
    // Track previous src to reset flags on video change
    const prevSrcRef = useRef<string | null>(null);

    // Reset flags when video source changes
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const currentSrc = video.src;
        if (prevSrcRef.current !== currentSrc) {
            hasSkippedIntroRef.current = false;
            hasTriggeredOutroSkipRef.current = false;
            prevSrcRef.current = currentSrc;
        }
    }, [videoRef]);

    // Check if we can advance to next episode
    const canAdvanceToNext = useCallback(() => {
        return totalEpisodes > 1 && currentEpisodeIndex < totalEpisodes - 1 && onNextEpisode;
    }, [totalEpisodes, currentEpisodeIndex, onNextEpisode]);

    // Validate that duration is ready (not 0, NaN, or Infinity)
    const isDurationValid = useCallback(() => {
        return duration > 0 && !isNaN(duration) && isFinite(duration);
    }, [duration]);

    // Validate current time is valid
    const isTimeValid = useCallback(() => {
        return !isNaN(currentTime) && isFinite(currentTime);
    }, [currentTime]);

    // Handle intro skip
    useEffect(() => {
        if (!autoSkipIntro || skipIntroSeconds <= 0) return;
        if (!isDurationValid() || !isTimeValid()) return;
        if (hasSkippedIntroRef.current) return;

        const video = videoRef.current;
        if (!video) return;

        // Only skip if we're in the intro zone (between 0 and skipIntroSeconds)
        if (currentTime >= 0 && currentTime < skipIntroSeconds && currentTime < duration) {
            // Wait a brief moment to ensure video is ready
            const skipTimeout = setTimeout(() => {
                if (video && video.readyState >= 2) { // HAVE_CURRENT_DATA or better
                    video.currentTime = Math.min(skipIntroSeconds, duration - 1);
                    hasSkippedIntroRef.current = true;
                }
            }, 100);

            return () => clearTimeout(skipTimeout);
        }
    }, [autoSkipIntro, skipIntroSeconds, currentTime, duration, isDurationValid, isTimeValid, videoRef]);

    // Handle outro skip (based on remaining time)
    useEffect(() => {
        if (!autoSkipOutro || skipOutroSeconds <= 0) return;
        if (!isDurationValid() || !isTimeValid()) return;
        if (hasTriggeredOutroSkipRef.current) return;
        if (!isPlaying) return;

        const remainingTime = duration - currentTime;

        // Only trigger if video is actually playing and approaching end
        if (remainingTime > 0 && remainingTime <= skipOutroSeconds && currentTime > 0) {
            hasTriggeredOutroSkipRef.current = true;

            // If we can advance to next episode, do it
            if (autoNextEpisode && canAdvanceToNext()) {
                onNextEpisode?.();
            } else {
                // Otherwise just seek to end to trigger ended event
                const video = videoRef.current;
                if (video) {
                    video.currentTime = duration;
                }
            }
        }
    }, [autoSkipOutro, skipOutroSeconds, currentTime, duration, isPlaying, isDurationValid, isTimeValid, autoNextEpisode, canAdvanceToNext, onNextEpisode, videoRef]);

    // Handle video ended event for auto-next
    const handleVideoEnded = useCallback(() => {
        if (!autoNextEpisode) return;
        if (!canAdvanceToNext()) return;

        // Slight delay to ensure clean transition
        setTimeout(() => {
            onNextEpisode?.();
        }, 100);
    }, [autoNextEpisode, canAdvanceToNext, onNextEpisode]);

    // Attach ended event listener
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        video.addEventListener('ended', handleVideoEnded);
        return () => video.removeEventListener('ended', handleVideoEnded);
    }, [videoRef, handleVideoEnded]);

    return {
        hasSkippedIntro: hasSkippedIntroRef.current,
        hasTriggeredOutroSkip: hasTriggeredOutroSkipRef.current,
    };
}
