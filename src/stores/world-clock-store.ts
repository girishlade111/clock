import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WorldClockCity {
  id: string;
  city: string;
  country: string;
  timezone: string;
}

interface WorldClockState {
  cities: WorldClockCity[];
  addCity: (city: WorldClockCity) => void;
  removeCity: (id: string) => void;
  reorderCities: (cities: WorldClockCity[]) => void;
}

export const useWorldClockStore = create<WorldClockState>()(
  persist(
    (set) => ({
      cities: [],
      addCity: (city) =>
        set((state) => {
          if (state.cities.find((c) => c.timezone === city.timezone)) return state;
          return { cities: [...state.cities, city] };
        }),
      removeCity: (id) =>
        set((state) => ({
          cities: state.cities.filter((c) => c.id !== id),
        })),
      reorderCities: (cities) => set({ cities }),
    }),
    {
      name: 'world-clock-cities',
    }
  )
);
