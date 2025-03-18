import { useEffect, useRef, useState } from "react";
import { Header } from "./Header";
import { WeatherCard } from "./WeatherCard";
import { LocationInput } from "./components/LocationInput";
import { useWeatherStore } from "./stores/weatherStore";

export function App() {
  const { selectedDates, selectedLocation } = useWeatherStore();

  const gridRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(0);

  // Setup resize observer for the grid
  useEffect(() => {
    if (!gridRef.current) {
      return;
    }

    const updateChartWidth = () => {
      if (!gridRef.current) {
        return;
      }

      // Get the actual width of a grid cell by measuring a child element
      const firstChild = gridRef.current.firstElementChild as HTMLElement;
      if (firstChild) {
        const width = firstChild.offsetWidth;
        setChartWidth(width - 32); // Subtract padding (2 * 16px)
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      updateChartWidth();
    });

    resizeObserver.observe(gridRef.current);
    // Initial width calculation
    updateChartWidth();

    return () => resizeObserver.disconnect();
  }, [selectedDates.length]); // Re-run when number of dates changes

  return (
    <>
      <style>
        {`
          .weather-grid {
            display: grid;
            gap: 1rem;
            grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
            max-width: min(1800px, 90vw);
            margin: 0 auto;
          }

          @media (min-width: 641px) {
            .weather-grid {
              grid-template-columns: ${
                selectedDates.length === 2 ? "repeat(2, 1fr)" : "repeat(3, 1fr)"
              };
            }
          }

          @media (max-width: 640px) {
            .weather-grid {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto p-4 space-y-4">
          {!selectedLocation && (
            <div className="bg-white rounded shadow p-4 w-fit mx-auto">
              <LocationInput />
            </div>
          )}

          <div className="weather-grid" ref={gridRef}>
            {selectedDates &&
              selectedDates
                .sort((a, b) => a.getTime() - b.getTime())
                .map((date) => (
                  <div key={date.toISOString()}>
                    <WeatherCard date={date} width={chartWidth} />
                  </div>
                ))}
          </div>
        </main>
      </div>
    </>
  );
}
