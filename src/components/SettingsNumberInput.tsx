import { ChangeEvent } from "react";

interface SettingsNumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  tooltip?: string;
}

export function SettingsNumberInput({
  label,
  value,
  onChange,
  step = 1,
  min,
  max,
  tooltip,
}: SettingsNumberInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <label className="text-sm text-gray-600 flex-1" title={tooltip}>
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={handleChange}
        step={step}
        min={min}
        max={max}
        className="w-20 px-2 py-1 border rounded text-right"
      />
    </div>
  );
}
