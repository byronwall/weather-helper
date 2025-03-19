import { DatePreferencePopover } from "./components/DatePreferencePopover";
import { LocationPopover } from "./components/LocationPopover";
import { TimePreferencePopover } from "./components/TimePreferencePopover";
import { WeatherPreferencesPopover } from "./components/WeatherPreferencesPopover";
import { ChartSettingsPopover } from "./components/ChartSettingsPopover";

export function Header() {
  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 bg-white shadow-sm border-b p-4">
      <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:items-center md:space-x-6">
        <div className="text-2xl font-bold">Weather or Not</div>

        <div className="flex justify-between">
          <div className="flex items-center gap-4 flex-wrap">
            <LocationPopover />
            <DatePreferencePopover />
            <TimePreferencePopover />
            <WeatherPreferencesPopover />
          </div>
          <ChartSettingsPopover />
        </div>
      </div>
    </header>
  );
}
