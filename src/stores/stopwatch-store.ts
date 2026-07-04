import { create } from 'zustand';

/**
 * Stopwatch Store - Drift-free implementation
 * 
 * CRITICAL: We store timestamps (Date.now()), NOT elapsed counts.
 * Elapsed time is always calculated as: Date.now() - startTimestamp + accumulatedTime
 * This prevents drift from JavaScript event-loop lag.
 */

interface LapData {
  lapTime: number;   // Time for this individual lap (ms)
  splitTime: number;  // Total elapsed time at lap point (ms)
  timestamp: number;  // Date.now() when lap was recorded
}

interface StopwatchState {
  status: 'stopped' | 'running' | 'paused';
  startTimestamp: number;     // Date.now() when last started/resumed
  accumulatedTime: number;   // Total ms accumulated before current run
  laps: LapData[];
  
  // Computed
  getElapsed: () => number;
  
  // Actions
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  lap: () => void;
}

export const useStopwatchStore = create<StopwatchState>()(
  (set, get) => ({
    status: 'stopped',
    startTimestamp: 0,
    accumulatedTime: 0,
    laps: [],

    getElapsed: () => {
      const { status, startTimestamp, accumulatedTime } = get();
      if (status === 'running') {
        return accumulatedTime + (Date.now() - startTimestamp);
      }
      return accumulatedTime;
    },

    start: () => {
      set({
        status: 'running',
        startTimestamp: Date.now(),
        accumulatedTime: 0,
        laps: [],
      });
    },

    pause: () => {
      const { status, startTimestamp, accumulatedTime } = get();
      if (status !== 'running') return;
      set({
        status: 'paused',
        accumulatedTime: accumulatedTime + (Date.now() - startTimestamp),
      });
    },

    resume: () => {
      const { status } = get();
      if (status !== 'paused') return;
      set({
        status: 'running',
        startTimestamp: Date.now(),
      });
    },

    reset: () => {
      set({
        status: 'stopped',
        startTimestamp: 0,
        accumulatedTime: 0,
        laps: [],
      });
    },

    lap: () => {
      const { status, laps } = get();
      if (status !== 'running') return;

      const now = Date.now();
      const elapsed = get().getElapsed();
      const lastSplitTime = laps.length > 0 ? laps[laps.length - 1].splitTime : 0;
      const lapTime = elapsed - lastSplitTime;

      set({
        laps: [
          ...laps,
          {
            lapTime,
            splitTime: elapsed,
            timestamp: now,
          },
        ],
      });
    },
  })
);
