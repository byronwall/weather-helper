import { useUserPrefs } from "../stores/userPrefsStore";
import { TimePreference } from "./TimePreference";

export function TimeAndDurationPreferences() {
  const { minimumDuration, setMinimumDuration } = useUserPrefs();

  const handleDurationChange = (value: string) => {
    const numValue = value === "" ? 1 : Number(value);
    setMinimumDuration(Math.max(0.1, numValue)); // Minimum of 0.1 hours (6 minutes)
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Time Preferences
        </h3>
        <TimePreference />
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Duration Preferences
        </h3>
        <div className="flex items-center gap-4">
          <label className="font-medium">Minimum Duration:</label>
          <input
            type="number"
            className="w-20 border rounded px-2 py-1 text-sm"
            value={minimumDuration}
            onChange={(e) => handleDurationChange(e.target.value)}
            min="0.1"
            step="0.1"
          />
          <span className="text-sm text-gray-600">hours</span>
        </div>
      </div>
    </div>
  );
}
