import { useUserPrefs } from "../stores/userPrefsStore";

const TIME_PRESETS = [
  { value: "morning", label: "Morning (6 AM - 12 PM)" },
  { value: "afternoon", label: "Afternoon (12 PM - 6 PM)" },
  { value: "evening", label: "Evening (6 PM - 10 PM)" },
  { value: "custom", label: "Custom Time Range" },
] as const;

export function TimePreference() {
  const { timePreference, setTimePreference, setCustomTimeRange } =
    useUserPrefs();

  const handlePresetChange = (
    preset: (typeof TIME_PRESETS)[number]["value"]
  ) => {
    setTimePreference(preset);
  };

  const handleCustomTimeChange = (type: "start" | "end", value: string) => {
    const hour = parseInt(value, 10);
    if (isNaN(hour) || hour < 0 || hour > 23) return;

    if (type === "start") {
      setCustomTimeRange(hour, timePreference.endHour);
    } else {
      setCustomTimeRange(timePreference.startHour, hour);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Time Range
        </label>
        <div className="space-y-2">
          {TIME_PRESETS.map((preset) => (
            <div key={preset.value} className="flex items-center">
              <input
                type="radio"
                id={preset.value}
                name="timePreset"
                value={preset.value}
                checked={timePreference.preset === preset.value}
                onChange={(e) =>
                  handlePresetChange(
                    e.target.value as (typeof TIME_PRESETS)[number]["value"]
                  )
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label
                htmlFor={preset.value}
                className="ml-3 block text-sm font-medium text-gray-700"
              >
                {preset.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {timePreference.preset === "custom" && (
        <div className="flex items-center gap-4">
          <div>
            <label
              htmlFor="startHour"
              className="block text-sm font-medium text-gray-700"
            >
              Start Time
            </label>
            <select
              id="startHour"
              value={timePreference.startHour}
              onChange={(e) => handleCustomTimeChange("start", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>
                  {i === 0
                    ? "12 AM"
                    : i < 12
                    ? `${i} AM`
                    : i === 12
                    ? "12 PM"
                    : `${i - 12} PM`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="endHour"
              className="block text-sm font-medium text-gray-700"
            >
              End Time
            </label>
            <select
              id="endHour"
              value={timePreference.endHour}
              onChange={(e) => handleCustomTimeChange("end", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>
                  {i === 0
                    ? "12 AM"
                    : i < 12
                    ? `${i} AM`
                    : i === 12
                    ? "12 PM"
                    : `${i - 12} PM`}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
