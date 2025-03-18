import { Popover } from "@headlessui/react";
import { TimePreference } from "./TimePreference";
import { useUserPrefs } from "../stores/userPrefsStore";
import { Clock } from "lucide-react";

function formatTimeRange(startHour: number, endHour: number) {
  const formatHour = (hour: number) => {
    if (hour === 0) {
      return "12 AM";
    }
    if (hour === 12) {
      return "12 PM";
    }
    return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
  };
  return `${formatHour(startHour)} - ${formatHour(endHour)}`;
}

export function TimePreferencePopover() {
  const { timePreference } = useUserPrefs();

  return (
    <Popover className="relative">
      <Popover.Button className="flex items-center space-x-1 text-sm text-gray-700 hover:text-gray-900">
        <span className="material-icons text-gray-500">
          <Clock />
        </span>
        <span>
          {formatTimeRange(timePreference.startHour, timePreference.endHour)}
        </span>
      </Popover.Button>

      <Popover.Panel className="absolute z-10 mt-2 w-96 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 p-4">
        <TimePreference />
      </Popover.Panel>
    </Popover>
  );
}
