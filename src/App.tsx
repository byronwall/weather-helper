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
            width: 100%;
            max-width: 1800px;
            margin: 0 auto;
            padding: 0 1rem;
          }

          @media (max-width: 767px) {
            .weather-grid {
              grid-template-columns: minmax(0, 1fr);
            }
          }

          @media (min-width: 768px) {
            .weather-grid {
              grid-template-columns: repeat(${Math.min(
                selectedDates.length,
                2
              )}, minmax(0, 1fr));
            }
          }

          @media (min-width: 1400px) {
            .weather-grid {
              grid-template-columns: repeat(${Math.min(
                selectedDates.length,
                3
              )}, minmax(0, 1fr));
            }
          }
        `}
      </style>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="w-full p-4 space-y-4">
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
