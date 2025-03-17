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
  console.log("Starting analysis with preferences:", preferences);
  console.log("Minimum duration (hours):", minimumDurationHours);

  const violations: PreferenceViolation[] = [];
  const minimumDurationMs = minimumDurationHours * 60 * 60 * 1000;
  console.log("Minimum duration (ms):", minimumDurationMs);

  // Find times when all preferences are met
  const validSegments: PreferenceSegment[] = [];
  let currentSegment: PreferenceSegment | null = null;

  for (let i = 0; i < hourlyData.length; i++) {
    const hour = hourlyData[i];
    const time = hour.datetimeEpoch * 1000;
    const timeStr = new Date(time).toLocaleTimeString();
    console.log("\n--- Processing hour:", timeStr, "---");
    console.log("Current weather values:", {
      temp: hour.temp,
      windspeed: hour.windspeed,
      precipprob: hour.precipprob,
      humidity: hour.humidity,
    });

    // Check if all preferences are met for this hour
    const hourViolations: PreferenceViolation[] = [];
    const allPreferencesMet = WEATHER_FIELDS.every((field: WeatherField) => {
      const prefKey = getPreferenceKey(field);
      const prefs = preferences[prefKey];

      if (!prefs) {
        console.log(`No preferences set for ${field}`);
        return true;
      }

      const value = hour[field as keyof HourReading] as number;
      console.log(`Checking ${field}: value=${value}, prefs:`, prefs);

      if (prefs.min !== undefined && value < prefs.min) {
        console.log(`${field} below min: ${value} < ${prefs.min}`);
        hourViolations.push({
          field,
          value,
          limit: prefs.min,
          type: "min",
        });
        return false;
      }
      if (prefs.max !== undefined && value > prefs.max) {
        console.log(`${field} above max: ${value} > ${prefs.max}`);
        hourViolations.push({
          field,
          value,
          limit: prefs.max,
          type: "max",
        });
        return false;
      }
      console.log(`${field} within range`);
      return true;
    });

    // Add any violations found in this hour
    if (hourViolations.length > 0) {
      console.log("Violations in this hour:", hourViolations);
      violations.push(...hourViolations);
    }

    console.log("All preferences met for this hour?", allPreferencesMet);
    console.log("Current segment:", currentSegment);

    if (!currentSegment && allPreferencesMet) {
      console.log("Starting new valid segment");
      currentSegment = {
        startTime: time,
        endTime: time,
        isInRange: true,
      };
    } else if (currentSegment && !allPreferencesMet) {
      console.log("Ending current segment due to violation");
      currentSegment.endTime = time;
      const duration = currentSegment.endTime - currentSegment.startTime;
      console.log("Segment duration:", duration, "ms");
      if (duration >= minimumDurationMs) {
        console.log("Adding valid segment:", {
          start: new Date(currentSegment.startTime).toLocaleTimeString(),
          end: new Date(currentSegment.endTime).toLocaleTimeString(),
          duration: duration / (60 * 60 * 1000),
        });
        validSegments.push(currentSegment);
      } else {
        console.log("Segment too short, discarding");
      }
      currentSegment = null;
    } else if (currentSegment && allPreferencesMet) {
      console.log("Extending current valid segment");
      currentSegment.endTime = time;
    }
  }

  // Handle the last segment
  if (currentSegment) {
    console.log("\n--- Processing final segment ---");
    const duration = currentSegment.endTime - currentSegment.startTime;
    console.log("Final segment duration:", duration, "ms");
    if (duration >= minimumDurationMs) {
      console.log("Adding final valid segment:", {
        start: new Date(currentSegment.startTime).toLocaleTimeString(),
        end: new Date(currentSegment.endTime).toLocaleTimeString(),
        duration: duration / (60 * 60 * 1000),
      });
      validSegments.push(currentSegment);
    } else {
      console.log("Final segment too short, discarding");
    }
  }

  const result = {
    validTimeRanges: validSegments.map((segment) =>
      formatTimeRange(segment.startTime, segment.endTime)
    ),
    violations,
  };

  console.log("\n=== Final Analysis ===");
  console.log("Valid time ranges:", result.validTimeRanges);
  console.log("Total violations:", violations.length);
  console.log(
    "Unique violation fields:",
    Array.from(new Set(violations.map((v) => v.field))).join(", ")
  );

  return result;
}
