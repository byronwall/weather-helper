import { examplePrefs } from "../stores/prefExamples";
import { useUserPrefs } from "../stores/userPrefsStore";

export const ActivitySelector = () => {
  const { setPreference } = useUserPrefs();

  const handleActivityChange = (activity: string) => {
    const selectedActivity = examplePrefs.find(
      (pref) => pref.activity === activity
    );
    if (!selectedActivity) return;

    // Clear existing preferences first
    const metrics: (keyof typeof selectedActivity.weatherPreference)[] = [
      "temperature",
      "humidity",
      "windSpeed",
      "precipitation",
    ];
    metrics.forEach((metric) => {
      const pref = selectedActivity.weatherPreference[metric];
      if (pref) {
        setPreference(metric, pref.min, pref.max);
      }
    });
  };

  return (
    <div className="flex  gap-2">
      <label
        htmlFor="activity-select"
        className="font-medium text-gray-700 shrink-0"
      >
        Select an activity
      </label>
      <select
        id="activity-select"
        className="block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        onChange={(e) => handleActivityChange(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled>
          Choose an activity...
        </option>
        {examplePrefs.map((pref) => (
          <option key={pref.activity} value={pref.activity}>
            {pref.activity}
          </option>
        ))}
      </select>
    </div>
  );
};
