import { useWeatherStore } from "./stores/weatherStore";
import {
  formatWeatherSummary,
  getWeatherIcon,
} from "./utils/weatherFormatters";
import { WeatherChartPanel } from "./WeatherChartPanel";
import { useUserPrefs } from "./stores/userPrefsStore";
import { analyzeCombinedPreferences } from "./utils/preferenceHelper";

interface WeatherCardProps {
  date: Date;
  width: number;
}

export function WeatherCard({ date, width }: WeatherCardProps) {
  const selectedLocation = useWeatherStore((s) => s.selectedLocation);
  const { getWeatherForTimeRange } = useWeatherStore();
  const { preferences, timePreference, minimumDuration } = useUserPrefs();

  // Convert timePreference to TimeRange
  // need epch time - add day
  const start = new Date(date);
  start.setHours(timePreference.startHour, 0, 0, 0);
  const end = new Date(date);
  end.setHours(timePreference.endHour, 0, 0, 0);
  const timeRange = {
    start: Math.floor(start.getTime() / 1000),
    end: Math.floor(end.getTime() / 1000),
  };

  const weatherData = getWeatherForTimeRange(selectedLocation, timeRange);

  if (!weatherData || weatherData.length === 0) {
    return (
      <div className="bg-white rounded shadow p-4" style={{ width }}>
        <p>No weather data available for this date and location.</p>
      </div>
    );
  }

  // Analyze preferences
  const analysis = analyzeCombinedPreferences(
    weatherData,
    preferences,
    timePreference,
    minimumDuration
  );

  // Get weather summary using first data point
  const summary = formatWeatherSummary(weatherData[0]);
  const icon = getWeatherIcon(weatherData[0]);

  // Format time range
  const formatHour = (hour: number) => {
    if (hour === 0) {
      return "12 AM";
    }
    if (hour < 12) {
      return `${hour} AM`;
    }
    if (hour === 12) {
      return "12 PM";
    }
    return `${hour - 12} PM`;
  };

  const timeRangeDisplay = `${formatHour(
    timePreference.startHour
  )} - ${formatHour(timePreference.endHour)}`;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">{selectedLocation}</h2>
          <p className="text-gray-600">
            {date.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Weather Summary
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Temperature</p>
            <p className="text-lg font-medium">{summary.temperature}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Details</p>
            <p className="text-lg font-medium">{summary.details}</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Preference Analysis
        </h3>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Preferred Time Range: {timeRangeDisplay}
          </p>
          {analysis.validTimeRanges.length > 0 ? (
            <>
              <p className="text-sm text-green-600 font-medium">
                Good conditions during:
              </p>
              <ul className="list-disc list-inside text-sm text-green-600">
                {analysis.validTimeRanges.map((range, index) => (
                  <li key={index}>{range}</li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm text-red-600">
              No periods meet all preferences within the time range
            </p>
          )}
          {analysis.violations.length > 0 && (
            <>
              <p className="text-sm text-red-600 font-medium mt-2">
                Preference violations:
              </p>
              <ul className="list-disc list-inside text-sm text-red-600">
                {analysis.violations.map((violation, index) => (
                  <li key={index}>
                    {violation.field}: {violation.value}
                    {violation.type === "min" ? " < " : " > "}
                    {violation.limit}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Weather Charts
        </h3>
        <WeatherChartPanel weatherData={weatherData} width={width} />
      </div>
    </div>
  );
}
