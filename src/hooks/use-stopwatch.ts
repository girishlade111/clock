'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useStopwatchStore } from '@/stores/stopwatch-store';

/**
 * Stopwatch Hook - Drift-free stopwatch with automatic UI updates
 * 
 * The store calculates elapsed time from Date.now() deltas,
 * so this hook only needs to trigger re-renders at regular intervals.
 */
export function useStopwatch() {
  const store = useStopwatchStore();
  const [elapsed, setElapsed] = useState(() => store.getElapsed());
  const rafRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(0);

  // Use a single rAF loop that always updates
  useEffect(() => {
    const update = (timestamp: number) => {
      if (store.status === 'running') {
        // Update at ~60fps when running
        if (timestamp - lastUpdateRef.current >= 16) {
          lastUpdateRef.current = timestamp;
          setElapsed(store.getElapsed());
        }
      } else {
        // When not running, update once per frame check (rare)
        const currentElapsed = store.getElapsed();
        setElapsed(prev => prev !== currentElapsed ? currentElapsed : prev);
      }
      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [store.status, store]);

  // Handle visibility change (backgrounding)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        setElapsed(store.getElapsed());
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [store]);

  return {
    elapsed,
    status: store.status,
    laps: store.laps,
    start: store.start,
    pause: store.pause,
    resume: store.resume,
    reset: store.reset,
    lap: store.lap,
  };
}
