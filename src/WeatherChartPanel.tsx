import { WeatherField } from "./types/user";
import { WeatherChart } from "./WeatherChart";
import { HourReading } from "./types/api";

const WEATHER_FIELDS: WeatherField[] = [
  "temp",
  "windspeed",
  "precipprob",
  "humidity",
];

interface WeatherChartPanelProps {
  hourlyData: HourReading[];
  width: number;
}

export function WeatherChartPanel({
  hourlyData,
  width,
}: WeatherChartPanelProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      {WEATHER_FIELDS.map((field) => (
        <div key={field} className="bg-white rounded-lg shadow w-full">
          <h3 className="text-lg font-semibold mb-2 px-4 pt-4">{field}</h3>
          <WeatherChart hourlyData={hourlyData} field={field} width={width} />
        </div>
      ))}
    </div>
  );
}
