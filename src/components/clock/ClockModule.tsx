'use client';

import { useClock, useSmoothClock } from '@/hooks/use-clock';
import { useSettingsStore } from '@/stores/settings-store';
import { formatDigitalTime, formatDate } from '@/lib/time-utils';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { useSyncExternalStore } from 'react';

// Hydration-safe mount detection
const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function ClockModule() {
  const mounted = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);

  return (
    <div className="flex flex-col items-center gap-6 px-4 pt-8 pb-4">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">Clock</h1>
        <ThemeToggle />
      </div>
      {mounted ? (
        <>
          <AnalogClock />
          <DigitalClock />
        </>
      ) : (
        <div className="flex flex-col items-center gap-6">
          <div className="h-[260px] w-[260px] rounded-full bg-muted/50 animate-pulse" />
          <div className="h-16 w-48 rounded-lg bg-muted/50 animate-pulse" />
        </div>
      )}
    </div>
  );
}

function DigitalClock() {
  const now = useClock();
  const is24Hour = useSettingsStore((s) => s.is24Hour);
  const setIs24Hour = useSettingsStore((s) => s.setIs24Hour);

  const { time, period } = formatDigitalTime(now, is24Hour);
  const dateStr = formatDate(now);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-5xl font-bold tracking-tight text-foreground sm:text-6xl" suppressHydrationWarning>
          {time}
        </span>
        {period && (
          <span className="text-xl font-medium text-muted-foreground" suppressHydrationWarning>{period}</span>
        )}
      </div>
      <p className="text-sm text-muted-foreground" suppressHydrationWarning>{dateStr}</p>
      <button
        onClick={() => setIs24Hour(!is24Hour)}
        className="mt-2 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        aria-label={`Switch to ${is24Hour ? '12-hour' : '24-hour'} format`}
      >
        {is24Hour ? '24H' : '12H'} · Tap to switch
      </button>
    </div>
  );
}

function AnalogClock() {
  const { now, ms } = useSmoothClock();
  const sweepSecondHand = useSettingsStore((s) => s.sweepSecondHand);

  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const milliseconds = ms;

  const secondAngle = sweepSecondHand
    ? (seconds + milliseconds / 1000) * 6
    : seconds * 6;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const hourAngle = (hours + minutes / 60) * 30;

  const size = 260;
  const center = size / 2;
  const radius = size / 2 - 10;

  return (
    <div className="relative" suppressHydrationWarning>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="drop-shadow-lg"
        role="img"
        aria-label={`Analog clock showing ${hours}:${String(minutes).padStart(2, '0')}`}
      >
        <circle cx={center} cy={center} r={radius} className="fill-card stroke-border" strokeWidth="2" />
        
        {/* Hour markers */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const isQuarter = i % 3 === 0;
          const innerR = isQuarter ? radius - 22 : radius - 16;
          const outerR = radius - 6;
          return (
            <line
              key={i}
              x1={center + Math.sin(angle) * innerR}
              y1={center - Math.cos(angle) * innerR}
              x2={center + Math.sin(angle) * outerR}
              y2={center - Math.cos(angle) * outerR}
              className={isQuarter ? 'stroke-foreground' : 'stroke-muted-foreground'}
              strokeWidth={isQuarter ? 3 : 1.5}
              strokeLinecap="round"
            />
          );
        })}

        {/* Hour numbers */}
        {Array.from({ length: 12 }).map((_, i) => {
          const num = i === 0 ? 12 : i;
          const angle = (i * 30 * Math.PI) / 180;
          const numR = radius - 36;
          return (
            <text
              key={`n${i}`}
              x={center + Math.sin(angle) * numR}
              y={center - Math.cos(angle) * numR}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-foreground"
              style={{ fontSize: '14px', fontWeight: 600 }}
            >
              {num}
            </text>
          );
        })}

        {/* Hour hand */}
        <line
          x1={center}
          y1={center}
          x2={center + Math.sin((hourAngle * Math.PI) / 180) * (radius * 0.5)}
          y2={center - Math.cos((hourAngle * Math.PI) / 180) * (radius * 0.5)}
          className="stroke-foreground"
          strokeWidth={5}
          strokeLinecap="round"
        />
        {/* Minute hand */}
        <line
          x1={center}
          y1={center}
          x2={center + Math.sin((minuteAngle * Math.PI) / 180) * (radius * 0.7)}
          y2={center - Math.cos((minuteAngle * Math.PI) / 180) * (radius * 0.7)}
          className="stroke-foreground"
          strokeWidth={3}
          strokeLinecap="round"
        />
        {/* Second hand */}
        <line
          x1={center - Math.sin((secondAngle * Math.PI) / 180) * 20}
          y1={center + Math.cos((secondAngle * Math.PI) / 180) * 20}
          x2={center + Math.sin((secondAngle * Math.PI) / 180) * (radius * 0.82)}
          y2={center - Math.cos((secondAngle * Math.PI) / 180) * (radius * 0.82)}
          className="stroke-red-500"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        <circle cx={center} cy={center} r={4} className="fill-red-500" />
        <circle cx={center} cy={center} r={2} className="fill-card" />
      </svg>
    </div>
  );
}
