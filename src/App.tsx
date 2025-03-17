import * as React from "react";
import { Header } from "./Header";
import { WeatherCard } from "./WeatherCard";
import { useWeatherStore } from "./stores/weatherStore";
import { UserPreferences } from "./components/UserPreferences";
import { DateList } from "./components/DateList";

export function App() {
  const { loadSampleData } = useWeatherStore();
  const [currentDate, setCurrentDate] = React.useState(() => {
    const now = new Date();
    // Find the next Friday
    const daysUntilFriday = (5 - now.getDay() + 7) % 7;
    const nextFriday = new Date(now);
    nextFriday.setDate(now.getDate() + daysUntilFriday);
    return nextFriday;
  });

  // Load sample data when component mounts
  React.useEffect(() => {
    loadSampleData().catch(console.error);
  }, [loadSampleData]);

  const handlePreviousFriday = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() - 7);
      return newDate;
    });
  };

  const handleNextFriday = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + 7);
      return newDate;
    });
  };

  const nextFridayDate = new Date(currentDate);
  nextFridayDate.setDate(currentDate.getDate() + 7);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto p-4">
        <div className="flex gap-4">
          <div className="flex-none">
            <DateList />
          </div>
          <div className="flex-1 space-y-4">
            <UserPreferences />
            <div className="flex flex-row gap-4">
              <WeatherCard
                date={currentDate}
                location="46220"
                onPrevious={handlePreviousFriday}
                onNext={handleNextFriday}
                nextLabel={`Next Friday (${nextFridayDate.toLocaleDateString()})`}
              />
              {/* Next Friday Card */}
              <WeatherCard
                date={nextFridayDate}
                location="46220"
                onPrevious={handlePreviousFriday}
                onNext={handleNextFriday}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
