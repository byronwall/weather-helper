import { create } from "zustand";
import { WeatherField } from "../types/user";

type ChartVisual = {
  color: string;
  min: number;
  max: number;
  increment: number;
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
    increment: 5,
  },
  windspeed: {
    color: "blue",
    min: 0,
    max: 20,
    increment: 5,
  },
  precipprob: {
    color: "green",
    min: 0,
    max: 100,
    increment: 10,
  },
  humidity: {
    color: "purple",
    min: 0,
    max: 100,
    increment: 10,
  },
};

export const useCommonAxis = create<CommonAxisState>((set, get) => ({
  defaultLimits: defaultChartVisuals,
  currentLimits: defaultChartVisuals,
  registerLimit: (field: WeatherField, min: number, max: number) => {
    set((state) => {
      const currentField = state.currentLimits[field];
      const { increment } = currentField;

      // Round min down and max up to nearest increment
      const roundedMin = Math.floor(min / increment) * increment;
      const roundedMax = Math.ceil(max / increment) * increment;

      return {
        currentLimits: {
          ...state.currentLimits,
          [field]: {
            ...currentField,
            min: Math.min(currentField.min, roundedMin),
            max: Math.max(currentField.max, roundedMax),
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
