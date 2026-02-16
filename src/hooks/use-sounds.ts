"use client";

import { useCallback, useRef } from "react";

// Sound effect URLs from freesound.org (royalty-free mechanical keyboard sounds)
const PRESS_SOUND_URL = "https://cdn.freesound.org/previews/256/256113_4486188-lq.mp3";
const RELEASE_SOUND_URL = "https://cdn.freesound.org/previews/566/566434_11861866-lq.mp3";

export function useSounds() {
    const pressAudioRef = useRef<HTMLAudioElement | null>(null);
    const releaseAudioRef = useRef<HTMLAudioElement | null>(null);

    const initAudio = useCallback(() => {
        if (typeof window === "undefined") return;

        if (!pressAudioRef.current) {
            pressAudioRef.current = new Audio(PRESS_SOUND_URL);
            pressAudioRef.current.volume = 0.3;
        }
        if (!releaseAudioRef.current) {
            releaseAudioRef.current = new Audio(RELEASE_SOUND_URL);
            releaseAudioRef.current.volume = 0.2;
        }
    }, []);

    const playPressSound = useCallback(() => {
        initAudio();
        if (pressAudioRef.current) {
            pressAudioRef.current.currentTime = 0;
            pressAudioRef.current.play().catch(() => {
                // Audio play failed - usually due to autoplay policy
            });
        }
    }, [initAudio]);

    const playReleaseSound = useCallback(() => {
        initAudio();
        if (releaseAudioRef.current) {
            releaseAudioRef.current.currentTime = 0;
            releaseAudioRef.current.play().catch(() => {
                // Audio play failed
            });
        }
    }, [initAudio]);

    return {
        playPressSound,
        playReleaseSound,
    };
}
