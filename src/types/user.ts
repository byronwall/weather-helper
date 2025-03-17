import { DayReading } from "./api";

export type WeatherField = keyof Pick<
  DayReading,
  "temp" | "windspeed" | "precipprob" | "humidity"
>;
