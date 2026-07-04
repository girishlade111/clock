'use client';

import { useTimer } from '@/hooks/use-timer';
import { formatTimer } from '@/lib/time-utils';
import { Play, Pause, RotateCcw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useCallback, useEffect, useRef } from 'react';

const PRESETS = [
  { label: '1m', ms: 60_000 },
  { label: '5m', ms: 300_000 },
  { label: '10m', ms: 600_000 },
  { label: '15m', ms: 900_000 },
  { label: '30m', ms: 1_800_000 },
  { label: '1h', ms: 3_600_000 },
];

export function TimerModule() {
  const { remaining, progress, status, start, pause, resume, reset, addTime, registerOnComplete } = useTimer();
  const [showComplete, setShowComplete] = useState(false);
  const [setupHours, setSetupHours] = useState(0);
  const [setupMinutes, setSetupMinutes] = useState(5);
  const [setupSeconds, setSetupSeconds] = useState(0);
  const onCompleteRef = useRef<(() => void) | null>(null);

  const playAlarmSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const playBeep = (time: number) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain); gain.connect(audioContext.destination);
        osc.frequency.value = 880; osc.type = 'sine';
        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);
        osc.start(time); osc.stop(time + 0.3);
      };
      const now = audioContext.currentTime;
      playBeep(now); playBeep(now + 0.5); playBeep(now + 1.0);
    } catch (e) { console.error('Audio failed:', e); }
  }, []);

  useEffect(() => {
    onCompleteRef.current = () => { setShowComplete(true); playAlarmSound(); };
  }, [playAlarmSound]);

  useEffect(() => { registerOnComplete(() => { onCompleteRef.current?.(); }); }, [registerOnComplete]);

  const handleStart = useCallback(() => {
    const totalMs = (setupHours * 3600 + setupMinutes * 60 + setupSeconds) * 1000;
    if (totalMs <= 0) return;
    start(totalMs);
  }, [setupHours, setupMinutes, setupSeconds, start]);

  const handleAddMinute = useCallback(() => { addTime(60_000); }, [addTime]);

  const isIdle = status === 'idle';
  const isRunning = status === 'running';
  const size = 260;
  const center = size / 2;
  const radius = size / 2 - 15;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-6 px-4 pt-8 pb-4">
      <h1 className="self-start text-lg font-semibold text-foreground">Timer</h1>
      {isIdle ? (
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            <TimeWheel value={setupHours} onChange={setSetupHours} max={23} label="Hours" />
            <span className="text-3xl font-bold text-muted-foreground">:</span>
            <TimeWheel value={setupMinutes} onChange={setSetupMinutes} max={59} label="Minutes" />
            <span className="text-3xl font-bold text-muted-foreground">:</span>
            <TimeWheel value={setupSeconds} onChange={setSetupSeconds} max={59} label="Seconds" />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {PRESETS.map((p) => (
              <Button key={p.label} variant="outline" size="sm" onClick={() => { setSetupHours(Math.floor(p.ms / 3600000)); setSetupMinutes(Math.floor((p.ms % 3600000) / 60000)); setSetupSeconds(0); }} className="rounded-full px-4">{p.label}</Button>
            ))}
          </div>
          <Button onClick={handleStart} size="lg" disabled={(setupHours * 3600 + setupMinutes * 60 + setupSeconds) === 0} className="h-14 w-14 rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 disabled:opacity-40" aria-label="Start timer">
            <Play className="h-6 w-6 ml-0.5" fill="currentColor" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
              <circle cx={center} cy={center} r={radius} className="stroke-muted/30" strokeWidth="8" fill="none" />
              <circle cx={center} cy={center} r={radius} className="stroke-emerald-500 transition-all duration-300" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-5xl font-bold tracking-tight text-foreground">{formatTimer(remaining)}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={reset} size="lg" variant="outline" className="h-14 w-14 rounded-full border-2" aria-label="Reset"><RotateCcw className="h-5 w-5" /></Button>
            <Button onClick={isRunning ? pause : resume} size="lg" className={`h-14 w-14 rounded-full shadow-lg ${isRunning ? 'bg-amber-600 text-white shadow-amber-600/30 hover:bg-amber-700' : 'bg-emerald-600 text-white shadow-emerald-600/30 hover:bg-emerald-700'}`} aria-label={isRunning ? 'Pause' : 'Resume'}>
              {isRunning ? <Pause className="h-6 w-6" fill="currentColor" /> : <Play className="h-6 w-6 ml-0.5" fill="currentColor" />}
            </Button>
            <Button onClick={handleAddMinute} size="lg" variant="outline" className="h-14 w-14 rounded-full border-2" aria-label="Add 1 minute"><Plus className="h-5 w-5" /></Button>
          </div>
        </div>
      )}
      {showComplete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-6 p-8">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/20 animate-pulse">
              <span className="text-5xl">⏰</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground">Timer Complete!</h2>
            <p className="text-muted-foreground">Your countdown has finished</p>
            <div className="flex gap-4">
              <Button onClick={() => { setShowComplete(false); reset(); }} size="lg" variant="outline" className="rounded-full px-8">Stop</Button>
              <Button onClick={() => { setShowComplete(false); handleAddMinute(); }} size="lg" className="rounded-full bg-emerald-600 px-8 text-white hover:bg-emerald-700">+1 Minute</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TimeWheel({ value, onChange, max, label }: { value: number; onChange: (v: number) => void; max: number; label: string; }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <button onClick={() => onChange(value >= max ? 0 : value + 1)} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground" aria-label={`Increment ${label}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
      </button>
      <div className="flex h-16 w-20 items-center justify-center rounded-xl bg-card border border-border">
        <span className="font-mono text-4xl font-bold text-foreground">{String(value).padStart(2, '0')}</span>
      </div>
      <button onClick={() => onChange(value <= 0 ? max : value - 1)} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground" aria-label={`Decrement ${label}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </button>
      <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
    </div>
  );
}
