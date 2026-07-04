/**
 * IANA Timezone Database - Comprehensive list of world timezones
 * Using standard IANA identifiers for DST-safe timezone handling
 */

export interface TimezoneCity {
  id: string;
  city: string;
  country: string;
  timezone: string; // IANA identifier
}

export const TIMEZONE_CITIES: TimezoneCity[] = [
  // North America
  { id: '1', city: 'New York', country: 'USA', timezone: 'America/New_York' },
  { id: '2', city: 'Los Angeles', country: 'USA', timezone: 'America/Los_Angeles' },
  { id: '3', city: 'Chicago', country: 'USA', timezone: 'America/Chicago' },
  { id: '4', city: 'Denver', country: 'USA', timezone: 'America/Denver' },
  { id: '5', city: 'Phoenix', country: 'USA', timezone: 'America/Phoenix' },
  { id: '6', city: 'Anchorage', country: 'USA', timezone: 'America/Anchorage' },
  { id: '7', city: 'Honolulu', country: 'USA', timezone: 'Pacific/Honolulu' },
  { id: '8', city: 'Toronto', country: 'Canada', timezone: 'America/Toronto' },
  { id: '9', city: 'Vancouver', country: 'Canada', timezone: 'America/Vancouver' },
  { id: '10', city: 'Mexico City', country: 'Mexico', timezone: 'America/Mexico_City' },
  
  // South America
  { id: '11', city: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo' },
  { id: '12', city: 'Buenos Aires', country: 'Argentina', timezone: 'America/Argentina/Buenos_Aires' },
  { id: '13', city: 'Bogotá', country: 'Colombia', timezone: 'America/Bogota' },
  { id: '14', city: 'Santiago', country: 'Chile', timezone: 'America/Santiago' },
  { id: '15', city: 'Lima', country: 'Peru', timezone: 'America/Lima' },
  
  // Europe
  { id: '16', city: 'London', country: 'UK', timezone: 'Europe/London' },
  { id: '17', city: 'Paris', country: 'France', timezone: 'Europe/Paris' },
  { id: '18', city: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin' },
  { id: '19', city: 'Madrid', country: 'Spain', timezone: 'Europe/Madrid' },
  { id: '20', city: 'Rome', country: 'Italy', timezone: 'Europe/Rome' },
  { id: '21', city: 'Amsterdam', country: 'Netherlands', timezone: 'Europe/Amsterdam' },
  { id: '22', city: 'Moscow', country: 'Russia', timezone: 'Europe/Moscow' },
  { id: '23', city: 'Istanbul', country: 'Turkey', timezone: 'Europe/Istanbul' },
  { id: '24', city: 'Athens', country: 'Greece', timezone: 'Europe/Athens' },
  { id: '25', city: 'Warsaw', country: 'Poland', timezone: 'Europe/Warsaw' },
  { id: '26', city: 'Stockholm', country: 'Sweden', timezone: 'Europe/Stockholm' },
  { id: '27', city: 'Lisbon', country: 'Portugal', timezone: 'Europe/Lisbon' },
  { id: '28', city: 'Zurich', country: 'Switzerland', timezone: 'Europe/Zurich' },
  { id: '29', city: 'Dublin', country: 'Ireland', timezone: 'Europe/Dublin' },
  { id: '30', city: 'Oslo', country: 'Norway', timezone: 'Europe/Oslo' },
  { id: '31', city: 'Helsinki', country: 'Finland', timezone: 'Europe/Helsinki' },
  
  // Asia
  { id: '32', city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo' },
  { id: '33', city: 'Shanghai', country: 'China', timezone: 'Asia/Shanghai' },
  { id: '34', city: 'Hong Kong', country: 'China', timezone: 'Asia/Hong_Kong' },
  { id: '35', city: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore' },
  { id: '36', city: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul' },
  { id: '37', city: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata' },
  { id: '38', city: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok' },
  { id: '39', city: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai' },
  { id: '40', city: 'Jakarta', country: 'Indonesia', timezone: 'Asia/Jakarta' },
  { id: '41', city: 'Taipei', country: 'Taiwan', timezone: 'Asia/Taipei' },
  { id: '42', city: 'Kuala Lumpur', country: 'Malaysia', timezone: 'Asia/Kuala_Lumpur' },
  { id: '43', city: 'Manila', country: 'Philippines', timezone: 'Asia/Manila' },
  { id: '44', city: 'Hanoi', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh' },
  { id: '45', city: 'Karachi', country: 'Pakistan', timezone: 'Asia/Karachi' },
  { id: '46', city: 'Dhaka', country: 'Bangladesh', timezone: 'Asia/Dhaka' },
  { id: '47', city: 'Riyadh', country: 'Saudi Arabia', timezone: 'Asia/Riyadh' },
  { id: '48', city: 'Tehran', country: 'Iran', timezone: 'Asia/Tehran' },
  
  // Oceania
  { id: '49', city: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney' },
  { id: '50', city: 'Melbourne', country: 'Australia', timezone: 'Australia/Melbourne' },
  { id: '51', city: 'Auckland', country: 'New Zealand', timezone: 'Pacific/Auckland' },
  { id: '52', city: 'Perth', country: 'Australia', timezone: 'Australia/Perth' },
  { id: '53', city: 'Brisbane', country: 'Australia', timezone: 'Australia/Brisbane' },
  
  // Africa
  { id: '54', city: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo' },
  { id: '55', city: 'Lagos', country: 'Nigeria', timezone: 'Africa/Lagos' },
  { id: '56', city: 'Johannesburg', country: 'South Africa', timezone: 'Africa/Johannesburg' },
  { id: '57', city: 'Nairobi', country: 'Kenya', timezone: 'Africa/Nairobi' },
  { id: '58', city: 'Casablanca', country: 'Morocco', timezone: 'Africa/Casablanca' },
  { id: '59', city: 'Accra', country: 'Ghana', timezone: 'Africa/Accra' },
  
  // Additional major cities
  { id: '60', city: 'Reykjavik', country: 'Iceland', timezone: 'Atlantic/Reykjavik' },
  { id: '61', city: 'Kathmandu', country: 'Nepal', timezone: 'Asia/Kathmandu' },
  { id: '62', city: 'Yangon', country: 'Myanmar', timezone: 'Asia/Yangon' },
  { id: '63', city: 'Adelaide', country: 'Australia', timezone: 'Australia/Adelaide' },
  { id: '64', city: 'Hawaii', country: 'USA', timezone: 'Pacific/Honolulu' },
  { id: '65', city: 'Fiji', country: 'Fiji', timezone: 'Pacific/Fiji' },
  { id: '66', city: 'Saskatchewan', country: 'Canada', timezone: 'America/Regina' },
];

/**
 * Get user's local IANA timezone
 */
export function getLocalTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Search timezone cities by query
 */
export function searchCities(query: string): TimezoneCity[] {
  const q = query.toLowerCase().trim();
  if (!q) return TIMEZONE_CITIES;
  return TIMEZONE_CITIES.filter(
    c =>
      c.city.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q) ||
      c.timezone.toLowerCase().includes(q)
  );
}
