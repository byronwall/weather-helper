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

export interface TimePreference {
  startHour: number; // 0-23
  endHour: number; // 0-23
  preset: "morning" | "afternoon" | "evening" | "custom";
}

interface UserPrefsState {
  preferences: WeatherPreference;
  minimumDuration: number; // in hours
  preferredDayOfWeek: number | null; // 0-6, where 0 is Sunday, null means no preference
  timePreference: TimePreference;
  setPreference: (
    metric: keyof WeatherPreference,
    min?: number,
    max?: number
  ) => void;
  clearPreference: (metric: keyof WeatherPreference) => void;
  setMinimumDuration: (hours: number) => void;
  setPreferredDayOfWeek: (day: number | null) => void;
  setTimePreference: (preset: TimePreference["preset"]) => void;
  setCustomTimeRange: (startHour: number, endHour: number) => void;
  getTimeRange: () => { start: number; end: number };
}

const DEFAULT_TIME_PREFERENCE: TimePreference = {
  startHour: 9, // 9 AM
  endHour: 17, // 5 PM
  preset: "custom",
};

export const useUserPrefs = create<UserPrefsState>()(
  persist(
    (set, get) => ({
      preferences: {},
      minimumDuration: 1, // default 1 hour
      preferredDayOfWeek: null, // default no preference
      timePreference: DEFAULT_TIME_PREFERENCE,
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
      setTimePreference: (preset) =>
        set((state) => {
          let startHour = 9;
          let endHour = 17;
          switch (preset) {
            case "morning":
              startHour = 6;
              endHour = 12;
              break;
            case "afternoon":
              startHour = 12;
              endHour = 18;
              break;
            case "evening":
              startHour = 18;
              endHour = 22;
              break;
          }
          return {
            timePreference: {
              ...state.timePreference,
              preset,
              startHour,
              endHour,
            },
          };
        }),
      setCustomTimeRange: (startHour, endHour) =>
        set((state) => ({
          timePreference: {
            ...state.timePreference,
            preset: "custom",
            startHour,
            endHour,
          },
        })),
      getTimeRange: () => {
        const { timePreference } = get();
        return {
          start: timePreference.startHour,
          end: timePreference.endHour,
        };
      },
    }),
    {
      name: "weather-preferences",
    }
  )
);
