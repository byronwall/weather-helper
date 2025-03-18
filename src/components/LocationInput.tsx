import * as React from "react";
import { useWeatherStore } from "../stores/weatherStore";
import { sampleDataSets } from "../stores/weatherStore";
import { useUserPrefs } from "../stores/userPrefsStore";

export function LocationInput() {
  const { setSelectedLocation, loadWeatherData, loadSampleData } =
    useWeatherStore();
  const { preferredDayOfWeek, timePreference } = useUserPrefs();
  const [location, setLocation] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await loadWeatherData(
        location.trim(),
        timePreference,
        preferredDayOfWeek
      );
      setSelectedLocation(location.trim());
      setLocation(""); // Clear input after successful submission
    } catch (err) {
      setError("Failed to load weather data. Please try again.");
      console.error("Error loading weather data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSample = async (datasetKey: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await loadSampleData(datasetKey, timePreference, preferredDayOfWeek);
    } catch (err) {
      setError("Failed to load sample data. Please try again.");
      console.error("Error loading sample data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <div className="flex-1">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Location (ZIP code)
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter ZIP code"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            pattern="[0-9]{5}"
            maxLength={5}
            disabled={isLoading}
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
        <button
          type="submit"
          disabled={isLoading || !location.trim()}
          className={`rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm
            ${
              isLoading || !location.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            }`}
        >
          {isLoading ? "Loading..." : "Update Location"}
        </button>
      </form>

      <div className="border-t pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Sample Locations:
        </h3>
        <div className="flex flex-wrap gap-2 max-w-sm">
          {sampleDataSets.map((dataset) => (
            <button
              key={dataset.location}
              onClick={() => handleLoadSample(dataset.location)}
              disabled={isLoading}
              className={`rounded-md px-3 py-1.5 text-sm font-medium text-white shadow-sm
                ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                }`}
            >
              {dataset.location}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
