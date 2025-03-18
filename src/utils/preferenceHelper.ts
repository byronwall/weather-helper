import { WeatherPreference, TimePreference } from "../stores/userPrefsStore";
import { WeatherMetric } from "../stores/weatherTypes";
import { WeatherField } from "../types/user";

const WEATHER_FIELDS: WeatherField[] = [
  "temp",
  "windspeed",
  "precipprob",
  "humidity",
];

export interface PreferenceSegment {
  startTime: number;
  endTime: number;
  isInRange: boolean;
}

export interface PreferenceAnalysis {
  segments: PreferenceSegment[];
  summary: {
    totalDuration: number;
    inRangeDuration: number;
    percentInRange: number;
    validRanges: string[];
  };
}

export interface PreferenceViolation {
  field: WeatherField;
  value: number;
  limit: number;
  type: "min" | "max";
}

export interface CombinedPreferenceAnalysis {
  validTimeRanges: string[];
  violations: PreferenceViolation[];
}

// Format time as "8 AM" or "2 PM"
function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString("en-US", {
    hour: "numeric",
    hour12: true,
  });
}

// Format a time range as "8 AM - 2 PM"
function formatTimeRange(start: number, end: number): string {
  return `${formatTime(start)} - ${formatTime(end)}`;
}

// Check if a timestamp is within the preferred time range
function isWithinTimeRange(
  timestamp: number,
  timePreference: TimePreference
): boolean {
  const date = new Date(timestamp);
  const hour = date.getHours();
  return hour >= timePreference.startHour && hour <= timePreference.endHour;
}

export function analyzePreferences(
  hourlyData: WeatherMetric[],
  field: WeatherField,
  preferences: Partial<WeatherPreference>,
  timePreference: TimePreference,
  minimumDurationHours: number = 1
): PreferenceAnalysis {
  const fieldPrefs = preferences[getPreferenceKey(field)];
  if (!fieldPrefs) {
    return {
      segments: [],
      summary: {
        totalDuration: 0,
        inRangeDuration: 0,
        percentInRange: 0,
        validRanges: [],
      },
    };
  }

  const segments: PreferenceSegment[] = [];
  let currentSegment: PreferenceSegment | null = null;
  let inRangeDuration = 0;
  const minimumDurationMs = minimumDurationHours * 60 * 60 * 1000;
  const validRanges: string[] = [];

  for (let i = 0; i < hourlyData.length; i++) {
    const current = hourlyData[i];
    const value = current[field];
    const time = current.timestamp * 1000;
    const isInTimeRange = isWithinTimeRange(time, timePreference);
    const isInValueRange = isValueInRange(value, fieldPrefs);
    const isInRange = isInTimeRange && isInValueRange;

    if (!currentSegment) {
      currentSegment = {
        startTime: time,
        endTime: time,
        isInRange,
      };
    } else if (currentSegment.isInRange !== isInRange) {
      currentSegment.endTime = time;

      // If this was an in-range segment and it meets the minimum duration
      if (
        currentSegment.isInRange &&
        currentSegment.endTime - currentSegment.startTime >= minimumDurationMs
      ) {
        validRanges.push(
          formatTimeRange(currentSegment.startTime, currentSegment.endTime)
        );
      }

      segments.push(currentSegment);
      currentSegment = {
        startTime: time,
        endTime: time,
        isInRange,
      };
    } else {
      currentSegment.endTime = time;
    }

    // Add duration to inRange total if applicable and meets minimum duration
    if (isInRange && i < hourlyData.length - 1) {
      const nextTime = hourlyData[i + 1].timestamp * 1000;
      const segmentDuration = nextTime - time;
      if (segmentDuration >= minimumDurationMs) {
        inRangeDuration += segmentDuration;
      }
    }
  }

  if (currentSegment) {
    // Check the last segment
    if (
      currentSegment.isInRange &&
      currentSegment.endTime - currentSegment.startTime >= minimumDurationMs
    ) {
      validRanges.push(
        formatTimeRange(currentSegment.startTime, currentSegment.endTime)
      );
    }
    segments.push(currentSegment);
  }

  const totalDuration = segments.reduce(
    (sum, segment) => sum + (segment.endTime - segment.startTime),
    0
  );

  return {
    segments,
    summary: {
      totalDuration,
      inRangeDuration,
      percentInRange: (inRangeDuration / totalDuration) * 100,
      validRanges,
    },
  };
}

export function isValueInRange(
  value: number,
  prefs: { min?: number; max?: number }
): boolean {
  const aboveMin = !prefs.min || value >= prefs.min;
  const belowMax = !prefs.max || value <= prefs.max;
  return aboveMin && belowMax;
}

export function getPreferenceKey(field: WeatherField): keyof WeatherPreference {
  const fieldToPreferenceKey: Record<WeatherField, keyof WeatherPreference> = {
    temp: "temperature",
    windspeed: "windSpeed",
    precipprob: "precipitation",
    humidity: "humidity",
  };
  return fieldToPreferenceKey[field];
}

export function analyzeCombinedPreferences(
  hourlyData: WeatherMetric[],
  preferences: Partial<WeatherPreference>,
  timePreference: TimePreference,
  minimumDurationHours: number = 1
): CombinedPreferenceAnalysis {
  const violations: PreferenceViolation[] = [];
  const minimumDurationMs = minimumDurationHours * 60 * 60 * 1000;

  // Find times when all preferences are met
  const validSegments: PreferenceSegment[] = [];
  let currentSegment: PreferenceSegment | null = null;

  for (let i = 0; i < hourlyData.length; i++) {
    const hour = hourlyData[i];
    const time = hour.timestamp * 1000;

    // Check if time is within preferred range
    const isInTimeRange = isWithinTimeRange(time, timePreference);
    if (!isInTimeRange) {
      continue;
    }

    // Check if all preferences are met for this hour
    const hourViolations: PreferenceViolation[] = [];
    const allPreferencesMet = WEATHER_FIELDS.every((field: WeatherField) => {
      const prefKey = getPreferenceKey(field);
      const prefs = preferences[prefKey];

      if (!prefs) {
        return true;
      }

      const value = hour[field];

      if (prefs.min !== undefined && value < prefs.min) {
        hourViolations.push({
          field,
          value,
          limit: prefs.min,
          type: "min",
        });
        return false;
      }
      if (prefs.max !== undefined && value > prefs.max) {
        hourViolations.push({
          field,
          value,
          limit: prefs.max,
          type: "max",
        });
        return false;
      }
      return true;
    });

    // Add any violations found in this hour
    if (hourViolations.length > 0) {
      violations.push(...hourViolations);
    }

    if (!currentSegment && allPreferencesMet) {
      currentSegment = {
        startTime: time,
        endTime: time,
        isInRange: true,
      };
    } else if (currentSegment && !allPreferencesMet) {
      if (
        currentSegment.endTime - currentSegment.startTime >=
        minimumDurationMs
      ) {
        validSegments.push(currentSegment);
      }
      currentSegment = null;
    } else if (currentSegment) {
      currentSegment.endTime = time;
    }
  }

  // Handle the last segment
  if (
    currentSegment &&
    currentSegment.endTime - currentSegment.startTime >= minimumDurationMs
  ) {
    validSegments.push(currentSegment);
  }

  // Format valid time ranges
  const validTimeRanges = validSegments.map((segment) =>
    formatTimeRange(segment.startTime, segment.endTime)
  );

  return {
    validTimeRanges,
    violations,
  };
}
