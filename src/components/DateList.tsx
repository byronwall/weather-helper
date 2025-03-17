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

  const { preferredDayOfWeek } = useUserPrefs();

  // Load sample data when component mounts if no data is available
  useEffect(() => {
    if (!selectedLocation) {
      loadSampleData().catch(console.error);
    }
  }, [selectedLocation, loadSampleData]);

  // Get available dates
  const availableDates = getAvailableDates();

  // Filter dates by preferred day of week if set
  const filteredDates =
    preferredDayOfWeek !== null
      ? availableDates.filter((date) => date.getDay() === preferredDayOfWeek)
      : availableDates;

  // Sort dates in descending order (most recent first)
  const sortedDates = [...filteredDates].sort(
    (a, b) => b.getTime() - a.getTime()
  );

  return (
    <div className="w-64 bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Available Dates</h2>
        <DayPreference />
      </div>
      <div className="max-h-96 overflow-y-auto">
        {!selectedLocation ? (
          <div className="p-4 text-gray-500 text-center">Loading dates...</div>
        ) : sortedDates.length === 0 ? (
          <div className="p-4 text-gray-500 text-center">
            No dates available
            {preferredDayOfWeek !== null && " for the selected day"}
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
  );
}
