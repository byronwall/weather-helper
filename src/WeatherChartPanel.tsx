import { WeatherField } from "./types/user";
import { WeatherChart } from "./WeatherChart";
import { WeatherMetric } from "./stores/weatherTypes";
import { useUserPrefs } from "./stores/userPrefsStore";
import { useChartSettings } from "./stores/chartSettingsStore";
import { getPreferenceKey } from "./utils/preferenceHelper";

const WEATHER_FIELDS: WeatherField[] = [
  "temp",
  "windspeed",
  "precipprob",
  "humidity",
];

const FIELD_LABELS: Record<WeatherField, { label: string; unit: string }> = {
  temp: { label: "Temp", unit: "°F" },
  windspeed: { label: "Wind", unit: "mph" },
  precipprob: { label: "Rain", unit: "%" },
  humidity: { label: "Humidity", unit: "%" },
};

interface WeatherChartPanelProps {
  weatherData: WeatherMetric[];
  width: number;
}

export function WeatherChartPanel({
  weatherData,
  width,
}: WeatherChartPanelProps) {
  const { preferences } = useUserPrefs();
  const { settings } = useChartSettings();

  // Filter fields based on settings and preferences
  const visibleFields = WEATHER_FIELDS.filter((field) => {
    // Check if field is in visible weather fields setting
    const isVisible = settings.visibleWeatherFields.includes(field);

    // If we're only showing charts with preferences, check if this field has preferences
    if (settings.onlyShowChartsWithPreferences) {
      const preferenceKey = getPreferenceKey(field);
      const hasPreferences = preferences[preferenceKey] !== undefined;
      return isVisible && hasPreferences;
    }

    return isVisible;
  });

  return (
    <div className="flex flex-col gap-4 w-full">
      {visibleFields.map((field) => (
        <div key={field} className="bg-white rounded-lg shadow w-full">
          <WeatherChart
            hourlyData={weatherData}
            field={field}
            width={width}
            label={FIELD_LABELS[field].label}
            unit={FIELD_LABELS[field].unit}
          />
        </div>
      ))}
    </div>
  );
}
