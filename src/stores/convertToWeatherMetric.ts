import { WeatherReading } from "./WeatherReading";
import { WeatherMetric } from "./weatherTypes";

export const convertToWeatherMetric = (
  reading: WeatherReading,
  timestamp: number
): WeatherMetric => ({
  timestamp,
  temp: reading.temp,
  feelslike: reading.feelslike,
  humidity: reading.humidity,
  precip: reading.precip,
  precipprob: reading.precipprob,
  snow: reading.snow,
  snowdepth: reading.snowdepth,
  windspeed: reading.windspeed,
  windgust: reading.windgust,
  winddir: reading.winddir,
  pressure: reading.pressure,
  visibility: reading.visibility,
  cloudcover: reading.cloudcover,
  uvindex: reading.uvindex,
  conditions: reading.conditions,
  icon: reading.icon,
});
