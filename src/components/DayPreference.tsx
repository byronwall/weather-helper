import { useUserPrefs } from "../stores/userPrefsStore";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function DayPreference() {
  const { preferredDayOfWeek, setPreferredDayOfWeek } = useUserPrefs();

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="dayPreference"
        className="text-sm font-medium text-gray-700"
      >
        Preferred Day:
      </label>
      <select
        id="dayPreference"
        value={preferredDayOfWeek === null ? "" : preferredDayOfWeek}
        onChange={(e) => {
          const value = e.target.value;
          setPreferredDayOfWeek(value === "" ? null : parseInt(value, 10));
        }}
        className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
      >
        <option value="">Any day</option>
        {DAYS_OF_WEEK.map((day, index) => (
          <option key={day} value={index}>
            {day}
          </option>
        ))}
      </select>
    </div>
  );
}
