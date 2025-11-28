import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface UseHlsPlayerProps {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    src: string;
    autoPlay?: boolean;
    onAutoPlayPrevented?: (error: Error) => void;
}

export function useHlsPlayer({
    videoRef,
    src,
    autoPlay = false,
    onAutoPlayPrevented
}: UseHlsPlayerProps) {
    const hlsRef = useRef<Hls | null>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !src) return;

        // Cleanup previous HLS instance
        if (hlsRef.current) {
            hlsRef.current.destroy();
            hlsRef.current = null;
        }

        let hls: Hls | null = null;

        // Check if HLS is supported natively (Safari, Mobile Chrome)
        // We prefer native playback if available as it's usually more battery efficient
        const isNativeHlsSupported = video.canPlayType('application/vnd.apple.mpegurl');

        if (Hls.isSupported()) {
            // Use hls.js for browsers without native support (Desktop Chrome, Firefox, Edge)
            // OR if we want to force hls.js for better control (optional, but sticking to native first is safer)

            // Note: Some desktop browsers (like Safari) support native HLS.
            // We usually prefer native, BUT sometimes native implementation is buggy or lacks features.
            // For now, we follow the standard pattern: Native first, then HLS.js.
            // EXCEPT for Chrome on Desktop which reports canPlayType as '' (false).

            if (!isNativeHlsSupported) {
                console.log('[HLS] Initializing hls.js');
                hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                });
                hlsRef.current = hls;

                hls.loadSource(src);
                hls.attachMedia(video);

                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    console.log('[HLS] Manifest parsed');
                    if (autoPlay) {
                        video.play().catch((err) => {
                            console.warn('[HLS] Autoplay prevented:', err);
                            onAutoPlayPrevented?.(err);
                        });
                    }
                });

                hls.on(Hls.Events.ERROR, (event, data) => {
                    if (data.fatal) {
                        switch (data.type) {
                            case Hls.ErrorTypes.NETWORK_ERROR:
                                console.error('[HLS] Network error, trying to recover...');
                                hls?.startLoad();
                                break;
                            case Hls.ErrorTypes.MEDIA_ERROR:
                                console.error('[HLS] Media error, trying to recover...');
                                hls?.recoverMediaError();
                                break;
                            default:
                                console.error('[HLS] Fatal error, cannot recover:', data);
                                hls?.destroy();
                                break;
                        }
                    }
                });
            } else {
                console.log('[HLS] Using native HLS support');
                // Native HLS support
                video.src = src;
            }
        } else if (isNativeHlsSupported) {
            // Fallback for environments where Hls.js is not supported but native is (e.g. iOS without MSE?)
            console.log('[HLS] Using native HLS support (Hls.js not supported)');
            video.src = src;
        } else {
            console.error('[HLS] HLS not supported in this browser');
        }

        return () => {
            if (hls) {
                hls.destroy();
            }
        };
    }, [src, videoRef, autoPlay, onAutoPlayPrevented]);
}
