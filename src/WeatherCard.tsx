import { useWeatherStore } from "./stores/weatherStore";
import {
  formatWeatherSummary,
  getWeatherIcon,
} from "./utils/weatherFormatters";
import { WeatherChartPanel } from "./WeatherChartPanel";
import { useUserPrefs } from "./stores/userPrefsStore";
import { analyzeCombinedPreferences } from "./utils/preferenceHelper";
import { WeatherField } from "./types/user";

interface WeatherCardProps {
  date: Date;
  location: string;
}

export function WeatherCard({ date, location }: WeatherCardProps) {
  const { getWeatherForDate } = useWeatherStore();
  const { preferences, minimumDuration } = useUserPrefs();
  const dayData = getWeatherForDate(location, date);

  if (!dayData) {
    return (
      <div className="bg-white rounded shadow p-4 w-full">
        <p>No weather data available for this date and location.</p>
      </div>
    );
  }

  // Analyze all preferences together
  const preferenceAnalysis = analyzeCombinedPreferences(
    dayData.hours,
    preferences,
    minimumDuration
  );

  const weatherSummary = formatWeatherSummary(dayData);
  const icon = getWeatherIcon(dayData);

  const getFieldDisplayName = (field: WeatherField): string => {
    switch (field) {
      case "temp":
        return "Temperature";
      case "windspeed":
        return "Wind Speed";
      case "precipprob":
        return "Precipitation";
      case "humidity":
        return "Humidity";
      default:
        return field;
    }
  };

  return (
    <div className="bg-white rounded shadow p-4 w-full">
      {/* Heading */}
      <h2 className="text-xl font-bold mb-2">
        {date.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </h2>

      {/* Preference Summary */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg space-y-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-700">
            Good Time Ranges:
          </h3>
          {/* Show valid time ranges if any exist */}
          {preferenceAnalysis.validTimeRanges.length > 0 ? (
            <div className="flex gap-2">
              {preferenceAnalysis.validTimeRanges.map((range, idx) => (
                <span key={idx} className="text-sm font-bold">
                  {range}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm">No viable time slots found.</p>
          )}
        </div>

        {/* Show violations if any exist */}
        {preferenceAnalysis.violations.length > 0 && (
          <p className="text-sm text-red-600">
            Violations:{" "}
            {Array.from(
              new Set(preferenceAnalysis.violations.map((v) => v.field))
            )
              .map((field) => {
                const fieldViolations = preferenceAnalysis.violations.filter(
                  (v) => v.field === field
                );
                const worstViolation = fieldViolations.reduce(
                  (worst, current) => {
                    const worstDiff = Math.abs(worst.value - worst.limit);
                    const currentDiff = Math.abs(current.value - current.limit);
                    return currentDiff > worstDiff ? current : worst;
                  }
                );
                return `${getFieldDisplayName(field)} ${
                  worstViolation.value
                } (${worstViolation.type === "min" ? "min" : "max"}: ${
                  worstViolation.limit
                })`;
              })
              .join(" • ")}
          </p>
        )}
      </div>

      {/* Weather summary row */}
      <div className="flex items-center space-x-4 mb-4">
        {/* Weather icon */}
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100">
          {icon}
        </div>

        {/* Text summary: temperature, wind, etc. */}
        <div className="text-sm">
          <p className="font-semibold">{weatherSummary.temperature}</p>
          <p>{weatherSummary.details}</p>
        </div>
      </div>

      {/* Chart Area */}
      <div className="bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500">
        <WeatherChartPanel hourlyData={dayData.hours} />
      </div>
    </div>
  );
}
