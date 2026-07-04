'use client';

import { useClock } from '@/hooks/use-clock';
import { useWorldClockStore } from '@/stores/world-clock-store';
import { useSettingsStore } from '@/stores/settings-store';
import { formatDigitalTime, getTimezoneOffsetDiff, isDaytime } from '@/lib/time-utils';
import { TIMEZONE_CITIES, searchCities, getLocalTimezone, type TimezoneCity } from '@/lib/timezones';
import { Sun, Moon, Plus, X, Search, MapPin, Globe2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';

export function WorldClockModule() {
  const { cities, addCity, removeCity } = useWorldClockStore();
  const [open, setOpen] = useState(false);
  const now = useClock();
  const is24Hour = useSettingsStore((s) => s.is24Hour);
  const localTimezone = getLocalTimezone();

  return (
    <div className="flex flex-col gap-4 px-4 pt-8 pb-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">World Clock</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              Add City
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogTitle>Add City</DialogTitle>
            <AddCityDialog
              onAdd={(city) => {
                addCity(city);
                setOpen(false);
              }}
              existingTimezones={cities.map((c) => c.timezone)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {cities.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <Globe2 className="h-16 w-16 text-muted-foreground/30" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">No cities added</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Add cities to see their current time</p>
          </div>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setOpen(true)}>
            <Plus className="h-3.5 w-3.5" />
            Add your first city
          </Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {cities.map((city, index) => (
            <WorldCityCard
              key={city.timezone}
              city={city}
              now={now}
              is24Hour={is24Hour}
              localTimezone={localTimezone}
              onRemove={() => removeCity(city.id)}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function WorldCityCard({
  city, now, is24Hour, localTimezone, onRemove, index,
}: {
  city: TimezoneCity; now: Date; is24Hour: boolean; localTimezone: string; onRemove: () => void; index: number;
}) {
  const daytime = isDaytime(city.timezone);
  const offsetDiff = getTimezoneOffsetDiff(city.timezone, localTimezone);
  const timeInCity = new Intl.DateTimeFormat('en-US', {
    timeZone: city.timezone, hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: !is24Hour,
  }).format(now);
  const dateInCity = new Intl.DateTimeFormat('en-US', {
    timeZone: city.timezone, weekday: 'short', month: 'short', day: 'numeric',
  }).format(now);

  return (
    <div
      className="group flex items-center gap-4 rounded-2xl bg-card p-4 border border-border shadow-sm transition-shadow hover:shadow-md"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
        daytime ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
      }`}>
        {daytime ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
          <h3 className="truncate text-sm font-semibold text-foreground">{city.city}</h3>
        </div>
        <p className="text-xs text-muted-foreground">{city.country}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground">{dateInCity}</span>
          <span className="text-xs text-muted-foreground/60">·</span>
          <span className="text-xs text-muted-foreground/80">{offsetDiff}</span>
        </div>
      </div>
      <div className="text-right">
        <p className="font-mono text-xl font-bold text-foreground">{timeInCity}</p>
      </div>
      <button onClick={onRemove} className="shrink-0 rounded-full p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100" aria-label={`Remove ${city.city}`}>
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function AddCityDialog({ onAdd, existingTimezones }: { onAdd: (city: TimezoneCity) => void; existingTimezones: string[]; }) {
  const [query, setQuery] = useState('');
  const filteredCities = useMemo(() => {
    const results = searchCities(query);
    return results.filter((c) => !existingTimezones.includes(c.timezone));
  }, [query, existingTimezones]);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search cities..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" autoFocus />
      </div>
      <ScrollArea className="h-[300px]">
        <div className="flex flex-col gap-1 pr-3">
          {filteredCities.map((city) => (
            <button key={city.timezone} onClick={() => onAdd(city)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-accent">
              <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{city.city}</p>
                <p className="truncate text-xs text-muted-foreground">{city.country} · {city.timezone}</p>
              </div>
              <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />
            </button>
          ))}
          {filteredCities.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No cities found</p>}
        </div>
      </ScrollArea>
    </div>
  );
}
