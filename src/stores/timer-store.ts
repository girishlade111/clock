import { create } from 'zustand';

/**
 * Timer Store - Drift-free countdown implementation
 * 
 * CRITICAL: We store the end timestamp (Date.now() + duration),
 * NOT a decrementing counter. Remaining time is always:
 * endTime - Date.now()
 * This prevents drift and handles backgrounding correctly.
 */

interface TimerState {
  status: 'idle' | 'running' | 'paused' | 'complete';
  endTime: number;           // Date.now() when timer should complete
  remainingAtPause: number;  // Remaining ms when paused
  totalDuration: number;     // Original duration in ms for progress calculation
  lastTick: number;          // For UI update scheduling
  
  // Computed
  getRemaining: () => number;
  getProgress: () => number; // 0 to 1 (1 = full, 0 = complete)
  
  // Actions
  start: (durationMs: number) => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  addTime: (ms: number) => void;
  tick: () => void; // Force a re-render update
}

export const useTimerStore = create<TimerState>()(
  (set, get) => ({
    status: 'idle',
    endTime: 0,
    remainingAtPause: 0,
    totalDuration: 0,
    lastTick: 0,

    getRemaining: () => {
      const { status, endTime, remainingAtPause } = get();
      if (status === 'idle') return 0;
      if (status === 'complete') return 0;
      if (status === 'paused') return remainingAtPause;
      const remaining = endTime - Date.now();
      if (remaining <= 0) {
        // Timer has completed
        set({ status: 'complete' });
        return 0;
      }
      return remaining;
    },

    getProgress: () => {
      const { status, totalDuration } = get();
      if (status === 'idle') return 1;
      if (status === 'complete') return 0;
      const remaining = get().getRemaining();
      if (totalDuration <= 0) return 0;
      return remaining / totalDuration;
    },

    start: (durationMs: number) => {
      set({
        status: 'running',
        endTime: Date.now() + durationMs,
        totalDuration: durationMs,
        remainingAtPause: 0,
        lastTick: Date.now(),
      });
    },

    pause: () => {
      const { status, endTime } = get();
      if (status !== 'running') return;
      const remaining = Math.max(0, endTime - Date.now());
      set({
        status: 'paused',
        remainingAtPause: remaining,
      });
    },

    resume: () => {
      const { status, remainingAtPause } = get();
      if (status !== 'paused') return;
      set({
        status: 'running',
        endTime: Date.now() + remainingAtPause,
        lastTick: Date.now(),
      });
    },

    reset: () => {
      set({
        status: 'idle',
        endTime: 0,
        remainingAtPause: 0,
        totalDuration: 0,
        lastTick: 0,
      });
    },

    addTime: (ms: number) => {
      const { status, endTime, remainingAtPause, totalDuration } = get();
      if (status === 'running') {
        set({
          endTime: endTime + ms,
          totalDuration: totalDuration + ms,
        });
      } else if (status === 'paused') {
        set({
          remainingAtPause: remainingAtPause + ms,
          totalDuration: totalDuration + ms,
        });
      } else if (status === 'complete') {
        // Restart with the added time
        set({
          status: 'running',
          endTime: Date.now() + ms,
          totalDuration: ms,
          lastTick: Date.now(),
        });
      }
    },

    tick: () => {
      set({ lastTick: Date.now() });
    },
  })
);
