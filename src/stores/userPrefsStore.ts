import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WeatherPreference {
  temperature?: {
    min?: number;
    max?: number;
  };
  humidity?: {
    min?: number;
    max?: number;
  };
  windSpeed?: {
    min?: number;
    max?: number;
  };
  precipitation?: {
    min?: number;
    max?: number;
  };
}

interface UserPrefsState {
  preferences: WeatherPreference;
  minimumDuration: number; // in hours
  preferredDayOfWeek: number | null; // 0-6, where 0 is Sunday, null means no preference
  setPreference: (
    metric: keyof WeatherPreference,
    min?: number,
    max?: number
  ) => void;
  clearPreference: (metric: keyof WeatherPreference) => void;
  setMinimumDuration: (hours: number) => void;
  setPreferredDayOfWeek: (day: number | null) => void;
}

export const useUserPrefs = create<UserPrefsState>()(
  persist(
    (set) => ({
      preferences: {},
      minimumDuration: 1, // default 1 hour
      preferredDayOfWeek: null, // default no preference
      setPreference: (metric, min, max) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            [metric]: { min, max },
          },
        })),
      clearPreference: (metric) =>
        set((state) => {
          const newPreferences = { ...state.preferences };
          delete newPreferences[metric];
          return { preferences: newPreferences };
        }),
      setMinimumDuration: (hours) =>
        set(() => ({
          minimumDuration: hours,
        })),
      setPreferredDayOfWeek: (day) =>
        set(() => ({
          preferredDayOfWeek: day,
        })),
    }),
    {
      name: "weather-preferences",
    }
  )
);
