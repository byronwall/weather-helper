import { useWeatherStore } from "./stores/weatherStore";
import { useUserPrefs } from "./stores/userPrefsStore";
import { Popover } from "@headlessui/react";
import { TimePreference } from "./components/TimePreference";

function formatTimeRange(startHour: number, endHour: number) {
  const formatHour = (hour: number) => {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
  };
  return `${formatHour(startHour)} - ${formatHour(endHour)}`;
}

export function Header() {
  const { selectedLocation } = useWeatherStore();
  const { timePreference } = useUserPrefs();

  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
      <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:items-center md:space-x-6">
        <div className="text-2xl font-bold">Weather or Not</div>

        <div className="flex items-center space-x-1 text-sm text-gray-600">
          <span className="material-icons text-gray-500">location_on</span>
          <span>{selectedLocation || "Select Location"}</span>
        </div>

        <Popover className="relative">
          <Popover.Button className="flex items-center space-x-1 text-sm text-gray-700 hover:text-gray-900">
            <span className="material-icons text-gray-500">schedule</span>
            <span>
              {formatTimeRange(
                timePreference.startHour,
                timePreference.endHour
              )}
            </span>
          </Popover.Button>

          <Popover.Panel className="absolute z-10 mt-2 w-96 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 p-4">
            <TimePreference />
          </Popover.Panel>
        </Popover>
      </div>
    </header>
  );
}
