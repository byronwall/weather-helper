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
  selectedDates: Date[];
  availableDates: Date[];

  // Actions
  setWeatherData: (location: string, data: WeatherResp) => void;
  setSelectedLocation: (location: string) => void;
  setSelectedDateRange: (range: { start: Date; end: Date }) => void;
  toggleDateSelection: (date: Date) => void;
  clearSelectedDates: () => void;
  loadSampleData: () => Promise<void>;

  // Queries
  getWeatherForDateRange: (
    location: string,
    start: Date,
    end: Date
  ) => DayReading[];
  getWeatherForDate: (location: string, date: Date) => DayReading | null;
  getAvailableDates: () => Date[];
}

export const useWeatherStore = create<WeatherStore>((set, get) => ({
  weatherData: {},
  selectedLocation: null,
  selectedDateRange: null,
  selectedDates: [],
  availableDates: [],

  setWeatherData: (location, data) =>
    set((state) => {
      // Extract dates from the new data
      const dates = data.days.map((day: DayReading) => new Date(day.datetime));

      return {
        weatherData: { ...state.weatherData, [location]: data },
        availableDates: dates, // Update available dates when setting new data
      };
    }),

  setSelectedLocation: (location) => set({ selectedLocation: location }),

  setSelectedDateRange: (range) => set({ selectedDateRange: range }),

  toggleDateSelection: (date) =>
    set((state) => {
      const dateStr = date.toISOString().split("T")[0];
      const existingIndex = state.selectedDates.findIndex(
        (d) => d.toISOString().split("T")[0] === dateStr
      );

      if (existingIndex >= 0) {
        const newDates = [...state.selectedDates];
        newDates.splice(existingIndex, 1);
        return { selectedDates: newDates };
      } else {
        return { selectedDates: [...state.selectedDates, date] };
      }
    }),

  clearSelectedDates: () => set({ selectedDates: [] }),

  loadSampleData: async () => {
    try {
      const response = await fetch("/46220_IN_home.json");
      const data = await response.json();
      const dates = data.days.map((day: DayReading) => new Date(day.datetime));
      set({
        weatherData: { "46220": data },
        selectedLocation: "Indianapolis, IN",
        availableDates: dates,
      });
    } catch (error) {
      console.error("Failed to load sample weather data:", error);
      throw error;
    }
  },

  getWeatherForDateRange: (location, start, end) => {
    const data = get().weatherData[location];
    if (!data) return [];

    return data.days.filter((day: DayReading) => {
      const dayDate = new Date(day.datetime);
      return dayDate >= start && dayDate <= end;
    });
  },

  getWeatherForDate: (location, date) => {
    const data = get().weatherData[location];
    if (!data) return null;

    const targetDate = date.toISOString().split("T")[0];
    return (
      data.days.find((day: DayReading) => day.datetime === targetDate) || null
    );
  },

  getAvailableDates: () => {
    return get().availableDates;
  },
}));
