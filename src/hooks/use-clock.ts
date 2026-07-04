'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Clock Hook - Precise time updates synchronized to the second
 * Uses requestAnimationFrame for smooth updates
 * Recalculates from Date.now() to prevent drift
 */
export function useClock() {
  const [now, setNow] = useState<Date>(() => new Date());
  const rafRef = useRef<number>(0);
  const lastSecondRef = useRef<number>(-1);

  useEffect(() => {
    const tick = () => {
      const currentDate = new Date();
      const currentSecond = currentDate.getSeconds();

      if (currentSecond !== lastSecondRef.current) {
        lastSecondRef.current = currentSecond;
        setNow(currentDate);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    // Start the animation frame loop - the first tick will set the state
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Handle visibility change (backgrounding)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        const currentDate = new Date();
        lastSecondRef.current = currentDate.getSeconds();
        setNow(currentDate);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  return now;
}

/**
 * Sub-second precision hook for smooth analog clock hand
 * Updates every animation frame for sweeping second hand
 */
export function useSmoothClock() {
  const [now, setNow] = useState<Date>(() => new Date());
  const [ms, setMs] = useState<number>(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const tick = () => {
      const currentDate = new Date();
      setNow(currentDate);
      setMs(currentDate.getMilliseconds());
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Handle visibility change
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        const d = new Date();
        setNow(d);
        setMs(d.getMilliseconds());
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  return { now, ms };
}
