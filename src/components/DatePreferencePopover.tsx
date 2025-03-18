import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { DateList } from "./DateList";
import { useUserPrefs } from "../stores/userPrefsStore";
import { Calendar } from "lucide-react";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function DatePreferencePopover() {
  const { preferredDayOfWeek } = useUserPrefs();

  const displayText =
    preferredDayOfWeek !== null ? DAYS_OF_WEEK[preferredDayOfWeek] : "Any Day";

  return (
    <Popover className="relative">
      <PopoverButton className="flex items-center space-x-1 text-sm text-gray-700 hover:text-gray-900">
        <span className="material-icons text-gray-500">
          <Calendar />
        </span>
        <span>{displayText}</span>
      </PopoverButton>

      <PopoverPanel
        anchor="bottom"
        className="absolute z-10 mt-2 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 p-2"
      >
        <DateList />
      </PopoverPanel>
    </Popover>
  );
}
