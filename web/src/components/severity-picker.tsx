"use client";

interface SeverityPickerProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  hint?: string;
}

const levels = [
  { value: 0, label: "None", activeColor: "bg-cream-300/60 text-cream-800 border-cream-400/40" },
  { value: 1, label: "Mild", activeColor: "bg-sage/10 text-sage border-sage/25" },
  { value: 2, label: "Mod", activeColor: "bg-amber-100/60 text-amber-700 border-amber-300/40" },
  { value: 3, label: "Bad", activeColor: "bg-rose-soft/15 text-rose-soft border-rose-soft/25" },
];

export function SeverityPicker({ label, value, onChange, hint }: SeverityPickerProps) {
  return (
    <div className="space-y-2">
      <div>
        <label className="text-sm text-cream-800 font-light">{label}</label>
        {hint && <p className="text-[11px] text-cream-500 mt-0.5 font-light">{hint}</p>}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {levels.map((level) => (
          <button
            key={level.value}
            type="button"
            onClick={() => onChange(level.value)}
            className={`py-2.5 px-2 rounded-xl text-xs font-medium border transition-all duration-200 ${
              value === level.value
                ? level.activeColor
                : "bg-white text-cream-500 border-cream-300/50 hover:border-cream-400/60"
            }`}
          >
            {level.label}
          </button>
        ))}
      </div>
    </div>
  );
}
