'use client';

import { useStopwatch } from '@/hooks/use-stopwatch';
import { formatStopwatch } from '@/lib/time-utils';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

export function StopwatchModule() {
  const { elapsed, status, laps, start, pause, resume, reset, lap } = useStopwatch();
  const { fastestLapIndex, slowestLapIndex } = useMemo(() => {
    if (laps.length < 2) return { fastestLapIndex: -1, slowestLapIndex: -1 };
    let fastest = Infinity, slowest = -Infinity, fi = -1, si = -1;
    laps.forEach((l, i) => {
      if (l.lapTime < fastest) { fastest = l.lapTime; fi = i; }
      if (l.lapTime > slowest) { slowest = l.lapTime; si = i; }
    });
    return { fastestLapIndex: fi, slowestLapIndex: si };
  }, [laps]);

  const isRunning = status === 'running';
  const isPaused = status === 'paused';
  const isStopped = status === 'stopped';

  return (
    <div className="flex flex-col items-center gap-6 px-4 pt-8 pb-4">
      <h1 className="self-start text-lg font-semibold text-foreground">Stopwatch</h1>
      <div className="flex flex-col items-center gap-2">
        <span className="font-mono text-6xl font-bold tracking-tight text-foreground sm:text-7xl">
          {formatStopwatch(elapsed)}
        </span>
      </div>
      <div className="flex items-center gap-4">
        {isStopped ? (
          <>
            <div className="h-14 w-14" />
            <Button onClick={start} size="lg" className="h-14 w-14 rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700" aria-label="Start stopwatch">
              <Play className="h-6 w-6 ml-0.5" fill="currentColor" />
            </Button>
            <div className="h-14 w-14" />
          </>
        ) : (
          <>
            <Button onClick={reset} size="lg" variant="outline" className="h-14 w-14 rounded-full border-2" aria-label="Reset stopwatch">
              <RotateCcw className="h-5 w-5" />
            </Button>
            <Button onClick={isRunning ? pause : resume} size="lg" className={cn("h-14 w-14 rounded-full shadow-lg", isRunning ? "bg-amber-600 text-white shadow-amber-600/30 hover:bg-amber-700" : "bg-emerald-600 text-white shadow-emerald-600/30 hover:bg-emerald-700")} aria-label={isRunning ? 'Pause' : 'Resume'}>
              {isRunning ? <Pause className="h-6 w-6" fill="currentColor" /> : <Play className="h-6 w-6 ml-0.5" fill="currentColor" />}
            </Button>
            <Button onClick={lap} size="lg" variant="outline" disabled={!isRunning} className="h-14 w-14 rounded-full border-2 disabled:opacity-40" aria-label="Record lap">
              <Flag className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>
      {laps.length > 0 && (
        <div className="w-full max-w-md">
          <div className="mb-2 flex items-center justify-between px-1 text-xs font-medium text-muted-foreground">
            <span>Lap</span><span>Lap Time</span><span>Split Time</span>
          </div>
          <ScrollArea className="h-[280px]">
            <div className="flex flex-col gap-1">
              {[...laps].reverse().map((l, reverseIndex) => {
                const index = laps.length - 1 - reverseIndex;
                const isFastest = index === fastestLapIndex;
                const isSlowest = index === slowestLapIndex;
                return (
                  <div key={index} className={cn("flex items-center justify-between rounded-lg px-3 py-2 text-sm", isFastest ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : isSlowest ? "bg-red-500/10 text-red-600 dark:text-red-400" : "text-foreground")}>
                    <span className="w-12 text-left font-medium">{isFastest && '🏆 '}{isSlowest && '🐌 '}#{index + 1}</span>
                    <span className="font-mono">{formatStopwatch(l.lapTime)}</span>
                    <span className="font-mono text-muted-foreground">{formatStopwatch(l.splitTime)}</span>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
