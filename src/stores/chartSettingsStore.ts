import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ChartSettings {
  // Chart dimensions and layout
  chartAspectRatio: number;
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
}

interface ChartSettingsStore {
  settings: ChartSettings;
  updateSettings: (newSettings: Partial<ChartSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: ChartSettings = {
  // Chart dimensions and layout
  chartAspectRatio: 1.8,
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
