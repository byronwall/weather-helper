import { WeatherField } from "./types/user";
import { HourReading } from "./types/api";
import { useCommonAxis } from "./stores/useCommonAxis";
import { useUserPrefs, WeatherPreference } from "./stores/userPrefsStore";
import { useEffect } from "react";

interface WeatherChartProps {
  hourlyData: HourReading[];
  field: WeatherField;
}

interface DataPoint {
  time: number;
  value: number;
}

// Format time as "8PM"
function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date
    .toLocaleString("en-US", { hour: "numeric", hour12: true })
    .replace(" ", "");
}

// Map WeatherField to preference key
const fieldToPreferenceKey: Record<WeatherField, keyof WeatherPreference> = {
  temp: "temperature",
  windspeed: "windSpeed",
  precipprob: "precipitation",
  humidity: "humidity",
};

export function WeatherChart({ hourlyData, field }: WeatherChartProps) {
  const { registerLimit, getCurrentLimits, defaultLimits } = useCommonAxis();
  const { preferences } = useUserPrefs();

  // Get the corresponding preference key for this field
  const preferenceKey = fieldToPreferenceKey[field];
  const fieldPreferences = preferences[preferenceKey];

  const width = 600;
  const height = 300;
  const topGutterHeight = 30;
  const bottomGutterHeight = 50;
  const leftGutterWidth = 50;
  const rightGutterWidth = 20;

  // Convert hourly data to DataPoints
  const data: DataPoint[] = hourlyData.map((hour) => ({
    time: hour.datetimeEpoch * 1000,
    value: hour[field],
  }));

  // Determine min/max time & value
  const times = data.map((d) => d.time);
  const values = data.map((d) => d.value);

  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);

  // Calculate the actual min/max from data with padding
  const paddingFactor = 0.1;
  const valueRange = Math.max(...values) - Math.min(...values);
  const padding = valueRange * paddingFactor;

  const dataMinValue = Math.min(...values) - padding;
  const dataMaxValue = Math.max(...values) + padding;

  // Register the current data's limits
  useEffect(() => {
    registerLimit(field, dataMinValue, dataMaxValue);
  }, [field, dataMinValue, dataMaxValue, registerLimit]);

  // Get the current global limits
  const { min: minValue, max: maxValue } = getCurrentLimits(field);

  // Use default color for the chart
  const chartColor = defaultLimits[field].color;

  // Compute chart dimension for the central region
  const chartHeight = height - topGutterHeight - bottomGutterHeight;
  const chartWidth = width - leftGutterWidth - rightGutterWidth;

  // Scale functions
  const xScale = (t: number): number =>
    leftGutterWidth + ((t - minTime) / (maxTime - minTime)) * chartWidth;

  const yScale = (val: number): number =>
    topGutterHeight +
    chartHeight -
    ((val - minValue) / (maxValue - minValue)) * chartHeight;

  // Split data into segments and determine line thickness based on preferences
  const gapThreshold = 70 * 60 * 1000;
  const segments: Array<{ points: DataPoint[]; isInRange: boolean }> = [];
  let currentSegment: DataPoint[] = [];

  const isInRange = (value: number): boolean => {
    if (!fieldPreferences) return false;
    const aboveMin = !fieldPreferences.min || value >= fieldPreferences.min;
    const belowMax = !fieldPreferences.max || value <= fieldPreferences.max;
    return aboveMin && belowMax;
  };

  const findCrossingPoint = (
    p1: DataPoint,
    p2: DataPoint
  ): DataPoint | null => {
    if (!fieldPreferences) return null;

    const p1InRange = isInRange(p1.value);
    const p2InRange = isInRange(p2.value);

    if (p1InRange === p2InRange) return null;

    // Check which boundary we're crossing
    let boundaryValue: number | undefined;
    if (p1.value < p2.value) {
      boundaryValue = fieldPreferences.min;
    } else {
      boundaryValue = fieldPreferences.max;
    }

    if (boundaryValue === undefined) return null;

    // Linear interpolation
    const t = (boundaryValue - p1.value) / (p2.value - p1.value);
    if (t < 0 || t > 1) return null; // Sanity check for interpolation

    return {
      time: p1.time + t * (p2.time - p1.time),
      value: boundaryValue,
    };
  };

  for (let i = 0; i < data.length; i++) {
    const point = data[i];
    const prevPoint = i > 0 ? data[i - 1] : null;

    // Handle time gaps
    if (prevPoint && point.time - prevPoint.time > gapThreshold) {
      if (currentSegment.length > 0) {
        segments.push({
          points: currentSegment,
          isInRange: isInRange(currentSegment[currentSegment.length - 1].value),
        });
        currentSegment = [];
      }
      continue;
    }

    // If this is the first point or we're starting a new segment
    if (currentSegment.length === 0) {
      currentSegment.push(point);
      continue;
    }

    // Check for boundary crossing
    if (prevPoint) {
      const crossingPoint = findCrossingPoint(prevPoint, point);

      if (crossingPoint) {
        // Add the crossing point to current segment and finish it
        currentSegment.push(crossingPoint);
        segments.push({
          points: currentSegment,
          isInRange: isInRange(currentSegment[0].value),
        });

        // Start new segment from the crossing point
        currentSegment = [crossingPoint, point];
      } else {
        // No crossing, just add the point
        currentSegment.push(point);
      }
    }

    // If this is the last point, push the final segment
    if (i === data.length - 1 && currentSegment.length > 0) {
      segments.push({
        points: currentSegment,
        isInRange: isInRange(currentSegment[0].value),
      });
    }
  }

  // Generate path d-attribute for each segment
  const generatePathD = (segment: DataPoint[]): string => {
    if (segment.length === 0) return "";
    let d = `M ${xScale(segment[0].time)},${yScale(segment[0].value)}`;
    for (let i = 1; i < segment.length; i++) {
      const px = xScale(segment[i].time);
      const py = yScale(segment[i].value);
      d += ` L ${px},${py}`;
    }
    return d;
  };

  // Generate preference lines and regions
  const preferenceLines = [];
  const gutterRegions = [];

  if (fieldPreferences) {
    if (fieldPreferences.min !== undefined) {
      const y = yScale(fieldPreferences.min);
      preferenceLines.push(
        <line
          key="min-line"
          x1={leftGutterWidth}
          y1={y}
          x2={width - rightGutterWidth}
          y2={y}
          stroke={chartColor}
          strokeWidth={1}
          strokeDasharray="4,4"
        />
      );

      // Add bottom gutter region for values below min
      gutterRegions.push(
        <rect
          key="min-gutter"
          x={leftGutterWidth}
          y={y}
          width={chartWidth}
          height={chartHeight + topGutterHeight - y}
          fill={`${chartColor}20`}
        />
      );
    }

    if (fieldPreferences.max !== undefined) {
      const y = yScale(fieldPreferences.max);
      preferenceLines.push(
        <line
          key="max-line"
          x1={leftGutterWidth}
          y1={y}
          x2={width - rightGutterWidth}
          y2={y}
          stroke={chartColor}
          strokeWidth={1}
          strokeDasharray="4,4"
        />
      );

      // Add top gutter region for values above max
      gutterRegions.push(
        <rect
          key="max-gutter"
          x={leftGutterWidth}
          y={topGutterHeight}
          width={chartWidth}
          height={y - topGutterHeight}
          fill={`${chartColor}20`}
        />
      );
    }
  }

  // Generate axis ticks and gridlines
  const { increment } = defaultLimits[field];
  const numSteps = Math.floor((maxValue - minValue) / increment);
  const yTicks = Array.from({ length: numSteps + 1 }, (_, i) => {
    const value = minValue + i * increment;
    return {
      value,
      y: yScale(value),
      label: Math.round(value) + (field === "temp" ? "°" : ""),
    };
  });

  const numXTicks = 6;
  const xTicks = Array.from({ length: numXTicks + 1 }, (_, i) => {
    const time = minTime + (i / numXTicks) * (maxTime - minTime);
    return {
      time,
      x: xScale(time),
      label: formatTime(time),
    };
  });

  return (
    <svg width={width} height={height} className="bg-white rounded-lg">
      {/* Background gridlines */}
      {yTicks.map((tick, i) => (
        <line
          key={`grid-y-${i}`}
          x1={leftGutterWidth}
          y1={tick.y}
          x2={width - rightGutterWidth}
          y2={tick.y}
          stroke="#e0e0e0"
          strokeWidth={1}
        />
      ))}
      {xTicks.map((tick, i) => (
        <line
          key={`grid-x-${i}`}
          x1={tick.x}
          y1={topGutterHeight}
          x2={tick.x}
          y2={topGutterHeight + chartHeight}
          stroke="#e0e0e0"
          strokeWidth={1}
        />
      ))}

      {/* Preference gutter regions */}
      {gutterRegions}

      {/* Preference lines */}
      {preferenceLines}

      {/* Render each segment with appropriate thickness */}
      {segments.map((segment, idx) => {
        const pathD = generatePathD(segment.points);
        return (
          <g key={idx}>
            <path
              d={pathD}
              fill="none"
              stroke={chartColor}
              strokeWidth={segment.isInRange ? 3 : 1}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Add points */}
            {segment.points.map((point, pointIdx) => (
              <circle
                key={pointIdx}
                cx={xScale(point.time)}
                cy={yScale(point.value)}
                r={2}
                fill={chartColor}
              />
            ))}
          </g>
        );
      })}

      {/* Axes */}
      <line
        x1={leftGutterWidth}
        y1={topGutterHeight}
        x2={leftGutterWidth}
        y2={topGutterHeight + chartHeight}
        stroke="#666"
        strokeWidth={1}
      />
      <line
        x1={leftGutterWidth}
        y1={topGutterHeight + chartHeight}
        x2={width - rightGutterWidth}
        y2={topGutterHeight + chartHeight}
        stroke="#666"
        strokeWidth={1}
      />

      {/* Y-axis ticks and labels */}
      {yTicks.map((tick, i) => (
        <g key={`tick-y-${i}`}>
          <line
            x1={leftGutterWidth - 5}
            y1={tick.y}
            x2={leftGutterWidth}
            y2={tick.y}
            stroke="#666"
            strokeWidth={1}
          />
          <text
            x={leftGutterWidth - 8}
            y={tick.y}
            textAnchor="end"
            dominantBaseline="middle"
            fontSize="12px"
            fill="#666"
          >
            {tick.label}
          </text>
        </g>
      ))}

      {/* X-axis ticks and labels */}
      {xTicks.map((tick, i) => (
        <g key={`tick-x-${i}`}>
          <line
            x1={tick.x}
            y1={topGutterHeight + chartHeight}
            x2={tick.x}
            y2={topGutterHeight + chartHeight + 5}
            stroke="#666"
            strokeWidth={1}
          />
          <text
            x={tick.x}
            y={height - 15}
            textAnchor="middle"
            fontSize="12px"
            fill="#666"
          >
            {tick.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
