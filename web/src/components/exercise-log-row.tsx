"use client";

import { ExerciseLogEntry } from "@/lib/types";

interface Props {
  entry: ExerciseLogEntry;
  onChange: (updated: ExerciseLogEntry) => void;
}

export function ExerciseLogRow({ entry, onChange }: Props) {
  const update = (fields: Partial<ExerciseLogEntry>) =>
    onChange({ ...entry, ...fields });

  const prescribed = [
    entry.prescribed_sets && `${entry.prescribed_sets}`,
    entry.prescribed_reps && `× ${entry.prescribed_reps}`,
    entry.prescribed_load && `@ ${entry.prescribed_load}`,
    entry.prescribed_rpe && `RPE ${entry.prescribed_rpe}`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={`rounded-2xl border p-4 transition-all duration-200 ${
        entry.skipped
          ? "bg-cream-100/50 border-cream-300/30 opacity-50"
          : "bg-white border-cream-300/50"
      }`}
    >
      {/* Header: name + skip toggle */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <span className="font-medium text-sm text-cream-900">
            {entry.exercise_name}
          </span>
          {entry.target_area && (
            <span className="text-cream-500 text-[11px] ml-1.5 font-light">
              {entry.target_area}
            </span>
          )}
          {prescribed && (
            <p className="text-[11px] text-cream-400 font-light mt-0.5">
              Plan: {prescribed}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => update({ skipped: !entry.skipped })}
          className={`flex-shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full border transition-colors ${
            entry.skipped
              ? "bg-cream-300/50 text-cream-600 border-cream-400/40"
              : "bg-cream-100 text-cream-500 border-cream-300/40 hover:border-cream-400/60"
          }`}
        >
          {entry.skipped ? "Skipped" : "Skip"}
        </button>
      </div>

      {/* Inputs */}
      {!entry.skipped && (
        <div className="grid grid-cols-4 gap-2 mt-3">
          <FieldInput
            label="Sets"
            value={String(entry.sets_completed)}
            onChange={(v) => update({ sets_completed: parseInt(v) || 0 })}
            inputMode="numeric"
          />
          <FieldInput
            label="Reps"
            value={entry.reps_completed}
            onChange={(v) => update({ reps_completed: v })}
          />
          <FieldInput
            label="Load"
            value={entry.load_used}
            onChange={(v) => update({ load_used: v })}
          />
          <FieldInput
            label="RPE"
            value={entry.actual_rpe ? String(entry.actual_rpe) : ""}
            onChange={(v) => update({ actual_rpe: parseInt(v) || undefined })}
            inputMode="numeric"
            placeholder="—"
          />
        </div>
      )}
    </div>
  );
}

function FieldInput({
  label,
  value,
  onChange,
  inputMode,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  inputMode?: "numeric" | "text";
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[10px] text-cream-500 uppercase tracking-widest font-medium mb-1">
        {label}
      </label>
      <input
        type="text"
        inputMode={inputMode || "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-cream-50 border border-cream-300/50 rounded-xl px-2.5 py-2 text-sm text-cream-900 font-mono text-center focus:outline-none focus:border-sage/30 transition-colors"
      />
    </div>
  );
}
