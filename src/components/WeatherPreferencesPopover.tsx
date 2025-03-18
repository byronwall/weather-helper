import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { WeatherPreferences } from "./WeatherPreferences";
import { useUserPrefs, WeatherPreference } from "../stores/userPrefsStore";
import { Settings } from "lucide-react";

function formatPreferenceSummary(
  preferences: Partial<
    Record<keyof WeatherPreference, { min?: number; max?: number } | undefined>
  >
) {
  const activePrefs = Object.entries(preferences).filter(
    ([, value]) => value?.min !== undefined || value?.max !== undefined
  );

  if (activePrefs.length === 0) {
    return "No preferences set";
  }

  return `${activePrefs.length} weather ${
    activePrefs.length === 1 ? "preference" : "preferences"
  } set`;
}

export function WeatherPreferencesPopover() {
  const { preferences } = useUserPrefs();

  return (
    <Popover className="relative">
      <PopoverButton className="flex items-center space-x-1 text-sm text-gray-700 hover:text-gray-900">
        <span className="material-icons text-gray-500">
          <Settings />
        </span>
        <span>{formatPreferenceSummary(preferences)}</span>
      </PopoverButton>

      <PopoverPanel
        anchor="bottom"
        className="absolute z-10 mt-2 w-[500px] rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 p-4"
      >
        <WeatherPreferences />
      </PopoverPanel>
    </Popover>
  );
}
