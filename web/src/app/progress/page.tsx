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
import { Sparkle, Pulse, FlexArm } from "@/components/line-art";

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

const gobletData = [
  { date: "Mar 10", load: 25 },
  { date: "Mar 13", load: 25 },
  { date: "Mar 16", load: 30 },
];

const chartTooltipStyle = {
  backgroundColor: "#FFFCF7",
  border: "1px solid #E8DDD0",
  borderRadius: "12px",
  fontSize: "12px",
  color: "#3D352A",
};

export default function ProgressPage() {
  return (
    <div className="py-8 lg:pl-16">
      <div className="mb-8">
        <h1 className="text-[28px] lg:text-[32px] font-semibold text-cream-900 tracking-tight">See how far you&apos;ve come</h1>
        <p className="text-sm text-cream-600 mt-1 font-light">
          Your trends, updated after each workout.
        </p>
      </div>

      {/* Desktop: 2-col grid for charts */}
      <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
        {/* Insight — spans full width */}
        <div className="flex gap-3 items-start rounded-2xl bg-sage/[0.05] border border-sage/12 p-4 lg:col-span-2">
          <Sparkle size={18} color="#7BAE7F" className="flex-shrink-0 mt-0.5" />
          <p className="text-[13px] text-cream-700 font-light leading-relaxed">
            <span className="text-sage-dark font-medium">Looking good:</span> HRV jumped to 74ms (+3.8 SD). Peak HR dropping at longer distances — your aerobic base is building.
          </p>
        </div>

        {/* HRV */}
        <div className="bg-white border border-cream-300/50 rounded-2xl p-5 card-soft">
          <div className="flex items-center gap-2 mb-4">
            <Pulse size={16} color="#7BAE7F" />
            <h3 className="text-[10px] font-medium text-cream-600 uppercase tracking-widest">
              HRV Trend
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={hrvData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(232,221,208,0.6)" />
              <XAxis dataKey="date" tick={{ fill: "#9C8B75", fontSize: 10 }} />
              <YAxis tick={{ fill: "#9C8B75", fontSize: 10 }} domain={[40, 80]} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Line
                type="monotone"
                dataKey="hrv"
                stroke="#7BAE7F"
                strokeWidth={2}
                dot={{ fill: "#7BAE7F", r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-3 text-[11px] text-cream-600 font-light">
            <span>Baseline: 57 ms</span>
            <span className="text-sage">Today: 74 ms (+3.8 SD)</span>
          </div>
        </div>

        {/* Running */}
        <div className="bg-white border border-cream-300/50 rounded-2xl p-5 card-soft">
          <div className="flex items-center gap-2 mb-4">
            <Pulse size={16} color="#C08B6F" />
            <h3 className="text-[10px] font-medium text-cream-600 uppercase tracking-widest">
              Running — Peak HR
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={runData.filter((d) => d.peakHr)}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(232,221,208,0.6)" />
              <XAxis dataKey="date" tick={{ fill: "#9C8B75", fontSize: 10 }} />
              <YAxis tick={{ fill: "#9C8B75", fontSize: 10 }} domain={[180, 205]} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Line
                type="monotone"
                dataKey="peakHr"
                stroke="#C08B6F"
                strokeWidth={2}
                dot={{ fill: "#C08B6F", r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-[11px] text-sage mt-3 font-light">
            200 → 188 bpm at increasing distance — your heart is getting stronger
          </p>
        </div>

        {/* Goblet Squat */}
        <div className="bg-white border border-cream-300/50 rounded-2xl p-5 card-soft lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <FlexArm size={16} color="#C4B5FD" />
            <h3 className="text-[10px] font-medium text-cream-600 uppercase tracking-widest">
              Goblet Squat — Load
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={gobletData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(232,221,208,0.6)" />
              <XAxis dataKey="date" tick={{ fill: "#9C8B75", fontSize: 10 }} />
              <YAxis tick={{ fill: "#9C8B75", fontSize: 10 }} domain={[20, 35]} unit=" lbs" />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Line
                type="monotone"
                dataKey="load"
                stroke="#C4B5FD"
                strokeWidth={2}
                dot={{ fill: "#C4B5FD", r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-[11px] text-cream-600 mt-3 font-light">
            25 → 30 lbs after 3x12 at RPE 7 — your body did that
          </p>
        </div>
      </div>
    </div>
  );
}
