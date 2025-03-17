import { useUserPrefs, WeatherPreference } from "../stores/userPrefsStore";

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
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Weather Preferences</h2>
      <div className="space-y-4">
        {Object.entries(METRICS).map(([metric, config]) => (
          <div key={metric} className="flex flex-col">
            <label className="font-medium mb-2">{config.label}</label>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm text-gray-600">Min</label>
                <div className="flex">
                  <input
                    type="number"
                    className="w-full border rounded px-2 py-1"
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
                    placeholder={`Min ${config.label}`}
                  />
                  <span className="ml-2 text-gray-600">{config.unit}</span>
                </div>
              </div>
              <div className="flex-1">
                <label className="text-sm text-gray-600">Max</label>
                <div className="flex">
                  <input
                    type="number"
                    className="w-full border rounded px-2 py-1"
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
                    placeholder={`Max ${config.label}`}
                  />
                  <span className="ml-2 text-gray-600">{config.unit}</span>
                </div>
              </div>
              <button
                className="self-end px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
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
