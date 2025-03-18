import * as React from "react";
import { Header } from "./Header";
import { WeatherCard } from "./WeatherCard";
import { useWeatherStore } from "./stores/weatherStore";

export function App() {
  const { loadSampleData, selectedDates } = useWeatherStore();
  const gridRef = React.useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = React.useState(0);

  // Load sample data when component mounts
  React.useEffect(() => {
    loadSampleData().catch(console.error);
  }, [loadSampleData]);

  // Setup resize observer for the grid
  React.useEffect(() => {
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
            max-width: 1800px;
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
          <div className="weather-grid" ref={gridRef}>
            {selectedDates.length === 0 ? (
              <div className="bg-white rounded shadow p-4">
                <p className="text-gray-500 text-center">
                  Select dates above to view weather details
                </p>
              </div>
            ) : (
              selectedDates
                .sort((a, b) => a.getTime() - b.getTime())
                .map((date) => (
                  <div key={date.toISOString()}>
                    <WeatherCard date={date} width={chartWidth} />
                  </div>
                ))
            )}
          </div>
        </main>
      </div>
    </>
  );
}
