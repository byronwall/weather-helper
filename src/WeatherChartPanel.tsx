import { HourReading } from "./types/api";
import { WeatherField } from "./types/user";
import { WeatherChart } from "./WeatherChart";

const WEATHER_FIELDS: WeatherField[] = [
  "temp",
  "windspeed",
  "precipprob",
  "humidity",
];

interface WeatherChartPanelProps {
  hourlyData: HourReading[];
}

export function WeatherChartPanel({ hourlyData }: WeatherChartPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      {WEATHER_FIELDS.map((field) => (
        <div key={field} className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 capitalize">{field}</h3>
          <WeatherChart hourlyData={hourlyData} field={field} />
        </div>
      ))}
    </div>
  );
}
