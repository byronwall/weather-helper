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
        <div className="space-y-2">
          {analysis.validTimeRanges.length > 0 ? (
            <>
              <p className=" font-medium flex ">
                Good conditions:
                <div className="flex flex-wrap gap-2">
                  {analysis.validTimeRanges.map((range, index) => (
                    <span
                      key={index}
                      className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded"
                    >
                      {range}
                    </span>
                  ))}
                </div>
              </p>
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
        <WeatherChartPanel weatherData={weatherData} width={width} />
      </div>
    </div>
  );
}
