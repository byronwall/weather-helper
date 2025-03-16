import { Header, WeatherCard } from "./Comps";

/**
 * App component
 * Arranges the Header and two WeatherCards in a responsive layout.
 */

export function App() {
  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      {/* Container with standard Tailwind max-width and padding */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <Header />

        {/* Main content: 2 weather cards side by side on desktop */}
        <main className="flex flex-col space-y-8 md:flex-row md:space-y-0 md:space-x-8">
          {/* "This Friday the 15th" Card */}
          <WeatherCard
            headingText="This Friday the 15th"
            weatherSummary={{
              temperature: "Sunny 71°F",
              details: "winds 5mph • no rain",
            }}
            navigation={{
              showPrev: true,
              prevLabel: "Previous Friday",
              showNext: true,
              nextLabel: "Next Friday",
            }}
            icon={<span className="text-2xl">☀️</span>}
          />

          {/* "Next Friday the 15th" Card */}
          <WeatherCard
            headingText="Next Friday the 15th"
            weatherSummary={{
              temperature: "Cloudy 62°F",
              details: "winds 20mph • 40% chance rain",
            }}
            navigation={{
              showPrev: true,
              prevLabel: "Previous Friday",
              showNext: true,
              nextLabel: "Next Friday",
            }}
            icon={<span className="text-2xl">☁️</span>}
          />
        </main>
      </div>
    </div>
  );
}
