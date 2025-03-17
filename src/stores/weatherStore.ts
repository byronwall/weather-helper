import { create } from "zustand";
import { WeatherResp, DayReading } from "../types/api";

interface WeatherStore {
  // Raw data from API
  weatherData: Record<string, WeatherResp>;
  // Filtered/processed data
  selectedLocation: string | null;
  selectedDateRange: {
    start: Date;
    end: Date;
  } | null;

  // Actions
  setWeatherData: (location: string, data: WeatherResp) => void;
  setSelectedLocation: (location: string) => void;
  setSelectedDateRange: (range: { start: Date; end: Date }) => void;
  loadSampleData: () => Promise<void>;

  // Queries
  getWeatherForDateRange: (
    location: string,
    start: Date,
    end: Date
  ) => DayReading[];
  getWeatherForDate: (location: string, date: Date) => DayReading | null;
}

export const useWeatherStore = create<WeatherStore>((set, get) => ({
  weatherData: {},
  selectedLocation: null,
  selectedDateRange: null,

  setWeatherData: (location, data) =>
    set((state) => ({
      weatherData: { ...state.weatherData, [location]: data },
    })),

  setSelectedLocation: (location) => set({ selectedLocation: location }),

  setSelectedDateRange: (range) => set({ selectedDateRange: range }),

  loadSampleData: async () => {
    try {
      const response = await fetch("/46220_IN_home.json");
      const data = await response.json();
      set((state) => ({
        weatherData: { ...state.weatherData, "46220": data },
        selectedLocation: "Indianapolis, IN",
      }));
    } catch (error) {
      console.error("Failed to load sample weather data:", error);
      throw error;
    }
  },

  getWeatherForDateRange: (location, start, end) => {
    const data = get().weatherData[location];
    if (!data) return [];

    return data.days.filter((day) => {
      const dayDate = new Date(day.datetime);
      return dayDate >= start && dayDate <= end;
    });
  },

  getWeatherForDate: (location, date) => {
    const data = get().weatherData[location];
    if (!data) return null;

    const targetDate = date.toISOString().split("T")[0];
    return data.days.find((day) => day.datetime === targetDate) || null;
  },
}));
