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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedDates.length === 0 ? (
            <div className="bg-white rounded shadow p-4 col-span-full">
              <p className="text-gray-500 text-center">
                Select dates above to view weather details
              </p>
            </div>
          ) : (
            selectedDates
              .sort((a, b) => a.getTime() - b.getTime())
              .map((date) => (
                <WeatherCard
                  key={date.toISOString()}
                  date={date}
                  location="46220"
                />
              ))
          )}
        </div>
      </main>
    </div>
  );
}
