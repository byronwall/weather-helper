import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { MapPin } from "lucide-react";
import { LocationInput } from "./LocationInput";
import { useWeatherStore } from "../stores/weatherStore";

export function LocationPopover() {
  const { selectedLocation } = useWeatherStore();

  const displayText = selectedLocation || "Select Location";

  return (
    <Popover className="relative">
      <PopoverButton className="flex items-center space-x-1 text-sm text-gray-700 hover:text-gray-900">
        <span className="material-icons text-gray-500">
          <MapPin />
        </span>
        <span>{displayText}</span>
      </PopoverButton>

      <PopoverPanel
        anchor="bottom"
        className="absolute z-10 mt-2 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 p-4 min-w-[300px]"
      >
        <LocationInput />
      </PopoverPanel>
    </Popover>
  );
}
