import { useUserPrefs, WeatherPreference } from "../stores/userPrefsStore";
import { ActivitySelector } from "./ActivitySelector";

interface MetricConfig {
  label: string;
  unit: string;
}

const METRICS: Record<keyof WeatherPreference, MetricConfig> = {
  temperature: { label: "Temperature", unit: "°F" },
  humidity: { label: "Humidity", unit: "%" },
  windSpeed: { label: "Wind Speed", unit: "mph" },
  precipitation: { label: "Precipitation", unit: "%" },
};

export function WeatherPreferences() {
  const { preferences, setPreference, clearPreference } = useUserPrefs();

  const handleInputChange = (
    metric: keyof WeatherPreference,
    type: "min" | "max",
    value: string
  ) => {
    const numValue = value === "" ? undefined : Number(value);
    const currentPref = preferences[metric] || {};

    if (type === "min") {
      setPreference(metric, numValue, currentPref.max);
    } else {
      setPreference(metric, currentPref.min, numValue);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Weather Preferences
      </h3>
      <ActivitySelector />
      <div className="mt-4 space-y-2">
        {Object.entries(METRICS).map(([metric, config]) => (
          <div key={metric} className="flex items-center gap-4">
            <div className="w-28">
              <label className="font-medium">{config.label}</label>
            </div>
            <div className="flex items-center gap-2 flex-1">
              <input
                type="number"
                className="w-20 border rounded px-2 py-1 text-sm"
                value={
                  preferences[metric as keyof WeatherPreference]?.min ?? ""
                }
                onChange={(e) =>
                  handleInputChange(
                    metric as keyof WeatherPreference,
                    "min",
                    e.target.value
                  )
                }
                placeholder="Min"
              />
              <span className="text-sm text-gray-500">to</span>
              <input
                type="number"
                className="w-20 border rounded px-2 py-1 text-sm"
                value={
                  preferences[metric as keyof WeatherPreference]?.max ?? ""
                }
                onChange={(e) =>
                  handleInputChange(
                    metric as keyof WeatherPreference,
                    "max",
                    e.target.value
                  )
                }
                placeholder="Max"
              />
              <span className="text-sm text-gray-600 w-8">{config.unit}</span>
              <button
                className="text-sm text-red-600 hover:bg-red-50 rounded px-2 py-1"
                onClick={() =>
                  clearPreference(metric as keyof WeatherPreference)
                }
              >
                Clear
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
