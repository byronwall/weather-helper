import { WeatherField } from "./types/user";
import { WeatherChart } from "./WeatherChart";
import { WeatherMetric } from "./stores/weatherTypes";

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
  return (
    <div className="flex flex-col gap-4 w-full">
      {WEATHER_FIELDS.map((field) => (
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
