import { useWeatherStore } from "./stores/weatherStore";

export function Header() {
  const { selectedLocation } = useWeatherStore();

  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
      <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:items-center md:space-x-6">
        <div className="text-2xl font-bold">Weather or Not</div>

        <div className="flex items-center space-x-1 text-sm text-gray-600">
          <span className="material-icons text-gray-500">location_on</span>
          <span>{selectedLocation || "Select Location"}</span>
        </div>

        <div className="text-sm text-gray-700">
          <span className="mr-1">Every Friday</span>
          <span className="mr-1">•</span>
          <span>Afternoon</span>
        </div>
      </div>
    </header>
  );
}
