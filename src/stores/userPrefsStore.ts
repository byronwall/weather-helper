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
  setPreference: (
    metric: keyof WeatherPreference,
    min?: number,
    max?: number
  ) => void;
  clearPreference: (metric: keyof WeatherPreference) => void;
}

export const useUserPrefs = create<UserPrefsState>()(
  persist(
    (set) => ({
      preferences: {},
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
    }),
    {
      name: "weather-preferences",
    }
  )
);
