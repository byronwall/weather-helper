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

interface WeatherMetricCardProps {
  label: string;
  value: string | number;
}

function WeatherMetricCard({ label, value }: WeatherMetricCardProps) {
  return (
    <div className="flex items-baseline justify-between bg-gray-50 px-4 py-2 rounded">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium ml-4">{value}</span>
    </div>
  );
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

  const metrics = [
    { label: "Conditions", value: summary.conditions },
    { label: "Temperature", value: summary.temperature },
    { label: "Wind", value: summary.wind },
    { label: "Precipitation", value: summary.precipitation },
    { label: "Humidity", value: summary.humidity },
    { label: "Cloud Cover", value: summary.cloudCover },
    { label: "UV Index", value: summary.uvIndex },
  ];

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
        <div className="@container">
          <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 gap-4">
            {metrics.map((metric) => (
              <WeatherMetricCard
                key={metric.label}
                label={metric.label}
                value={metric.value}
              />
            ))}
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
              <p className="font-medium flex">
                Preference violations:
                <div className="flex flex-wrap gap-2 ml-2">
                  {Array.from(
                    new Set(
                      analysis.violations.map(
                        (v) =>
                          `${v.field}: ${
                            v.type === "min" ? "too low" : "too high"
                          }`
                      )
                    )
                  ).map((violation, index) => (
                    <span
                      key={index}
                      className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded"
                    >
                      {violation}
                    </span>
                  ))}
                </div>
              </p>
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
