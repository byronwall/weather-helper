import { DatePreferencePopover } from "./components/DatePreferencePopover";
import { LocationPopover } from "./components/LocationPopover";
import { TimePreferencePopover } from "./components/TimePreferencePopover";
import { WeatherPreferencesPopover } from "./components/WeatherPreferencesPopover";

export function Header() {
  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
      <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:items-center md:space-x-6">
        <div className="text-2xl font-bold">Weather or Not</div>

        <LocationPopover />

        <div className="flex items-center gap-2 flex-wrap">
          <DatePreferencePopover />
          <TimePreferencePopover />
          <WeatherPreferencesPopover />
        </div>
      </div>
    </header>
  );
}
