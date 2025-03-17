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
  onPrevious?: () => void;
  onNext?: () => void;
  prevLabel?: string;
  nextLabel?: string;
}

export function WeatherCard({
  date,
  location,
  onPrevious,
  onNext,
  prevLabel = "Previous Friday",
  nextLabel = "Next Friday",
}: WeatherCardProps) {
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
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          Preference Analysis:
        </h3>
        {preferenceAnalysis.violations.length > 0 ? (
          <div>
            <p className="text-sm text-red-600">
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
                      const currentDiff = Math.abs(
                        current.value - current.limit
                      );
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
          </div>
        ) : preferenceAnalysis.validTimeRanges.length > 0 ? (
          <div className="space-y-1">
            <p className="text-sm text-green-600">
              All preferences met during these times:
            </p>
            {preferenceAnalysis.validTimeRanges.map((range, idx) => (
              <div key={idx} className="text-sm text-green-600">
                {range}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600">No viable time slots found.</p>
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

      {/* Navigation Controls */}
      {(onPrevious || onNext) && (
        <div className="flex justify-between items-center mt-4 text-sm">
          {onPrevious ? (
            <button
              onClick={onPrevious}
              className="text-blue-500 hover:underline"
            >
              &laquo; {prevLabel}
            </button>
          ) : (
            <div></div>
          )}
          {onNext ? (
            <button onClick={onNext} className="text-blue-500 hover:underline">
              {nextLabel} &raquo;
            </button>
          ) : (
            <div></div>
          )}
        </div>
      )}
    </div>
  );
}
