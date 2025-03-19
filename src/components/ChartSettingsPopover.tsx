import { useState } from "react";
import { useChartSettings } from "../stores/chartSettingsStore";
import { SettingsNumberInput } from "./SettingsNumberInput";
import { Settings2 } from "lucide-react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

export function ChartSettingsPopover() {
  const { settings, updateSettings, resetSettings } = useChartSettings();
  const [localSettings, setLocalSettings] = useState(settings);

  const handleUpdate = () => {
    updateSettings(localSettings);
  };

  const handleReset = () => {
    resetSettings();
    setLocalSettings(settings);
  };

  const updateSetting = (key: keyof typeof settings) => (value: number) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
  };

  const settingsGroups = [
    {
      title: "Chart Layout",
      settings: [
        {
          key: "chartAspectRatio",
          label: "Aspect Ratio",
          step: 0.1,
          min: 1,
          max: 4,
          tooltip: "Width to height ratio (e.g., 1.8:1)",
        },
        {
          key: "topGutterHeight",
          label: "Top Margin",
          min: 0,
          tooltip: "Space above the chart",
        },
        {
          key: "bottomGutterHeight",
          label: "Bottom Margin",
          min: 0,
          tooltip: "Space below the chart",
        },
        {
          key: "leftAxisLabel",
          label: "Left Label Width",
          min: 0,
          tooltip: "Width reserved for axis labels",
        },
        {
          key: "leftGutterPadding",
          label: "Left Padding",
          min: 0,
          tooltip: "Additional left margin",
        },
        {
          key: "rightGutterWidth",
          label: "Right Margin",
          min: 0,
          tooltip: "Space on the right",
        },
      ],
    },
    {
      title: "Spacing & Padding",
      settings: [
        {
          key: "valuePaddingFactor",
          label: "Value Padding",
          step: 0.05,
          min: 0,
          max: 0.5,
          tooltip: "Extra space above/below data (as % of range)",
        },
        {
          key: "minPixelsBetweenYLabels",
          label: "Y Label Spacing",
          min: 10,
          tooltip: "Minimum pixels between Y-axis labels",
        },
        {
          key: "minPixelsBetweenXLabels",
          label: "X Label Spacing",
          min: 30,
          tooltip: "Minimum pixels between X-axis labels",
        },
      ],
    },
    {
      title: "Card Settings",
      settings: [
        {
          key: "metricCardWidth",
          label: "Metric Card Width",
          min: 100,
          tooltip: "Width of metric summary cards",
        },
        {
          key: "chartPanelSidePadding",
          label: "Panel Side Padding",
          min: 0,
          tooltip: "Side padding for chart panel",
        },
      ],
    },
  ];

  return (
    <Popover className="relative">
      <PopoverButton className="p-2 hover:bg-gray-100 rounded-lg">
        <Settings2 />
      </PopoverButton>

      <PopoverPanel className="absolute right-0 mt-2 w-[380px] bg-white rounded-lg shadow-lg border p-4 z-50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Chart Settings</h3>
          <Popover.Button className="text-gray-500 hover:text-gray-700">
            ✕
          </Popover.Button>
        </div>

        <div className="space-y-6 max-h-[60vh] overflow-y-auto">
          {settingsGroups.map((group) => (
            <div key={group.title}>
              <h4 className="font-medium text-sm text-gray-700 mb-2">
                {group.title}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {group.settings.map((setting) => (
                  <SettingsNumberInput
                    key={setting.key}
                    label={setting.label}
                    value={localSettings[setting.key as keyof typeof settings]}
                    onChange={updateSetting(
                      setting.key as keyof typeof settings
                    )}
                    step={setting.step}
                    min={setting.min}
                    max={setting.max}
                    tooltip={setting.tooltip}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

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
