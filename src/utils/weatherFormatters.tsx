import { WeatherMetric } from "../stores/weatherTypes";

export function formatWeatherSummary(weather: WeatherMetric) {
  return {
    temperature: `${weather.conditions} ${Math.round(weather.temp)}°F`,
    details: `winds ${Math.round(weather.windspeed)}mph • ${
      weather.precipprob > 0
        ? `${weather.precipprob}% chance precipitation`
        : "no rain"
    }`,
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
