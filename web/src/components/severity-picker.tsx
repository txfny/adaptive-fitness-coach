"use client";

interface SeverityPickerProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const levels = [
  { value: 0, label: "None", color: "bg-zinc-800 text-zinc-400 border-zinc-700" },
  { value: 1, label: "Mild", color: "bg-emerald-900/30 text-emerald-400 border-emerald-800" },
  { value: 2, label: "Mod", color: "bg-amber-900/30 text-amber-400 border-amber-800" },
  { value: 3, label: "Bad", color: "bg-red-900/30 text-red-400 border-red-800" },
];

export function SeverityPicker({ label, value, onChange }: SeverityPickerProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm text-zinc-400">{label}</label>
      <div className="grid grid-cols-4 gap-1.5">
        {levels.map((level) => (
          <button
            key={level.value}
            type="button"
            onClick={() => onChange(level.value)}
            className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
              value === level.value
                ? level.color
                : "bg-zinc-900 text-zinc-600 border-zinc-800"
            }`}
          >
            {level.label}
          </button>
        ))}
      </div>
    </div>
  );
}
