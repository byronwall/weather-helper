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
    loadSampleData,
  } = useWeatherStore();

  const { preferredDayOfWeek, timePreference } = useUserPrefs();

  // Load sample data when component mounts if no data is available
  useEffect(() => {
    if (!selectedLocation) {
      loadSampleData().catch(console.error);
    }
  }, [selectedLocation, loadSampleData]);

  // Auto-select dates matching preferred day when it changes
  useEffect(() => {
    if (preferredDayOfWeek !== null) {
      const availableDates = getAvailableDates(
        selectedLocation,
        timePreference
      );
      const matchingDates = availableDates.filter(
        (date) => date.getDay() === preferredDayOfWeek
      );

      // Select all matching dates that aren't already selected
      matchingDates.forEach((date) => {
        const isAlreadySelected = selectedDates.some(
          (d) =>
            d.toISOString().split("T")[0] === date.toISOString().split("T")[0]
        );
        if (!isAlreadySelected) {
          toggleDateSelection(date);
        }
      });
    }
  }, [
    preferredDayOfWeek,
    getAvailableDates,
    selectedDates,
    toggleDateSelection,
    selectedLocation,
    timePreference,
  ]);

  // Get available dates and sort them
  const availableDates = getAvailableDates(selectedLocation, timePreference);

  const sortedDates = [...availableDates].sort(
    (a, b) => a.getTime() - b.getTime()
  );

  return (
    <div className="bg-white rounded-lg shadow w-fit mx-auto">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            Available Dates
          </h2>
          <DayPreference />
        </div>
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-1 min-w-min">
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
