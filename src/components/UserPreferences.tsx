import { TimeAndDurationPreferences } from "./TimeAndDurationPreferences";
import { WeatherPreferences } from "./WeatherPreferences";

export function UserPreferences() {
  return (
    <div className="space-y-6">
      <WeatherPreferences />
      <TimeAndDurationPreferences />
    </div>
  );
}
