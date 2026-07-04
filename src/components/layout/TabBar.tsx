'use client';

import { motion } from 'framer-motion';
import { Clock, Globe, Timer, AlarmClock, TimerReset } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TabId = 'clock' | 'world' | 'stopwatch' | 'timer' | 'alarm';

interface TabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'clock', label: 'Clock', icon: Clock },
  { id: 'world', label: 'World', icon: Globe },
  { id: 'stopwatch', label: 'Stopwatch', icon: TimerReset },
  { id: 'timer', label: 'Timer', icon: Timer },
  { id: 'alarm', label: 'Alarm', icon: AlarmClock },
];

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/80 backdrop-blur-xl safe-area-bottom">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'relative flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors',
                'touch-manipulation min-w-[56px]',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              aria-label={tab.label}
              aria-selected={isActive}
              role="tab"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-xl bg-primary/10"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <Icon className="relative z-10 h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="relative z-10 text-[10px]">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
