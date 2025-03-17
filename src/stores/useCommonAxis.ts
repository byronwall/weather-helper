import { create } from "zustand";
import { WeatherField } from "../types/user";

type ChartVisual = {
  color: string;
  min: number;
  max: number;
};

type ChartVisuals = Record<WeatherField, ChartVisual>;

interface CommonAxisState {
  defaultLimits: ChartVisuals;
  currentLimits: ChartVisuals;
  registerLimit: (field: WeatherField, min: number, max: number) => void;
  getCurrentLimits: (field: WeatherField) => { min: number; max: number };
}

const defaultChartVisuals: ChartVisuals = {
  temp: {
    color: "red",
    min: 50,
    max: 60,
  },
  windspeed: {
    color: "blue",
    min: 0,
    max: 20,
  },
  precipprob: {
    color: "green",
    min: 0,
    max: 100,
  },
  humidity: {
    color: "purple",
    min: 0,
    max: 100,
  },
};

export const useCommonAxis = create<CommonAxisState>((set, get) => ({
  defaultLimits: defaultChartVisuals,
  currentLimits: defaultChartVisuals,
  registerLimit: (field: WeatherField, min: number, max: number) => {
    set((state) => {
      const currentField = state.currentLimits[field];
      return {
        currentLimits: {
          ...state.currentLimits,
          [field]: {
            ...currentField,
            min: Math.min(currentField.min, min),
            max: Math.max(currentField.max, max),
          },
        },
      };
    });
  },
  getCurrentLimits: (field: WeatherField) => {
    const state = get();
    return {
      min: state.currentLimits[field].min,
      max: state.currentLimits[field].max,
    };
  },
}));
