import { WeatherMetric } from "../stores/weatherTypes";

export type WeatherField = keyof Pick<
  WeatherMetric,
  "temp" | "windspeed" | "precipprob" | "humidity"
>;
