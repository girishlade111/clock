'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useTimerStore } from '@/stores/timer-store';

/**
 * Timer Hook - Drift-free countdown with automatic UI updates
 * 
 * The store calculates remaining time from endTime - Date.now(),
 * so this hook only needs to trigger re-renders at regular intervals.
 */
export function useTimer() {
  const store = useTimerStore();
  const [remaining, setRemaining] = useState(0);
  const [progress, setProgress] = useState(1);
  const rafRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(0);
  const onCompleteRef = useRef<(() => void) | null>(null);
  const prevStatusRef = useRef(store.status);

  // Use a single rAF loop that always runs
  useEffect(() => {
    const update = (timestamp: number) => {
      if (store.status === 'running') {
        if (timestamp - lastUpdateRef.current >= 33) {
          lastUpdateRef.current = timestamp;
          const rem = store.getRemaining();
          const prog = store.getProgress();
          setRemaining(rem);
          setProgress(prog);

          if (rem <= 0 && onCompleteRef.current) {
            onCompleteRef.current();
          }
        }
      } else if (store.status !== prevStatusRef.current) {
        // Status changed, update UI
        prevStatusRef.current = store.status;
        if (store.status === 'paused') {
          setRemaining(store.getRemaining());
          setProgress(store.getProgress());
        } else if (store.status === 'complete') {
          setRemaining(0);
          setProgress(0);
        } else if (store.status === 'idle') {
          setRemaining(0);
          setProgress(1);
        }
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

  // Handle visibility change
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        setRemaining(store.getRemaining());
        setProgress(store.getProgress());
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [store]);

  const registerOnComplete = useCallback((callback: () => void) => {
    onCompleteRef.current = callback;
  }, []);

  return {
    remaining,
    progress,
    status: store.status,
    totalDuration: store.totalDuration,
    start: store.start,
    pause: store.pause,
    resume: store.resume,
    reset: store.reset,
    addTime: store.addTime,
    registerOnComplete,
  };
}
