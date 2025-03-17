import { DayReading } from "../types/api";

export function formatWeatherSummary(dayReading: DayReading) {
  return {
    temperature: `${dayReading.conditions} ${Math.round(dayReading.temp)}°F`,
    details: `winds ${Math.round(dayReading.windspeed)}mph • ${
      dayReading.precipprob > 0
        ? `${dayReading.precipprob}% chance ${
            dayReading.preciptype?.[0] || "precipitation"
          }`
        : "no rain"
    }`,
  };
}

export function getWeatherIcon(dayReading: DayReading) {
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
      {iconMap[dayReading.icon] || iconMap["partly-cloudy-day"]}
    </span>
  );
}
