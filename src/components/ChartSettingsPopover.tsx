import { useState } from "react";
import { useChartSettings } from "../stores/chartSettingsStore";
import type { ChartSettings } from "../stores/chartSettingsStore";
import { SettingsNumberInput } from "./SettingsNumberInput";
import { Settings2 } from "lucide-react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Tab } from "@headlessui/react";
import { WeatherField } from "../types/user";

type SettingConfig = {
  key: keyof ChartSettings;
  label: string;
  step?: number;
  min?: number;
  max?: number;
  tooltip: string;
  type: "number" | "boolean" | "array";
};

type SettingsGroup = {
  title: string;
  settings: SettingConfig[];
};

type SettingsGroups = {
  [key: string]: SettingsGroup;
};

export function ChartSettingsPopover() {
  const { settings, updateSettings, resetSettings } = useChartSettings();
  const [localSettings, setLocalSettings] = useState<ChartSettings>(settings);

  const handleUpdate = () => {
    updateSettings(localSettings);
  };

  const handleReset = () => {
    resetSettings();
    setLocalSettings(settings);
  };

  const updateNumberSetting = (key: keyof ChartSettings) => (value: number) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
  };

  const updateBooleanSetting =
    (key: keyof ChartSettings) => (value: boolean) => {
      setLocalSettings((prev) => ({ ...prev, [key]: value }));
    };

  const updateFieldVisibility = (field: WeatherField) => {
    setLocalSettings((prev) => {
      const fields = new Set(prev.visibleWeatherFields);
      if (fields.has(field)) {
        fields.delete(field);
      } else {
        fields.add(field);
      }
      return { ...prev, visibleWeatherFields: Array.from(fields) };
    });
  };

  const settingsGroups: SettingsGroups = {
    layout: {
      title: "Layout",
      settings: [
        {
          key: "chartAspectRatio",
          label: "Aspect Ratio",
          step: 0.1,
          min: 1,
          max: 4,
          tooltip: "Width to height ratio (e.g., 1.8:1)",
          type: "number",
        },
        {
          key: "maxPanelWidth",
          label: "Max Panel Width",
          min: 300,
          max: 1200,
          tooltip: "Maximum width of each weather panel",
          type: "number",
        },
        {
          key: "maxChartHeight",
          label: "Max Height",
          min: 100,
          max: 1000,
          tooltip: "Maximum height of charts",
          type: "number",
        },
        {
          key: "maxChartWidth",
          label: "Max Width",
          min: 300,
          max: 2000,
          tooltip: "Maximum width of charts",
          type: "number",
        },
        {
          key: "topGutterHeight",
          label: "Top Margin",
          min: 0,
          tooltip: "Space above the chart",
          type: "number",
        },
        {
          key: "bottomGutterHeight",
          label: "Bottom Margin",
          min: 0,
          tooltip: "Space below the chart",
          type: "number",
        },
        {
          key: "leftAxisLabel",
          label: "Left Label Width",
          min: 0,
          tooltip: "Width reserved for axis labels",
          type: "number",
        },
        {
          key: "leftGutterPadding",
          label: "Left Padding",
          min: 0,
          tooltip: "Additional left margin",
          type: "number",
        },
        {
          key: "rightGutterWidth",
          label: "Right Margin",
          min: 0,
          tooltip: "Space on the right",
          type: "number",
        },
      ],
    },
    display: {
      title: "Display",
      settings: [
        {
          key: "showMetricValues",
          label: "Show Metric Values",
          tooltip: "Show or hide metric value cards",
          type: "boolean",
        },
        {
          key: "onlyShowChartsWithPreferences",
          label: "Only Show Charts with Preferences",
          tooltip: "Hide charts for metrics without preferences set",
          type: "boolean",
        },
        {
          key: "metricCardWidth",
          label: "Metric Card Width",
          min: 100,
          tooltip: "Width of metric summary cards",
          type: "number",
        },
        {
          key: "chartPanelSidePadding",
          label: "Panel Side Padding",
          min: 0,
          tooltip: "Side padding for chart panel",
          type: "number",
        },
      ],
    },
    advanced: {
      title: "Advanced",
      settings: [
        {
          key: "valuePaddingFactor",
          label: "Value Padding",
          step: 0.05,
          min: 0,
          max: 0.5,
          tooltip: "Extra space above/below data (as % of range)",
          type: "number",
        },
        {
          key: "minPixelsBetweenYLabels",
          label: "Y Label Spacing",
          min: 10,
          tooltip: "Minimum pixels between Y-axis labels",
          type: "number",
        },
        {
          key: "minPixelsBetweenXLabels",
          label: "X Label Spacing",
          min: 30,
          tooltip: "Minimum pixels between X-axis labels",
          type: "number",
        },
        {
          key: "gradientOpacityAbove",
          label: "Above Gradient Opacity",
          step: 0.1,
          min: 0,
          max: 1,
          tooltip: "Opacity for above-threshold gradient",
          type: "number",
        },
        {
          key: "gradientOpacityBelow",
          label: "Below Gradient Opacity",
          step: 0.1,
          min: 0,
          max: 1,
          tooltip: "Opacity for below-threshold gradient",
          type: "number",
        },
        {
          key: "gradientStopCount",
          label: "Gradient Stops",
          min: 2,
          max: 5,
          tooltip: "Number of color stops in gradients",
          type: "number",
        },
      ],
    },
  };

  const weatherFields: WeatherField[] = [
    "temp",
    "windspeed",
    "precipprob",
    "humidity",
  ];

  return (
    <Popover className="relative">
      <PopoverButton className="p-2 hover:bg-gray-100 rounded-lg">
        <Settings2 />
      </PopoverButton>

      <PopoverPanel className="absolute right-0 mt-2 w-[420px] bg-white rounded-lg shadow-lg border p-4 z-50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Chart Settings</h3>
          <Popover.Button className="text-gray-500 hover:text-gray-700">
            ✕
          </Popover.Button>
        </div>

        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1 mb-4">
            {Object.values(settingsGroups).map((group) => (
              <Tab
                key={group.title}
                className={({ selected }) =>
                  `w-full rounded-lg py-2 text-sm font-medium leading-5
                  ${
                    selected
                      ? "bg-white text-blue-600 shadow"
                      : "text-gray-600 hover:bg-white/[0.12] hover:text-gray-800"
                  }`
                }
              >
                {group.title}
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels className="mt-2">
            {Object.values(settingsGroups).map((group) => (
              <Tab.Panel
                key={group.title}
                className="space-y-4 max-h-[60vh] overflow-y-auto p-1"
              >
                {group.title === "Display" && (
                  <div className="mb-4">
                    <h4 className="font-medium text-sm text-gray-700 mb-2">
                      Visible Weather Fields
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {weatherFields.map((field) => (
                        <button
                          key={field}
                          onClick={() => updateFieldVisibility(field)}
                          className={`px-3 py-1.5 rounded text-sm ${
                            localSettings.visibleWeatherFields.includes(field)
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {field}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  {group.settings.map((setting) => {
                    if (setting.type === "boolean") {
                      const key = setting.key as keyof ChartSettings;
                      return (
                        <div
                          key={key}
                          className="col-span-2 flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                        >
                          <div className="flex items-center">
                            <span className="text-sm">{setting.label}</span>
                            <span className="ml-2 text-xs text-gray-500">
                              {setting.tooltip}
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              updateBooleanSetting(key)(!localSettings[key])
                            }
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              localSettings[key] ? "bg-blue-600" : "bg-gray-200"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                localSettings[key]
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      );
                    }

                    const key = setting.key as keyof ChartSettings;
                    return (
                      <SettingsNumberInput
                        key={key}
                        label={setting.label}
                        value={localSettings[key] as number}
                        onChange={updateNumberSetting(key)}
                        step={setting.step}
                        min={setting.min}
                        max={setting.max}
                        tooltip={setting.tooltip}
                      />
                    );
                  })}
                </div>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>

        <div className="mt-4 pt-4 border-t flex justify-end gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
          >
            Reset
          </button>
          <Popover.Button
            onClick={handleUpdate}
            className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Update
          </Popover.Button>
        </div>
      </PopoverPanel>
    </Popover>
  );
}
