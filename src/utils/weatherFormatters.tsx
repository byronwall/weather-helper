import { WeatherMetric } from "../stores/weatherTypes";

export function formatWeatherSummary(weather: WeatherMetric) {
  return {
    conditions: weather.conditions,
    temperature: `${Math.round(weather.temp)}°F`,
    wind: `${Math.round(weather.windspeed)} mph`,
    precipitation: weather.precipprob > 0 ? `${weather.precipprob}%` : "none",
    humidity: `${Math.round(weather.humidity)}%`,
    cloudCover: `${Math.round(weather.cloudcover)}%`,
    uvIndex: weather.uvindex,
  };
}

export function getWeatherIcon(weather: WeatherMetric) {
  // Map weather conditions to emoji icons
  const iconMap: Record<string, string> = {
    "clear-day": "☀️",
    "clear-night": "🌙",
    cloudy: "☁️",
    fog: "🌫️",
    "partly-cloudy-day": "⛅",
    "partly-cloudy-night": "🌤️",
    rain: "🌧️",
    snow: "🌨️",
    wind: "💨",
  };

  return (
    <span className="text-2xl">
      {iconMap[weather.icon] || iconMap["partly-cloudy-day"]}
    </span>
  );
}
