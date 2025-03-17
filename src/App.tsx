import * as React from "react";
import { Header } from "./Header";
import { WeatherCard } from "./WeatherCard";
import { useWeatherStore } from "./stores/weatherStore";
import { UserPreferences } from "./components/UserPreferences";
import { DateList } from "./components/DateList";

export function App() {
  const { loadSampleData, selectedDates } = useWeatherStore();

  // Load sample data when component mounts
  React.useEffect(() => {
    loadSampleData().catch(console.error);
  }, [loadSampleData]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto p-4 space-y-4">
        <DateList />
        <UserPreferences />
        <div className="flex flex-wrap gap-4">
          {selectedDates.length === 0 ? (
            <div className="bg-white rounded shadow p-4 ">
              <p className="text-gray-500 text-center">
                Select dates above to view weather details
              </p>
            </div>
          ) : (
            selectedDates
              .sort((a, b) => a.getTime() - b.getTime())
              .map((date) => (
                <div key={date.toISOString()} className="w-full">
                  <WeatherCard date={date} location="46220" />
                </div>
              ))
          )}
        </div>
      </main>
    </div>
  );
}
