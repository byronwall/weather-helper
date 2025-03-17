import * as React from "react";
import { Header } from "./Header";
import { WeatherCard } from "./WeatherCard";
import { useWeatherStore } from "./stores/weatherStore";

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
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      {/* Container with standard Tailwind max-width and padding */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <Header />

        {/* Main content: 2 weather cards side by side on desktop */}
        <main className="flex flex-col space-y-8 md:flex-row md:space-y-0 md:space-x-8">
          {/* Current Friday Card */}
          <WeatherCard
            date={currentDate}
            location="46220"
            onPrevious={handlePreviousFriday}
            onNext={handleNextFriday}
          />

          {/* Next Friday Card */}
          <WeatherCard
            date={nextFridayDate}
            location="46220"
            onPrevious={handlePreviousFriday}
            onNext={handleNextFriday}
          />
        </main>
      </div>
    </div>
  );
}
