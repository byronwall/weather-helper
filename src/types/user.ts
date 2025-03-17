import { DayReading } from "./api";

export type WeatherField = keyof Pick<
  DayReading,
  "temp" | "windspeed" | "precipprob" | "humidity"
>;

type UserInfo = {
  location: string;
  weatherPreferences: Record<WeatherField, WeatherPreference>;
};

type WeatherPreference = {
  field: WeatherField;
  min?: number;
  max?: number;
};
