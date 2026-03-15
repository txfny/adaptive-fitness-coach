import Link from "next/link";
import { MetricCard } from "@/components/metric-card";
import { ReadinessGauge } from "@/components/readiness-gauge";
import { computeReadiness, DEFAULT_BASELINE } from "@/lib/readiness";
import type { Snapshot, ReadinessResult } from "@/lib/types";

// Demo data — will be replaced by Supabase reads
const demoSnapshot: Snapshot = {
  date: "2026-03-16",
  hrv_ms: 74,
  rhr_bpm: 53,
  rhr_7day_avg: 53,
  rhr_delta: 0,
  sleep_hours: 7,
  subjective_energy: 6,
  pill_pack_day: 15,
  pill_phase: "active",
  symptoms: { bloating: 0, gi_symptoms: 0, cramps_pain: 0, fatigue: 0 },
  symptom_load: 0,
  equipment_available: "home_gym",
};

export default function Dashboard() {
  const readiness: ReadinessResult = computeReadiness(demoSnapshot, DEFAULT_BASELINE);

  return (
    <div className="space-y-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Dashboard</h1>
        <p className="text-sm text-zinc-500 mt-1">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <ReadinessGauge result={readiness} />

      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          label="HRV"
          value={demoSnapshot.hrv_ms}
          unit="ms"
          subtitle="+3.8 SD above baseline"
          trend="up"
        />
        <MetricCard
          label="Sleep"
          value={demoSnapshot.sleep_hours}
          unit="hrs"
        />
        <MetricCard
          label="Pill Day"
          value={`${demoSnapshot.pill_pack_day}`}
          subtitle="Active"
        />
        <MetricCard
          label="Symptoms"
          value={demoSnapshot.symptom_load ?? 0}
          subtitle="No impact"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/snapshot"
          className="flex items-center justify-center py-4 rounded-xl bg-emerald-500 text-zinc-950 font-semibold text-sm hover:bg-emerald-400 transition-colors"
        >
          Enter Snapshot
        </Link>
        <Link
          href="/log"
          className="flex items-center justify-center py-4 rounded-xl bg-zinc-800 text-zinc-200 font-semibold text-sm hover:bg-zinc-700 transition-colors border border-zinc-700"
        >
          Log Workout
        </Link>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Last Session</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-zinc-200 font-medium">Mar 14 — Run (Easy)</p>
            <p className="text-zinc-500 text-xs">21 min · Peak HR 188 · RPE 6</p>
          </div>
          <span className="text-emerald-400 text-xs font-medium">
            Lowest HR at longest distance
          </span>
        </div>
      </div>
    </div>
  );
}
