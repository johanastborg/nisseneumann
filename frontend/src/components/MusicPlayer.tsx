import { useEffect, useState, useRef } from 'react';

// Frequencies for notes
const NOTES: Record<string, number> = {
    E5: 659.25, B4: 493.88, C5: 523.25, D5: 587.33, A4: 440.00,
    G4: 392.00, F4: 349.23, E4: 329.63, C4: 261.63,
    F5: 698.46, G5: 783.99, A5: 880.00, // Added missing high notes
    P: 0
};

// Korobeiniki (Tetris Theme A) Melody
// [Note, Duration (1 = quarter note)]
const MELODY: [string, number][] = [
    ['E5', 1], ['B4', 0.5], ['C5', 0.5], ['D5', 1], ['C5', 0.5], ['B4', 0.5],
    ['A4', 1], ['A4', 0.5], ['C5', 0.5], ['E5', 1], ['D5', 0.5], ['C5', 0.5],
    ['B4', 1.5], ['C5', 0.5], ['D5', 1], ['E5', 1],
    ['C5', 1], ['A4', 1], ['A4', 2],
    ['P', 0.1], // pause
    ['D5', 1.5], ['F5', 0.5], ['A5', 1], ['G5', 0.5], ['F5', 0.5],
    ['E5', 1.5], ['C5', 0.5], ['E5', 1], ['D5', 0.5], ['C5', 0.5],
    ['B4', 1], ['B4', 0.5], ['C5', 0.5], ['D5', 1], ['E5', 1],
    ['C5', 1], ['A4', 1], ['A4', 2]
];

const TEMPO = 140; // BPM

export function MusicPlayer({ playTrigger }: { playTrigger?: boolean }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const nextNoteTimeRef = useRef<number>(0);
    const noteIndexRef = useRef<number>(0);
    const schedulerTimerRef = useRef<number | null>(null);

    useEffect(() => {
        if (playTrigger && !isPlaying) {
            togglePlay(true);
        }
    }, [playTrigger]);

    useEffect(() => {
        return () => {
            if (schedulerTimerRef.current) cancelAnimationFrame(schedulerTimerRef.current);
            if (audioCtxRef.current) audioCtxRef.current.close();
        };
    }, []);

    const initAudio = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            nextNoteTimeRef.current = audioCtxRef.current.currentTime + 0.1;
        }
    };

    const scheduleNote = (freq: number, time: number, duration: number) => {
        const ctx = audioCtxRef.current;
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'square'; // Classic 8-bit sound
        osc.frequency.value = freq;

        osc.connect(gain);
        gain.connect(ctx.destination);

        // Envelope to avoid clicking
        gain.gain.setValueAtTime(0.1, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + duration - 0.05);

        osc.start(time);
        osc.stop(time + duration);
    };

    const scheduler = () => {
        const ctx = audioCtxRef.current;
        if (!ctx) return;

        while (nextNoteTimeRef.current < ctx.currentTime + 0.1) {
            const [noteName, beatLength] = MELODY[noteIndexRef.current];
            const duration = (beatLength * 60) / TEMPO;

            if (noteName !== 'P') {
                scheduleNote(NOTES[noteName], nextNoteTimeRef.current, duration);
            }

            nextNoteTimeRef.current += duration;
            noteIndexRef.current = (noteIndexRef.current + 1) % MELODY.length;
        }
        schedulerTimerRef.current = requestAnimationFrame(scheduler);
    };

    const togglePlay = async (forceStart = false) => {
        if (isPlaying && !forceStart) {
            setIsPlaying(false);
            if (schedulerTimerRef.current) cancelAnimationFrame(schedulerTimerRef.current);
            if (audioCtxRef.current) await audioCtxRef.current.suspend();
        } else {
            if (!isPlaying || forceStart) {
                initAudio();

                // Ensure time sync when resuming
                if (audioCtxRef.current) {
                    if (audioCtxRef.current.state === 'suspended') {
                        await audioCtxRef.current.resume();
                        // Reset next note time to now so we don't fast-forward through missed scheduling windows
                        nextNoteTimeRef.current = audioCtxRef.current.currentTime + 0.1;
                    }
                }

                if (!isPlaying) {
                    setIsPlaying(true);
                    scheduler();
                }
            }
        }
    };

    return (
        <button
            onClick={() => togglePlay()}
            style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                padding: '10px 15px',
                background: isPlaying ? '#ff0055' : '#444',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                zIndex: 100,
                fontFamily: 'monospace'
            }}
        >
            {isPlaying ? '🔇 Stop Music' : '🎵 Play 8-Bit Music'}
        </button>
    );
}
