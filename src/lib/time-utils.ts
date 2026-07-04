/**
 * Time Utilities - Drift-free timekeeping functions
 * 
 * CRITICAL: All time calculations use Date.now() or performance.now()
 * deltas to prevent time drift. NEVER use setInterval counters.
 */

/**
 * Format milliseconds into MM:SS.cc (stopwatch format)
 */
export function formatStopwatch(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((ms % 1000) / 10);
  return `${pad2(minutes)}:${pad2(seconds)}.${pad2(centiseconds)}`;
}

/**
 * Format milliseconds into HH:MM:SS (timer format)
 */
export function formatTimer(ms: number): string {
  if (ms <= 0) return '00:00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;
}

/**
 * Format time for digital clock display
 */
export function formatDigitalTime(
  date: Date,
  is24Hour: boolean
): { time: string; period: string } {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  let period = '';

  if (!is24Hour) {
    period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
  }

  const time = `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;
  return { time, period };
}

/**
 * Format date string
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Get time offset difference between two timezones in hours
 */
export function getTimezoneOffsetDiff(
  targetTimezone: string,
  localTimezone: string
): string {
  const now = new Date();
  
  const targetFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: targetTimezone,
    timeZoneName: 'shortOffset',
  });
  
  const localFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: localTimezone,
    timeZoneName: 'shortOffset',
  });

  const targetParts = targetFormatter.formatToParts(now);
  const localParts = localFormatter.formatToParts(now);

  const targetOffset = targetParts.find(p => p.type === 'timeZoneName')?.value || '';
  const localOffset = localParts.find(p => p.type === 'timeZoneName')?.value || '';

  // Parse offset strings like "GMT-5" or "GMT+8"
  const parseOffset = (offset: string): number => {
    const match = offset.match(/GMT([+-]?\d+(?::\d+)?)/);
    if (!match) return 0;
    const parts = match[1].split(':');
    const hours = parseInt(parts[0], 10);
    const mins = parts[1] ? parseInt(parts[1], 10) : 0;
    return hours >= 0 ? hours + mins / 60 : hours - mins / 60;
  };

  const diff = parseOffset(targetOffset) - parseOffset(localOffset);
  
  if (diff === 0) return 'Same time';
  
  const absDiff = Math.abs(diff);
  const hours = Math.floor(absDiff);
  const mins = Math.round((absDiff - hours) * 60);
  
  const sign = diff > 0 ? '+' : '-';
  let result = `${sign}${hours}h`;
  if (mins > 0) result += ` ${mins}m`;
  
  return result;
}

/**
 * Check if it's daytime in a timezone (6am - 6pm)
 */
export function isDaytime(timezone: string): boolean {
  const now = new Date();
  const hour = parseInt(
    new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      hour12: false,
    }).format(now),
    10
  );
  return hour >= 6 && hour < 18;
}

/**
 * Pad number to 2 digits
 */
function pad2(n: number): string {
  return n.toString().padStart(2, '0');
}

/**
 * Get days of week labels
 */
export const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

/**
 * Parse repeat days from JSON string
 */
export function parseDays(jsonStr: string): number[] {
  try {
    return JSON.parse(jsonStr);
  } catch {
    return [];
  }
}

/**
 * Check if an alarm should fire on a given day
 */
export function shouldAlarmFireToday(
  repeat: string,
  customDays: number[],
  dayOfWeek: number // 0=Sunday
): boolean {
  switch (repeat) {
    case 'once':
      return true;
    case 'daily':
      return true;
    case 'weekdays':
      return dayOfWeek >= 1 && dayOfWeek <= 5;
    case 'weekends':
      return dayOfWeek === 0 || dayOfWeek === 6;
    case 'custom':
      return customDays.includes(dayOfWeek);
    default:
      return false;
  }
}
