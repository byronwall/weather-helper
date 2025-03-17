import { create } from "zustand";
import { WeatherField } from "../types/user";

type ChartVisual = {
  color: string;
  min: number;
  max: number;
  increment: number;
  hardMin: number;
  hardMax: number;
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
    hardMin: -60,
    hardMax: 130,
  },
  windspeed: {
    color: "blue",
    min: 0,
    max: 20,
    increment: 5,
    hardMin: 0,
    hardMax: 100,
  },
  precipprob: {
    color: "green",
    min: 0,
    max: 100,
    increment: 10,
    hardMin: 0,
    hardMax: 100,
  },
  humidity: {
    color: "purple",
    min: 0,
    max: 100,
    increment: 10,
    hardMin: 0,
    hardMax: 100,
  },
};

export const useCommonAxis = create<CommonAxisState>((set, get) => ({
  defaultLimits: defaultChartVisuals,
  currentLimits: defaultChartVisuals,
  registerLimit: (field: WeatherField, min: number, max: number) => {
    set((state) => {
      const currentField = state.currentLimits[field];
      const { increment, hardMin, hardMax } = currentField;

      // Round min down and max up to nearest increment
      const roundedMin = Math.floor(min / increment) * increment;
      const roundedMax = Math.ceil(max / increment) * increment;

      // Enforce hard limits
      const clampedMin = Math.max(
        hardMin,
        Math.min(currentField.min, roundedMin)
      );
      const clampedMax = Math.min(
        hardMax,
        Math.max(currentField.max, roundedMax)
      );

      return {
        currentLimits: {
          ...state.currentLimits,
          [field]: {
            ...currentField,
            min: clampedMin,
            max: clampedMax,
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
