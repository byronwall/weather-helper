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

export function UserPreferences() {
  const {
    preferences,
    setPreference,
    clearPreference,
    minimumDuration,
    setMinimumDuration,
  } = useUserPrefs();

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

  const handleDurationChange = (value: string) => {
    const numValue = value === "" ? 1 : Number(value);
    setMinimumDuration(Math.max(0.1, numValue)); // Minimum of 0.1 hours (6 minutes)
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow max-w-2xl">
      <h2 className="text-xl font-bold mb-3">Weather Preferences</h2>
      <div className="space-y-4">
        <div className="pb-4 border-b">
          <ActivitySelector />
        </div>
        <div className="flex items-center gap-4 border-b pb-4">
          <div className="w-28">
            <label className="font-medium">Min Duration</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="w-20 border rounded px-2 py-1 text-sm"
              value={minimumDuration}
              onChange={(e) => handleDurationChange(e.target.value)}
              step="0.1"
              min="0.1"
              placeholder="1.0"
            />
            <span className="text-sm text-gray-600">hours</span>
          </div>
        </div>
        <div className="space-y-2">
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
    </div>
  );
}
