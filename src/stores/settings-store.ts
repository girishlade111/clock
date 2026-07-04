import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  is24Hour: boolean;
  sweepSecondHand: boolean;
  theme: 'light' | 'dark' | 'system';
  setIs24Hour: (v: boolean) => void;
  setSweepSecondHand: (v: boolean) => void;
  setTheme: (v: 'light' | 'dark' | 'system') => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      is24Hour: false,
      sweepSecondHand: true,
      theme: 'dark',
      setIs24Hour: (v) => set({ is24Hour: v }),
      setSweepSecondHand: (v) => set({ sweepSecondHand: v }),
      setTheme: (v) => set({ theme: v }),
    }),
    {
      name: 'clock-settings',
    }
  )
);
