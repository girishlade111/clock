import { create } from 'zustand';
import { shouldAlarmFireToday } from '@/lib/time-utils';

export interface AlarmData {
  id: string;
  label: string;
  hour: number;
  minute: number;
  second: number;
  enabled: boolean;
  repeat: 'once' | 'daily' | 'weekdays' | 'weekends' | 'custom';
  customDays: number[];
  snoozeMinutes: number;
  sound: string;
}

interface FiringAlarm {
  alarmId: string;
  label: string;
  firedAt: number;
  isSnoozed: boolean;
  snoozeUntil: number | null;
}

interface AlarmState {
  alarms: AlarmData[];
  firingAlarm: FiringAlarm | null;
  isLoading: boolean;
  
  setAlarms: (alarms: AlarmData[]) => void;
  addAlarm: (alarm: AlarmData) => void;
  updateAlarm: (id: string, updates: Partial<AlarmData>) => void;
  removeAlarm: (id: string) => void;
  toggleAlarm: (id: string) => void;
  setFiringAlarm: (alarm: FiringAlarm | null) => void;
  snoozeAlarm: () => void;
  dismissAlarm: () => void;
  setLoading: (loading: boolean) => void;
  checkAlarms: () => void;
}

export const useAlarmStore = create<AlarmState>()(
  (set, get) => ({
    alarms: [],
    firingAlarm: null,
    isLoading: false,

    setAlarms: (alarms) => set({ alarms }),
    
    addAlarm: (alarm) =>
      set((state) => ({ alarms: [...state.alarms, alarm] })),

    updateAlarm: (id, updates) =>
      set((state) => ({
        alarms: state.alarms.map((a) =>
          a.id === id ? { ...a, ...updates } : a
        ),
      })),

    removeAlarm: (id) =>
      set((state) => ({
        alarms: state.alarms.filter((a) => a.id !== id),
      })),

    toggleAlarm: (id) =>
      set((state) => ({
        alarms: state.alarms.map((a) =>
          a.id === id ? { ...a, enabled: !a.enabled } : a
        ),
      })),

    setFiringAlarm: (alarm) => set({ firingAlarm: alarm }),

    snoozeAlarm: () => {
      const { firingAlarm } = get();
      if (!firingAlarm) return;
      const snoozeUntil = Date.now() + (firingAlarm.snoozeMinutes || 5) * 60 * 1000;
      set({
        firingAlarm: {
          ...firingAlarm,
          isSnoozed: true,
          snoozeUntil,
        },
      });
    },

    dismissAlarm: () => {
      set({ firingAlarm: null });
    },

    setLoading: (loading) => set({ isLoading: loading }),

    checkAlarms: () => {
      const { alarms, firingAlarm } = get();
      if (firingAlarm?.isSnoozed) {
        if (firingAlarm.snoozeUntil && Date.now() >= firingAlarm.snoozeUntil) {
          set({
            firingAlarm: {
              ...firingAlarm,
              isSnoozed: false,
              snoozeUntil: null,
            },
          });
        }
        return;
      }

      if (firingAlarm) return;

      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentSecond = now.getSeconds();
      const currentDay = now.getDay();

      for (const alarm of alarms) {
        if (!alarm.enabled) continue;
        if (alarm.hour !== currentHour || alarm.minute !== currentMinute) continue;
        if (currentSecond > 2) continue;

        if (alarm.repeat !== 'once') {
          if (!shouldAlarmFireToday(alarm.repeat, alarm.customDays, currentDay)) continue;
        }

        set({
          firingAlarm: {
            alarmId: alarm.id,
            label: alarm.label,
            firedAt: Date.now(),
            isSnoozed: false,
            snoozeUntil: null,
          },
        });

        if (alarm.repeat === 'once') {
          get().toggleAlarm(alarm.id);
        }
        break;
      }
    },
  })
);
