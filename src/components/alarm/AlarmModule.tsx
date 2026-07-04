'use client';

import { useAlarms } from '@/hooks/use-alarms';
import { type AlarmData } from '@/stores/alarm-store';
import { DAYS_OF_WEEK } from '@/lib/time-utils';
import { Plus, Trash2, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

const REPEAT_OPTIONS = [
  { value: 'once', label: 'Once' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekdays', label: 'Weekdays' },
  { value: 'weekends', label: 'Weekends' },
  { value: 'custom', label: 'Custom' },
] as const;

export function AlarmModule() {
  const { alarms, firingAlarm, isLoading, saveAlarm, deleteAlarm, toggleAlarm, snoozeAlarm, dismissAlarm } = useAlarms();
  const [showCreate, setShowCreate] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState<AlarmData | null>(null);

  const handleSave = useCallback(async (data: Omit<AlarmData, 'id'>) => {
    await saveAlarm(data);
    setShowCreate(false);
    setEditingAlarm(null);
  }, [saveAlarm]);

  return (
    <div className="flex flex-col gap-4 px-4 pt-8 pb-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">Alarms</h1>
        <Dialog open={showCreate || !!editingAlarm} onOpenChange={(open) => { if (!open) { setShowCreate(false); setEditingAlarm(null); } }}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5" onClick={() => setShowCreate(true)}>
              <Plus className="h-4 w-4" />Add Alarm
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogTitle>{editingAlarm ? 'Edit Alarm' : 'New Alarm'}</DialogTitle>
            <AlarmForm initialData={editingAlarm} onSave={handleSave} onCancel={() => { setShowCreate(false); setEditingAlarm(null); }} />
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
        </div>
      ) : alarms.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <Bell className="h-16 w-16 text-muted-foreground/30" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">No alarms set</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Create an alarm to wake up on time</p>
          </div>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setShowCreate(true)}>
            <Plus className="h-3.5 w-3.5" />Create your first alarm
          </Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {alarms.map((alarm, index) => (
            <AlarmCard key={alarm.id} alarm={alarm} index={index} onToggle={() => toggleAlarm(alarm.id)} onDelete={() => deleteAlarm(alarm.id)} onEdit={() => setEditingAlarm(alarm)} />
          ))}
        </div>
      )}
      {firingAlarm && !firingAlarm.isSnoozed && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/98">
          <div className="flex flex-col items-center gap-8 p-8">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-amber-500/20 animate-bounce">
              <Bell className="h-14 w-14 text-amber-500" />
            </div>
            <div className="text-center">
              <h2 className="text-4xl font-bold text-foreground">{new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</h2>
              <p className="mt-2 text-lg text-muted-foreground">{firingAlarm.label}</p>
            </div>
            <div className="flex gap-4">
              <Button onClick={snoozeAlarm} size="lg" variant="outline" className="rounded-full px-8 text-lg">Snooze</Button>
              <Button onClick={dismissAlarm} size="lg" className="rounded-full bg-emerald-600 px-8 text-lg text-white hover:bg-emerald-700">Dismiss</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AlarmCard({ alarm, index, onToggle, onDelete, onEdit }: { alarm: AlarmData; index: number; onToggle: () => void; onDelete: () => void; onEdit: () => void; }) {
  const displayHour = alarm.hour % 12 || 12;
  const period = alarm.hour >= 12 ? 'PM' : 'AM';
  const getRepeatLabel = (repeat: string, customDays: number[]) => {
    switch (repeat) {
      case 'once': return 'Once'; case 'daily': return 'Daily'; case 'weekdays': return 'Weekdays'; case 'weekends': return 'Weekends';
      case 'custom': return customDays.map(d => DAYS_OF_WEEK[d]).join(', '); default: return '';
    }
  };

  return (
    <div className={cn("group flex items-center gap-4 rounded-2xl bg-card p-4 border shadow-sm transition-all hover:shadow-md", alarm.enabled ? "border-border" : "border-border/50 opacity-60")} style={{ animationDelay: `${index * 50}ms` }}>
      <button onClick={onEdit} className="flex-1 min-w-0 text-left" aria-label={`Edit alarm: ${alarm.label}`}>
        <div className="flex items-baseline gap-2">
          <span className={cn("font-mono text-3xl font-bold", alarm.enabled ? "text-foreground" : "text-muted-foreground")}>{String(displayHour).padStart(2, '0')}:{String(alarm.minute).padStart(2, '0')}</span>
          <span className={cn("text-sm font-medium", alarm.enabled ? "text-muted-foreground" : "text-muted-foreground/60")}>{period}</span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{alarm.label}</span>
          <span className="text-xs text-muted-foreground/60">·</span>
          <span className="text-xs text-muted-foreground/80">{getRepeatLabel(alarm.repeat, alarm.customDays)}</span>
        </div>
        {alarm.repeat === 'custom' && (
          <div className="mt-1.5 flex gap-1">
            {DAYS_OF_WEEK.map((day, i) => (
              <span key={i} className={cn("flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-medium", alarm.customDays.includes(i) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>{day[0]}</span>
            ))}
          </div>
        )}
      </button>
      <div className="flex items-center gap-2">
        <Switch checked={alarm.enabled} onCheckedChange={onToggle} aria-label={`Toggle alarm ${alarm.label}`} />
        <button onClick={onDelete} className="rounded-full p-2 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100" aria-label={`Delete alarm ${alarm.label}`}>
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function AlarmForm({ initialData, onSave, onCancel }: { initialData: AlarmData | null; onSave: (data: Omit<AlarmData, 'id'>) => void; onCancel: () => void; }) {
  const [hour, setHour] = useState(initialData?.hour ?? 7);
  const [minute, setMinute] = useState(initialData?.minute ?? 0);
  const [label, setLabel] = useState(initialData?.label ?? 'Alarm');
  const [repeat, setRepeat] = useState<AlarmData['repeat']>(initialData?.repeat ?? 'once');
  const [customDays, setCustomDays] = useState<number[]>(initialData?.customDays ?? []);
  const [snoozeMinutes, setSnoozeMinutes] = useState(initialData?.snoozeMinutes ?? 5);

  const displayHour = hour % 12 || 12;
  const period = hour >= 12 ? 'PM' : 'AM';

  return (
    <div className="flex flex-col gap-5 py-2">
      <div className="flex items-center justify-center gap-3">
        <div className="flex flex-col items-center gap-1">
          <button onClick={() => setHour(hour >= 23 ? 0 : hour + 1)} className="rounded-lg p-2 text-muted-foreground hover:bg-accent" aria-label="Increment hour">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
          </button>
          <span className="font-mono text-4xl font-bold">{String(displayHour).padStart(2, '0')}</span>
          <button onClick={() => setHour(hour <= 0 ? 23 : hour - 1)} className="rounded-lg p-2 text-muted-foreground hover:bg-accent" aria-label="Decrement hour">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </button>
        </div>
        <span className="text-3xl font-bold text-muted-foreground">:</span>
        <div className="flex flex-col items-center gap-1">
          <button onClick={() => setMinute(minute >= 59 ? 0 : minute + 1)} className="rounded-lg p-2 text-muted-foreground hover:bg-accent" aria-label="Increment minute">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
          </button>
          <span className="font-mono text-4xl font-bold">{String(minute).padStart(2, '0')}</span>
          <button onClick={() => setMinute(minute <= 0 ? 59 : minute - 1)} className="rounded-lg p-2 text-muted-foreground hover:bg-accent" aria-label="Decrement minute">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </button>
        </div>
        <button onClick={() => setHour(hour >= 12 ? hour - 12 : hour + 12)} className="ml-2 rounded-xl bg-muted px-3 py-2 text-sm font-semibold">{period}</button>
      </div>
      <div className="space-y-2">
        <Label htmlFor="alarm-label">Label</Label>
        <Input id="alarm-label" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Alarm name" />
      </div>
      <div className="space-y-2">
        <Label>Repeat</Label>
        <div className="flex flex-wrap gap-2">
          {REPEAT_OPTIONS.map((option) => (
            <button key={option.value} onClick={() => setRepeat(option.value)} className={cn("rounded-full px-3 py-1.5 text-xs font-medium transition-colors", repeat === option.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent")}>{option.label}</button>
          ))}
        </div>
      </div>
      {repeat === 'custom' && (
        <div className="space-y-2">
          <Label>Days</Label>
          <div className="flex gap-1.5">
            {DAYS_OF_WEEK.map((day, i) => (
              <button key={i} onClick={() => setCustomDays(prev => prev.includes(i) ? prev.filter(d => d !== i) : [...prev, i])} className={cn("flex h-9 w-9 items-center justify-center rounded-full text-xs font-medium transition-colors", customDays.includes(i) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent")}>{day[0]}</button>
            ))}
          </div>
        </div>
      )}
      <div className="space-y-2">
        <Label>Snooze: {snoozeMinutes} minutes</Label>
        <input type="range" min={1} max={15} value={snoozeMinutes} onChange={(e) => setSnoozeMinutes(parseInt(e.target.value))} className="w-full accent-primary" aria-label="Snooze duration" />
      </div>
      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={onCancel} className="flex-1 rounded-full">Cancel</Button>
        <Button onClick={() => onSave({ hour, minute, second: 0, label, repeat, customDays, snoozeMinutes, enabled: initialData?.enabled ?? true, sound: 'default' })} className="flex-1 rounded-full bg-emerald-600 text-white hover:bg-emerald-700">{initialData ? 'Update' : 'Create'}</Button>
      </div>
    </div>
  );
}
