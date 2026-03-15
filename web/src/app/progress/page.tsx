"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Demo data from the 7 historical sessions
const hrvData = [
  { date: "Mar 5", hrv: 61 },
  { date: "Mar 6", hrv: 65.9 },
  { date: "Mar 9", hrv: 57 },
  { date: "Mar 10", hrv: 55 },
  { date: "Mar 12", hrv: 55.8 },
  { date: "Mar 13", hrv: 53 },
  { date: "Mar 14", hrv: 60 },
  { date: "Mar 16", hrv: 74 },
];

const runData = [
  { date: "Mar 5", duration: 23, peakHr: null },
  { date: "Mar 6", duration: 20, peakHr: null },
  { date: "Mar 9", duration: 17.5, peakHr: 197 },
  { date: "Mar 12", duration: 18.2, peakHr: 200 },
  { date: "Mar 14", duration: 21, peakHr: 188 },
];

const liftData = [
  { date: "Mar 10", exercise: "Goblet Squat", load: 25 },
  { date: "Mar 13", exercise: "Goblet Squat", load: 25 },
  { date: "Mar 10", exercise: "RDL", load: 25 },
  { date: "Mar 13", exercise: "RDL", load: 25 },
  { date: "Mar 10", exercise: "Hip Thrust", load: 35 },
];

const gobletData = [
  { date: "Mar 10", load: 25 },
  { date: "Mar 13", load: 25 },
  { date: "Mar 16", load: 30 },
];

export default function ProgressPage() {
  return (
    <div className="py-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Progress</h1>
        <p className="text-sm text-zinc-500 mt-1">Trends from your session data.</p>
      </div>

      {/* HRV Trend */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
        <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4">
          HRV Trend
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={hrvData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="date" tick={{ fill: "#71717a", fontSize: 11 }} />
            <YAxis tick={{ fill: "#71717a", fontSize: 11 }} domain={[40, 80]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #27272a",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            {/* Baseline band */}
            <Line
              type="monotone"
              dataKey="hrv"
              stroke="#34d399"
              strokeWidth={2}
              dot={{ fill: "#34d399", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
          <span>Baseline: 57 ms</span>
          <span>Today: 74 ms (+3.8 SD)</span>
        </div>
      </div>

      {/* Running */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
        <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4">
          Running — Peak HR at Distance
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={runData.filter((d) => d.peakHr)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="date" tick={{ fill: "#71717a", fontSize: 11 }} />
            <YAxis tick={{ fill: "#71717a", fontSize: 11 }} domain={[180, 205]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #27272a",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Line
              type="monotone"
              dataKey="peakHr"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ fill: "#f59e0b", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-emerald-400 mt-2">
          Peak HR declining (200 → 188) at increasing distance — aerobic efficiency improving
        </p>
      </div>

      {/* Goblet Squat Progression */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
        <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4">
          Goblet Squat — Load Progression
        </h3>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={gobletData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="date" tick={{ fill: "#71717a", fontSize: 11 }} />
            <YAxis tick={{ fill: "#71717a", fontSize: 11 }} domain={[20, 35]} unit=" lbs" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #27272a",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Line
              type="monotone"
              dataKey="load"
              stroke="#a78bfa"
              strokeWidth={2}
              dot={{ fill: "#a78bfa", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-xs text-zinc-500 mt-2">
          25 → 30 lbs (advanced today after 3×12 at RPE 7)
        </p>
      </div>
    </div>
  );
}
