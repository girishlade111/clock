'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useAlarmStore, AlarmData } from '@/stores/alarm-store';

/**
 * Alarm Hook - Manages alarm checking and persistence
 * Uses 10-second interval to reduce API load
 */
export function useAlarms() {
  const store = useAlarmStore();
  const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const loadedRef = useRef(false);

  // Load alarms from API on mount
  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    
    const loadAlarms = async () => {
      store.setLoading(true);
      try {
        const res = await fetch('/api/alarms');
        if (res.ok) {
          const data = await res.json();
          const alarms: AlarmData[] = data.map((a: Record<string, unknown>) => ({
            ...a,
            repeat: a.repeat as AlarmData['repeat'],
            customDays: typeof a.customDays === 'string' ? JSON.parse(a.customDays as string) : (a.customDays as number[]),
          }));
          store.setAlarms(alarms);
        }
      } catch (err) {
        console.error('Failed to load alarms:', err);
      } finally {
        store.setLoading(false);
      }
    };
    loadAlarms();
  }, [store]);

  // Check alarms every 10 seconds (reduced from 1s for performance)
  useEffect(() => {
    checkIntervalRef.current = setInterval(() => {
      store.checkAlarms();
    }, 10000);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [store]);

  const saveAlarm = useCallback(async (alarm: Omit<AlarmData, 'id'>) => {
    try {
      const res = await fetch('/api/alarms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...alarm,
          customDays: JSON.stringify(alarm.customDays),
        }),
      });
      if (res.ok) {
        const saved = await res.json();
        const alarmData: AlarmData = {
          ...saved,
          repeat: saved.repeat as AlarmData['repeat'],
          customDays: typeof saved.customDays === 'string' ? JSON.parse(saved.customDays) : saved.customDays,
        };
        store.addAlarm(alarmData);
        return alarmData;
      }
    } catch (err) {
      console.error('Failed to save alarm:', err);
    }
    return null;
  }, [store]);

  const updateAlarm = useCallback(async (id: string, updates: Partial<AlarmData>) => {
    try {
      const res = await fetch(`/api/alarms?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updates,
          customDays: updates.customDays ? JSON.stringify(updates.customDays) : undefined,
        }),
      });
      if (res.ok) {
        store.updateAlarm(id, updates);
      }
    } catch (err) {
      console.error('Failed to update alarm:', err);
    }
  }, [store]);

  const deleteAlarm = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/alarms?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        store.removeAlarm(id);
      }
    } catch (err) {
      console.error('Failed to delete alarm:', err);
    }
  }, [store]);

  const toggleAlarm = useCallback(async (id: string) => {
    const alarm = store.alarms.find(a => a.id === id);
    if (!alarm) return;
    const newEnabled = !alarm.enabled;
    store.toggleAlarm(id);
    try {
      await fetch(`/api/alarms?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: newEnabled }),
      });
    } catch (err) {
      console.error('Failed to toggle alarm:', err);
      store.toggleAlarm(id);
    }
  }, [store]);

  return {
    alarms: store.alarms,
    firingAlarm: store.firingAlarm,
    isLoading: store.isLoading,
    saveAlarm,
    updateAlarm,
    deleteAlarm,
    toggleAlarm,
    snoozeAlarm: store.snoozeAlarm,
    dismissAlarm: store.dismissAlarm,
  };
}
