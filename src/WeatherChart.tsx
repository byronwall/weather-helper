import { useEffect } from "react";
import { useCommonAxis } from "./stores/useCommonAxis";
import { useUserPrefs } from "./stores/userPrefsStore";
import { WeatherMetric } from "./stores/weatherTypes";
import { WeatherField } from "./types/user";
import { getPreferenceKey } from "./utils/preferenceHelper";
import { useChartSettings } from "./stores/chartSettingsStore";

interface WeatherChartProps {
  hourlyData: WeatherMetric[];
  field: WeatherField;
  width: number;
  label: string;
  unit: string;
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

export function WeatherChart({
  hourlyData,
  field,
  width,
  label,
  unit,
}: WeatherChartProps) {
  const { registerLimit, getCurrentLimits, defaultLimits } = useCommonAxis();
  const { preferences, timePreference } = useUserPrefs();
  const { settings } = useChartSettings();

  // Get the corresponding preference key for this field
  const preferenceKey = getPreferenceKey(field);
  const fieldPreferences = preferences[preferenceKey];

  // Calculate height based on width and aspect ratio, respecting max height
  const calculatedHeight = Math.round(width / settings.chartAspectRatio);
  const height = Math.min(calculatedHeight, settings.maxChartHeight);

  // Limit width to max chart width
  const adjustedWidth = Math.min(width, settings.maxChartWidth);

  // Calculate height based on width and aspect ratio
  const {
    topGutterHeight,
    bottomGutterHeight,
    leftAxisLabel,
    leftGutterPadding,
    rightGutterWidth,
  } = settings;
  const leftGutterWidth = leftAxisLabel + leftGutterPadding;

  // Convert hourly data to DataPoints
  const data: DataPoint[] = hourlyData.map((hour) => ({
    time: hour.timestamp * 1000,
    value: hour[field],
  }));

  // Determine min/max time & value
  const times = data.map((d) => d.time);
  const values = data.map((d) => d.value);

  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);

  // Calculate the actual min/max from data and preferences with padding
  const paddingFactor = settings.valuePaddingFactor;

  // Start with data min/max
  let dataMinValue = Math.min(...values);
  let dataMaxValue = Math.max(...values);

  // Include preference limits if they exist
  if (fieldPreferences) {
    if (fieldPreferences.min !== undefined) {
      dataMinValue = Math.min(dataMinValue, fieldPreferences.min);
    }
    if (fieldPreferences.max !== undefined) {
      dataMaxValue = Math.max(dataMaxValue, fieldPreferences.max);
    }
  }

  // Add padding based on the expanded range
  const valueRange = dataMaxValue - dataMinValue;
  const padding = valueRange * paddingFactor;

  dataMinValue = dataMinValue - padding;
  dataMaxValue = dataMaxValue + padding;

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
  const chartWidth = adjustedWidth - leftGutterWidth - rightGutterWidth;

  // Scale functions
  const xScale = (t: number): number =>
    leftGutterWidth + ((t - minTime) / (maxTime - minTime)) * chartWidth;

  const yScale = (val: number): number =>
    topGutterHeight +
    chartHeight -
    ((val - minValue) / (maxValue - minValue)) * chartHeight;

  // Generate path d-attribute for the main line
  const generatePathD = (points: DataPoint[]): string => {
    if (points.length === 0) {
      return "";
    }

    if (settings.lineStyle === "curved") {
      // Generate curved path using cubic bezier curves
      let d = `M ${xScale(points[0].time)},${yScale(points[0].value)}`;
      for (let i = 1; i < points.length; i++) {
        const x1 = xScale(points[i - 1].time);
        const y1 = yScale(points[i - 1].value);
        const x2 = xScale(points[i].time);
        const y2 = yScale(points[i].value);

        // Control points for the curve
        const cp1x = x1 + (x2 - x1) / 3;
        const cp1y = y1;
        const cp2x = x1 + ((x2 - x1) * 2) / 3;
        const cp2y = y2;

        d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}`;
      }
      return d;
    }

    // Default straight line path
    let d = `M ${xScale(points[0].time)},${yScale(points[0].value)}`;
    for (let i = 1; i < points.length; i++) {
      const px = xScale(points[i].time);
      const py = yScale(points[i].value);
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
          x2={adjustedWidth - rightGutterWidth}
          y2={y}
          stroke={chartColor}
          strokeWidth={1}
          strokeDasharray="4,4"
        />
      );

      // Create paths for out-of-range regions
      const belowMinPoints: DataPoint[] = [];
      data.forEach((point, index) => {
        if (point.value < fieldPreferences.min!) {
          if (index > 0 && data[index - 1].value >= fieldPreferences.min!) {
            // Add the crossing point
            const t =
              (fieldPreferences.min! - data[index - 1].value) /
              (point.value - data[index - 1].value);
            const crossingTime =
              data[index - 1].time + t * (point.time - data[index - 1].time);
            belowMinPoints.push({
              time: crossingTime,
              value: fieldPreferences.min!,
            });
          }
          belowMinPoints.push(point);
          if (
            index < data.length - 1 &&
            data[index + 1].value >= fieldPreferences.min!
          ) {
            // Add the crossing point
            const t =
              (fieldPreferences.min! - point.value) /
              (data[index + 1].value - point.value);
            const crossingTime =
              point.time + t * (data[index + 1].time - point.time);
            belowMinPoints.push({
              time: crossingTime,
              value: fieldPreferences.min!,
            });
          }
        }
      });

      // Create shaded region for below min
      if (belowMinPoints.length > 0) {
        let d = "";
        belowMinPoints.forEach((point, index) => {
          if (index === 0) {
            d += `M ${xScale(point.time)} ${yScale(fieldPreferences.min!)} `;
          }
          d += `L ${xScale(point.time)} ${yScale(point.value)} `;
          if (index === belowMinPoints.length - 1) {
            d += `L ${xScale(point.time)} ${yScale(fieldPreferences.min!)} Z`;
          }
        });

        gutterRegions.push(
          <path key="min-gutter" d={d} fill={`url(#below-gradient-${field})`} />
        );
      }
    }

    if (fieldPreferences.max !== undefined) {
      const y = yScale(fieldPreferences.max);
      preferenceLines.push(
        <line
          key="max-line"
          x1={leftGutterWidth}
          y1={y}
          x2={adjustedWidth - rightGutterWidth}
          y2={y}
          stroke={chartColor}
          strokeWidth={1}
          strokeDasharray="4,4"
        />
      );

      // Create paths for out-of-range regions
      const aboveMaxPoints: DataPoint[] = [];
      data.forEach((point, index) => {
        if (point.value > fieldPreferences.max!) {
          if (index > 0 && data[index - 1].value <= fieldPreferences.max!) {
            // Add the crossing point
            const t =
              (fieldPreferences.max! - data[index - 1].value) /
              (point.value - data[index - 1].value);
            const crossingTime =
              data[index - 1].time + t * (point.time - data[index - 1].time);
            aboveMaxPoints.push({
              time: crossingTime,
              value: fieldPreferences.max!,
            });
          }
          aboveMaxPoints.push(point);
          if (
            index < data.length - 1 &&
            data[index + 1].value <= fieldPreferences.max!
          ) {
            // Add the crossing point
            const t =
              (fieldPreferences.max! - point.value) /
              (data[index + 1].value - point.value);
            const crossingTime =
              point.time + t * (data[index + 1].time - point.time);
            aboveMaxPoints.push({
              time: crossingTime,
              value: fieldPreferences.max!,
            });
          }
        }
      });

      // Create shaded region for above max
      if (aboveMaxPoints.length > 0) {
        let d = "";
        aboveMaxPoints.forEach((point, index) => {
          if (index === 0) {
            d += `M ${xScale(point.time)} ${yScale(fieldPreferences.max!)} `;
          }
          d += `L ${xScale(point.time)} ${yScale(point.value)} `;
          if (index === aboveMaxPoints.length - 1) {
            d += `L ${xScale(point.time)} ${yScale(fieldPreferences.max!)} Z`;
          }
        });

        gutterRegions.push(
          <path key="max-gutter" d={d} fill={`url(#above-gradient-${field})`} />
        );
      }
    }
  }

  // Generate axis ticks and gridlines
  const { increment } = defaultLimits[field];

  // Calculate how many increments would fit with the base increment
  const baseNumSteps = Math.floor((maxValue - minValue) / increment);
  const pixelsPerStep = chartHeight / baseNumSteps;

  // Calculate multiplier needed to meet minimum pixel threshold
  const multiplier = Math.ceil(
    settings.minPixelsBetweenYLabels / pixelsPerStep
  );
  const adjustedIncrement = increment * multiplier;

  const numSteps = Math.floor((maxValue - minValue) / adjustedIncrement);
  const yTicks = Array.from({ length: numSteps + 1 }, (_, i) => {
    const value = minValue + i * adjustedIncrement;
    return {
      value,
      y: yScale(value),
      label: Math.round(value) + (field === "temp" ? "°" : ""),
    };
  });

  // Calculate preferred time range lines
  const startDate = new Date(minTime);
  startDate.setHours(timePreference.startHour, 0, 0, 0);
  const endDate = new Date(minTime);
  endDate.setHours(timePreference.endHour, 0, 0, 0);

  const startX = xScale(startDate.getTime());
  const endX = xScale(endDate.getTime());

  // Generate x-axis ticks with preference times as anchors
  const timeRangeWidth = endX - startX;
  const possibleMiddleTicks =
    Math.floor(timeRangeWidth / settings.minPixelsBetweenXLabels) - 1;

  // Start with preferred time range
  const xTickTimes = [startDate.getTime(), endDate.getTime()];

  // Add ticks between preferred times
  if (possibleMiddleTicks > 0) {
    const timeInterval =
      (endDate.getTime() - startDate.getTime()) / (possibleMiddleTicks + 1);
    for (let i = 1; i <= possibleMiddleTicks; i++) {
      const middleTime = startDate.getTime() + timeInterval * i;
      // Insert the time in the correct position to maintain chronological order
      const insertIndex = xTickTimes.findIndex((t) => t > middleTime);
      xTickTimes.splice(insertIndex, 0, middleTime);
    }
  }

  // Add additional times before start time
  let currentTime = startDate.getTime();
  while (currentTime > minTime) {
    currentTime -= 3600000; // subtract 1 hour
    const potentialX = xScale(currentTime);
    const lastX = xScale(xTickTimes[0]);
    if (lastX - potentialX >= settings.minPixelsBetweenXLabels) {
      xTickTimes.unshift(currentTime);
    } else {
      break;
    }
  }

  // Add additional times after end time
  currentTime = endDate.getTime();
  while (currentTime < maxTime) {
    currentTime += 3600000; // add 1 hour
    const potentialX = xScale(currentTime);
    const lastX = xScale(xTickTimes[xTickTimes.length - 1]);
    if (potentialX - lastX >= settings.minPixelsBetweenXLabels) {
      xTickTimes.push(currentTime);
    } else {
      break;
    }
  }

  // Create tick objects
  const xTicks = xTickTimes.map((time) => ({
    time,
    x: xScale(time),
    label: formatTime(time),
    isPreferred: time === startDate.getTime() || time === endDate.getTime(),
    isMiddle: time > startDate.getTime() && time < endDate.getTime(),
  }));

  const verticalLineStyle = {
    stroke: "#666",
    strokeWidth: 1,
    strokeDasharray: "4,4",
  };

  return (
    <div className="space-y-2">
      <svg
        width={adjustedWidth}
        height={height}
        className="bg-white rounded-lg"
      >
        {/* Gradient definitions */}
        <defs>
          <linearGradient
            id={`below-gradient-${field}`}
            x1="0"
            x2="0"
            y1="0"
            y2="1"
          >
            {Array.from({ length: settings.gradientStopCount }).map((_, i) => {
              const offset = (100 / (settings.gradientStopCount - 1)) * i;
              const opacity =
                i === 0
                  ? 0
                  : settings.gradientOpacityBelow *
                    (i / (settings.gradientStopCount - 1));
              return (
                <stop
                  key={i}
                  offset={`${offset}%`}
                  stopColor={chartColor}
                  stopOpacity={opacity}
                />
              );
            })}
          </linearGradient>
          <linearGradient
            id={`above-gradient-${field}`}
            x1="0"
            x2="0"
            y1="0"
            y2="1"
          >
            {Array.from({ length: settings.gradientStopCount }).map((_, i) => {
              const offset = (100 / (settings.gradientStopCount - 1)) * i;
              const opacity =
                settings.gradientOpacityAbove *
                (1 - i / (settings.gradientStopCount - 1));
              return (
                <stop
                  key={i}
                  offset={`${offset}%`}
                  stopColor={chartColor}
                  stopOpacity={opacity}
                />
              );
            })}
          </linearGradient>
        </defs>

        {/* Y-axis label */}
        <text
          x={leftAxisLabel - 10}
          y={height / 2}
          transform={`rotate(-90 ${leftAxisLabel - 10} ${height / 2})`}
          textAnchor="middle"
          fontSize="14px"
          fill="#666"
          className="font-medium"
        >
          {label} ({unit})
        </text>

        {/* Background gridlines */}
        {yTicks.map((tick, i) => (
          <line
            key={`grid-y-${i}`}
            x1={leftGutterWidth}
            y1={tick.y}
            x2={adjustedWidth - rightGutterWidth}
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

        {/* Preference time range lines */}
        <line
          key="time-start"
          x1={startX}
          y1={topGutterHeight}
          x2={startX}
          y2={topGutterHeight + chartHeight}
          stroke={verticalLineStyle.stroke}
          strokeWidth={verticalLineStyle.strokeWidth}
          strokeDasharray={verticalLineStyle.strokeDasharray}
        />
        <line
          key="time-end"
          x1={endX}
          y1={topGutterHeight}
          x2={endX}
          y2={topGutterHeight + chartHeight}
          stroke={verticalLineStyle.stroke}
          strokeWidth={verticalLineStyle.strokeWidth}
          strokeDasharray={verticalLineStyle.strokeDasharray}
        />

        {/* Preference gutter regions */}
        {gutterRegions}

        {/* Preference lines */}
        {preferenceLines}

        {/* Main line */}
        <path
          d={generatePathD(data)}
          fill="none"
          stroke={chartColor}
          strokeWidth={settings.lineWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {settings.pointSize > 0 &&
          data.map((point, idx) => (
            <circle
              key={idx}
              cx={xScale(point.time)}
              cy={yScale(point.value)}
              r={settings.pointSize}
              fill={chartColor}
            />
          ))}

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
          x2={adjustedWidth - rightGutterWidth}
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
              textAnchor={
                i === 0 ? "start" : i === xTicks.length - 1 ? "end" : "middle"
              }
              fontSize="12px"
              fill={tick.isPreferred ? "#000" : "#666"}
              fontWeight={
                tick.isPreferred ? "500" : tick.isMiddle ? "400" : "normal"
              }
            >
              {tick.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
