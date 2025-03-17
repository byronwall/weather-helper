import { WeatherPreference } from "../stores/userPrefsStore";
import { HourReading } from "../types/api";
import { WeatherField } from "../types/user";

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
  };
}

export function analyzePreferences(
  hourlyData: HourReading[],
  field: WeatherField,
  preferences: Partial<WeatherPreference>
): PreferenceAnalysis {
  const fieldPrefs = preferences[getPreferenceKey(field)];
  if (!fieldPrefs) {
    return {
      segments: [],
      summary: {
        totalDuration: 0,
        inRangeDuration: 0,
        percentInRange: 0,
      },
    };
  }

  const segments: PreferenceSegment[] = [];
  let currentSegment: PreferenceSegment | null = null;
  let inRangeDuration = 0;

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
      segments.push(currentSegment);
      currentSegment = {
        startTime: time,
        endTime: time,
        isInRange,
      };
    } else {
      currentSegment.endTime = time;
    }

    // Add duration to inRange total if applicable
    if (isInRange && i < hourlyData.length - 1) {
      const nextTime = hourlyData[i + 1].datetimeEpoch * 1000;
      inRangeDuration += nextTime - time;
    }
  }

  if (currentSegment) {
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
