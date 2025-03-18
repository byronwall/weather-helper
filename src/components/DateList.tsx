import { useEffect } from "react";
import { useWeatherStore } from "../stores/weatherStore";
import { useUserPrefs } from "../stores/userPrefsStore";
import { DateItem } from "./DateItem";
import { DayPreference } from "./DayPreference";

export function DateList() {
  const {
    selectedLocation,
    selectedDates,
    getAvailableDates,
    toggleDateSelection,
    setSelectedDates,
  } = useWeatherStore();

  const { preferredDayOfWeek, timePreference } = useUserPrefs();

  // Auto-select dates matching preferred day when it changes
  useEffect(() => {
    if (preferredDayOfWeek !== null) {
      const availableDates = getAvailableDates(
        selectedLocation,
        timePreference
      );

      // Select all dates matching the preferred day
      const matchingDates = availableDates.filter(
        (date) => date.getDay() === preferredDayOfWeek
      );

      // Directly set the matching dates
      setSelectedDates(matchingDates);
    }
  }, [
    preferredDayOfWeek,
    getAvailableDates,
    setSelectedDates,
    selectedLocation,
    timePreference,
  ]);

  // Get available dates and sort them
  const availableDates = getAvailableDates(selectedLocation, timePreference);

  const sortedDates = [...availableDates]
    .sort((a, b) => a.getTime() - b.getTime())
    .slice(0, 14); // Limit to 14 days

  return (
    <div className="bg-white rounded-lg shadow w-[440px]">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <DayPreference />
        </div>
        <div className="pb-2">
          <div className="grid grid-cols-7 gap-1">
            {!selectedLocation ? (
              <div className="p-4 text-gray-500 text-center">
                Loading dates...
              </div>
            ) : sortedDates.length === 0 ? (
              <div className="p-4 text-gray-500 text-center">
                No dates available
              </div>
            ) : (
              sortedDates.map((date) => (
                <DateItem
                  key={date.toISOString()}
                  date={date}
                  isSelected={selectedDates.some(
                    (d) =>
                      d.toISOString().split("T")[0] ===
                      date.toISOString().split("T")[0]
                  )}
                  isAvailable={true}
                  onClick={() => toggleDateSelection(date)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
