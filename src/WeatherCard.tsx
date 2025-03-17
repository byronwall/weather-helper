import { useWeatherStore } from "./stores/weatherStore";
import {
  formatWeatherSummary,
  getWeatherIcon,
} from "./utils/weatherFormatters";
import { WeatherChartPanel } from "./WeatherChartPanel";

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
  const dayData = getWeatherForDate(location, date);

  if (!dayData) {
    return (
      <div className="bg-white rounded shadow p-4 w-full">
        <p>No weather data available for this date and location.</p>
      </div>
    );
  }

  const weatherSummary = formatWeatherSummary(dayData);
  const icon = getWeatherIcon(dayData);

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

      {/* Placeholder Chart Area */}
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
