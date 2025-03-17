import { WeatherField } from "./types/user";
import { HourReading } from "./types/api";
import { useCommonAxis } from "./stores/useCommonAxis";
import { useEffect } from "react";

interface WeatherChartProps {
  hourlyData: HourReading[];
  field: WeatherField;
}

interface DataPoint {
  time: number;
  value: number;
}

interface ShadingRegion {
  startTime: number;
  endTime: number;
  color: string;
  gutter: "top" | "bottom";
}

// Format time as "8PM"
function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date
    .toLocaleString("en-US", { hour: "numeric", hour12: true })
    .replace(" ", "");
}

export function WeatherChart({ hourlyData, field }: WeatherChartProps) {
  const { registerLimit, getCurrentLimits, defaultLimits } = useCommonAxis();

  // Example props (could be pulled in from parent or external data):
  const width = 600;
  const height = 300;
  const topGutterHeight = 30;
  const bottomGutterHeight = 50; // Increased to accommodate time labels
  const leftGutterWidth = 50; // Added for y-axis labels
  const rightGutterWidth = 20; // Added for right padding

  // Convert hourly data to DataPoints
  const data: DataPoint[] = hourlyData.map((hour) => ({
    time: hour.datetimeEpoch * 1000, // convert seconds to milliseconds
    value: hour[field],
  }));

  console.log("test data", {
    hourlyDataSample: hourlyData[0],
    dataSample: data[0],
  });

  // Example shading in top/bottom gutters:
  // This says: shade top gutter from time=1678886400000 to 1678887600000 in red,
  // and bottom gutter from time=1678889000000 to 1678890200000 in blue.
  const shadingRegions: ShadingRegion[] = [
    {
      startTime: 1678886400000,
      endTime: 1678887600000,
      color: "rgba(255, 0, 0, 0.3)",
      gutter: "top",
    },
    {
      startTime: 1678889000000,
      endTime: 1678890200000,
      color: "rgba(0, 0, 255, 0.3)",
      gutter: "bottom",
    },
  ];

  // 1) Determine min/max time & value:
  const times = data.map((d) => d.time);
  const values = data.map((d) => d.value);

  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);

  // Calculate the actual min/max from data with padding
  const paddingFactor = 0.1; // 10% padding
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

  // Compute chart dimension for the central region:
  const chartHeight = height - topGutterHeight - bottomGutterHeight;
  const chartWidth = width - leftGutterWidth - rightGutterWidth;

  // 2) Scale functions (simple linear scales):
  const xScale = (t: number): number =>
    leftGutterWidth + ((t - minTime) / (maxTime - minTime)) * chartWidth;

  const yScale = (val: number): number => {
    // invert so higher values appear higher on the chart
    return (
      topGutterHeight +
      chartHeight -
      ((val - minValue) / (maxValue - minValue)) * chartHeight
    );
  };

  // 3) Split data into segments if there's a time gap:
  //    This example uses a threshold of 10 minutes in ms: 10 * 60 * 1000
  const gapThreshold = 70 * 60 * 1000;
  const segments: DataPoint[][] = [];
  let currentSegment: DataPoint[] = [];

  for (let i = 0; i < data.length; i++) {
    const point = data[i];
    if (currentSegment.length === 0) {
      currentSegment.push(point);
    } else {
      const prevPoint = currentSegment[currentSegment.length - 1];
      const delta = point.time - prevPoint.time;
      if (delta > gapThreshold) {
        // close off the current segment
        segments.push(currentSegment);
        currentSegment = [point];
      } else {
        currentSegment.push(point);
      }
    }
  }
  // push the last segment if it has points
  if (currentSegment.length > 0) segments.push(currentSegment);

  // 4) Generate path d-attribute for each segment
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

  // 5) Render the shading as rectangles in top/bottom gutters:
  const gutterRects = shadingRegions.map((region, idx) => {
    const xStart = xScale(region.startTime);
    const xEnd = xScale(region.endTime);
    const rectWidth = xEnd - xStart;

    if (region.gutter === "top") {
      // top gutter: y=0, height=topGutterHeight
      return (
        <rect
          key={idx}
          x={xStart}
          y={0}
          width={rectWidth}
          height={topGutterHeight}
          fill={region.color}
        />
      );
    } else {
      // bottom gutter: y=topGutterHeight + chartHeight
      return (
        <rect
          key={idx}
          x={xStart}
          y={topGutterHeight + chartHeight}
          width={rectWidth}
          height={bottomGutterHeight}
          fill={region.color}
        />
      );
    }
  });

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

  // 6) Build the <svg> with axes and gridlines
  const svgStyle = {
    border: "1px solid #ccc",
    background: "#fafafa",
  };

  return (
    <svg width={width} height={height} style={svgStyle}>
      {/* Gridlines */}
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

      {/* Render shading first so lines appear on top */}
      {gutterRects}

      {/* Render each discontinuous line segment */}
      {segments.map((segment, idx) => {
        const pathD = generatePathD(segment);
        return (
          <g key={idx}>
            <path d={pathD} fill="none" stroke={chartColor} strokeWidth={2} />
            {/* Add circles for each data point */}
            {segment.map((point, pointIdx) => (
              <circle
                key={pointIdx}
                cx={xScale(point.time)}
                cy={yScale(point.value)}
                r={3}
                fill={chartColor}
              />
            ))}
          </g>
        );
      })}

      {/* Y-axis line */}
      <line
        x1={leftGutterWidth}
        y1={topGutterHeight}
        x2={leftGutterWidth}
        y2={topGutterHeight + chartHeight}
        stroke="#666"
        strokeWidth={1}
      />

      {/* X-axis line */}
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
