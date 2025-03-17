import { WeatherPreference } from "../stores/userPrefsStore";
import { HourReading } from "../types/api";
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

export function analyzePreferences(
  hourlyData: HourReading[],
  field: WeatherField,
  preferences: Partial<WeatherPreference>,
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
    const time = current.datetimeEpoch * 1000;
    const isInRange = isValueInRange(value, fieldPrefs);

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
      const nextTime = hourlyData[i + 1].datetimeEpoch * 1000;
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
  hourlyData: HourReading[],
  preferences: Partial<WeatherPreference>,
  minimumDurationHours: number = 1
): CombinedPreferenceAnalysis {
  const violations: PreferenceViolation[] = [];
  const minimumDurationMs = minimumDurationHours * 60 * 60 * 1000;

  // Check for violations first
  for (const field of WEATHER_FIELDS) {
    const prefKey = getPreferenceKey(field);
    const prefs = preferences[prefKey];

    if (prefs) {
      for (const hour of hourlyData) {
        const value = hour[field as keyof HourReading] as number;
        if (prefs.min !== undefined && value < prefs.min) {
          violations.push({
            field,
            value,
            limit: prefs.min,
            type: "min",
          });
        }
        if (prefs.max !== undefined && value > prefs.max) {
          violations.push({
            field,
            value,
            limit: prefs.max,
            type: "max",
          });
        }
      }
    }
  }

  // If there are violations, return early
  if (violations.length > 0) {
    return {
      validTimeRanges: [],
      violations,
    };
  }

  // Find times when all preferences are met
  const validSegments: PreferenceSegment[] = [];
  let currentSegment: PreferenceSegment | null = null;

  for (let i = 0; i < hourlyData.length; i++) {
    const hour = hourlyData[i];
    const time = hour.datetimeEpoch * 1000;

    // Check if all preferences are met for this hour
    const allPreferencesMet = WEATHER_FIELDS.every((field: WeatherField) => {
      const prefKey = getPreferenceKey(field);
      const prefs = preferences[prefKey];
      return (
        !prefs ||
        isValueInRange(hour[field as keyof HourReading] as number, prefs)
      );
    });

    if (!currentSegment && allPreferencesMet) {
      currentSegment = {
        startTime: time,
        endTime: time,
        isInRange: true,
      };
    } else if (currentSegment && !allPreferencesMet) {
      currentSegment.endTime = time;
      if (
        currentSegment.endTime - currentSegment.startTime >=
        minimumDurationMs
      ) {
        validSegments.push(currentSegment);
      }
      currentSegment = null;
    } else if (currentSegment && allPreferencesMet) {
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

  return {
    validTimeRanges: validSegments.map((segment) =>
      formatTimeRange(segment.startTime, segment.endTime)
    ),
    violations: [],
  };
}
