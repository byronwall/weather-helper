import { useWeatherStore } from "./stores/weatherStore";

export function Header() {
  const { selectedLocation } = useWeatherStore();

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
          <span>{selectedLocation || "Select Location"}</span>
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
