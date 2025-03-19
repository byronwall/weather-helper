import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ChartSettings {
  // Chart dimensions and layout
  chartAspectRatio: number;
  maxChartHeight: number;
  maxChartWidth: number;
  maxPanelWidth: number;
  topGutterHeight: number;
  bottomGutterHeight: number;
  leftAxisLabel: number;
  leftGutterPadding: number;
  rightGutterWidth: number;

  // Value padding and spacing
  valuePaddingFactor: number;
  minPixelsBetweenYLabels: number;
  minPixelsBetweenXLabels: number;

  // Card and panel settings
  metricCardWidth: number;
  chartPanelSidePadding: number;
  showMetricValues: boolean;
  onlyShowChartsWithPreferences: boolean;

  // Gradient settings
  gradientOpacityAbove: number;
  gradientOpacityBelow: number;
  gradientStopCount: number;

  // Line style settings
  lineStyle: "straight" | "curved";
  lineWidth: number;
  pointSize: number;

  // Display settings
  visibleWeatherFields: string[];
}

interface ChartSettingsStore {
  settings: ChartSettings;
  updateSettings: (newSettings: Partial<ChartSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: ChartSettings = {
  // Chart dimensions and layout
  chartAspectRatio: 1.8,
  maxChartHeight: 300,
  maxChartWidth: 1200,
  maxPanelWidth: 600,
  topGutterHeight: 20,
  bottomGutterHeight: 40,
  leftAxisLabel: 30,
  leftGutterPadding: 30, // This is added to leftAxisLabel
  rightGutterWidth: 5,

  // Value padding and spacing
  valuePaddingFactor: 0.1,
  minPixelsBetweenYLabels: 15,
  minPixelsBetweenXLabels: 60,

  // Card and panel settings
  metricCardWidth: 180,
  chartPanelSidePadding: 64,
  showMetricValues: true,
  onlyShowChartsWithPreferences: false,

  // Gradient settings
  gradientOpacityAbove: 0.4,
  gradientOpacityBelow: 0.4,
  gradientStopCount: 3,

  // Line style settings
  lineStyle: "straight",
  lineWidth: 2,
  pointSize: 2,

  // Display settings
  visibleWeatherFields: ["temp", "windspeed", "precipprob", "humidity"],
};

export const useChartSettings = create<ChartSettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      resetSettings: () => set({ settings: defaultSettings }),
    }),
    {
      name: "chart-settings",
    }
  )
);
