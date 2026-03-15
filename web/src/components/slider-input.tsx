"use client";

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  hint?: string;
  showValue?: boolean;
}

export function SliderInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  hint,
  showValue = true,
}: SliderInputProps) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm text-cream-800 font-light">{label}</label>
          {hint && <p className="text-[11px] text-cream-500 mt-0.5 font-light">{hint}</p>}
        </div>
        {showValue && (
          <span className="text-sm font-mono text-cream-900 bg-cream-200/70 px-3 py-1.5 rounded-xl border border-cream-300/50">
            {value}
            {unit && <span className="text-cream-500 ml-0.5 text-xs">{unit}</span>}
          </span>
        )}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
      <div className="flex justify-between text-[10px] text-cream-400 font-light">
        <span>{min}{unit ? ` ${unit}` : ""}</span>
        <span>{max}{unit ? ` ${unit}` : ""}</span>
      </div>
    </div>
  );
}
