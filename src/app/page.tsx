'use client';

import { useState } from 'react';
import { TabBar, type TabId } from '@/components/layout/TabBar';
import { ClockModule } from '@/components/clock/ClockModule';
import { WorldClockModule } from '@/components/world-clock/WorldClockModule';
import { StopwatchModule } from '@/components/stopwatch/StopwatchModule';
import { TimerModule } from '@/components/timer/TimerModule';
import { AlarmModule } from '@/components/alarm/AlarmModule';

const modules: Record<TabId, React.ComponentType> = {
  clock: ClockModule,
  world: WorldClockModule,
  stopwatch: StopwatchModule,
  timer: TimerModule,
  alarm: AlarmModule,
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabId>('clock');
  const ActiveModule = modules[activeTab];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="mx-auto max-w-lg">
          <ActiveModule key={activeTab} />
        </div>
      </main>
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
