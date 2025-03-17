import { useRef, useState, useEffect } from "react";
import { HourReading } from "./types/api";
import { WeatherField } from "./types/user";
import { WeatherChart } from "./WeatherChart";

const WEATHER_FIELDS: WeatherField[] = [
  "temp",
  "windspeed",
  "precipprob",
  "humidity",
];

interface WeatherChartPanelProps {
  hourlyData: HourReading[];
}

function ResponsiveChartContainer({
  children,
  onWidthChange,
}: {
  children: (width: number) => React.ReactNode;
  onWidthChange?: (width: number) => void;
}) {
  const [width, setWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Use contentBoxSize if available, otherwise fall back to contentRect
        if (entry.contentBoxSize) {
          const contentBoxSize = Array.isArray(entry.contentBoxSize)
            ? entry.contentBoxSize[0]
            : entry.contentBoxSize;
          const newWidth = contentBoxSize.inlineSize;
          setWidth(newWidth);
          onWidthChange?.(newWidth);
        } else {
          const newWidth = entry.contentRect.width;
          setWidth(newWidth);
          onWidthChange?.(newWidth);
        }
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [onWidthChange]);

  return (
    <div ref={containerRef} className="w-full">
      {children(width)}
    </div>
  );
}

export function WeatherChartPanel({ hourlyData }: WeatherChartPanelProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      {WEATHER_FIELDS.map((field) => (
        <div key={field} className="bg-white rounded-lg shadow w-full">
          <h3 className="text-lg font-semibold mb-2 px-4 pt-4">{field}</h3>
          <ResponsiveChartContainer>
            {(width) => (
              <WeatherChart
                hourlyData={hourlyData}
                field={field}
                width={width}
              />
            )}
          </ResponsiveChartContainer>
        </div>
      ))}
    </div>
  );
}
