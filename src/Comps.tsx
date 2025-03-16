/**
 * Header component
 * Maps to the wireframe's top bar with:
 *   - Logo/Brand
 *   - Location info (Dolores Park, SF)
 *   - Day/time selection (Every Friday • Afternoon)
 *   - Right side links (Help, Sign Out)
 */
export function Header() {
  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
      {/* Left side: Brand & Location */}
      <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:items-center md:space-x-6">
        {/* Logo / Brand Name */}
        <div className="text-2xl font-bold">Weather or Not</div>

        {/* Location Info */}
        <div className="flex items-center space-x-1 text-sm text-gray-600">
          {/* Placeholder for a location icon */}
          <span className="material-icons text-gray-500">location_on</span>
          <span>Dolores Park, SF</span>
        </div>

        {/* Day/Time Selection */}
        <div className="text-sm text-gray-700">
          <span className="mr-1">Every Friday</span>
          <span className="mr-1">•</span>
          <span>Afternoon</span>
        </div>
      </div>

      {/* Right side: Help / Sign Out */}
      <div className="flex items-center space-x-4 mt-4 md:mt-0">
        <a href="#" className="text-sm text-gray-600 hover:text-gray-800">
          Help
        </a>
        <a href="#" className="text-sm text-gray-600 hover:text-gray-800">
          Sign Out
        </a>
      </div>
    </header>
  );
}

/**
 * WeatherCard component
 * Displays:
 *   - headingText (e.g., "This Friday the 15th")
 *   - icon (optional) and weather details
 *   - placeholder chart area
 *   - optional prev/next nav
 */
export function WeatherCard({ headingText, weatherSummary, navigation, icon }) {
  // Example `weatherSummary` might be:
  // {
  //   temperature: "Sunny 71°F",
  //   details: "winds 5mph • no rain"
  // }
  //
  // Example `navigation` might be:
  // {
  //   showPrev: true,
  //   prevLabel: "Previous Friday",
  //   showNext: true,
  //   nextLabel: "Next Friday"
  // }

  return (
    <div className="bg-white rounded shadow p-4 w-full">
      {/* Heading */}
      <h2 className="text-xl font-bold mb-2">{headingText}</h2>

      {/* Weather summary row */}
      <div className="flex items-center space-x-4 mb-4">
        {/* Placeholder for weather icon */}
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100">
          {icon ? icon : <span className="text-xl">⛅</span>}
        </div>

        {/* Text summary: temperature, wind, etc. */}
        <div className="text-sm">
          <p className="font-semibold">{weatherSummary.temperature}</p>
          <p>{weatherSummary.details}</p>
        </div>
      </div>

      {/* Placeholder Chart Area */}
      <div className="bg-gray-100 h-48 rounded flex items-center justify-center text-sm text-gray-500">
        {/* This is where you'd integrate your chart library */}
        <span>Chart Placeholder (e.g., 11:00 - 7:00)</span>
      </div>

      {/* Potential Nav Controls (Previous/Next) */}
      {navigation && (navigation.showPrev || navigation.showNext) && (
        <div className="flex justify-between items-center mt-4 text-sm">
          {navigation.showPrev ? (
            <button className="text-blue-500 hover:underline">
              &laquo; {navigation.prevLabel}
            </button>
          ) : (
            <div></div>
          )}
          {navigation.showNext ? (
            <button className="text-blue-500 hover:underline">
              {navigation.nextLabel} &raquo;
            </button>
          ) : (
            <div></div>
          )}
        </div>
      )}
    </div>
  );
}
