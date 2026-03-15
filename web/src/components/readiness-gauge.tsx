"use client";

import { ReadinessResult } from "@/lib/types";

const tierColors: Record<string, string> = {
  HIGH: "text-emerald-400",
  MODERATE: "text-amber-400",
  LOW: "text-red-400",
};

const tierBgColors: Record<string, string> = {
  HIGH: "bg-emerald-400/10 border-emerald-400/30",
  MODERATE: "bg-amber-400/10 border-amber-400/30",
  LOW: "bg-red-400/10 border-red-400/30",
};

const tierRingColors: Record<string, string> = {
  HIGH: "stroke-emerald-400",
  MODERATE: "stroke-amber-400",
  LOW: "stroke-red-400",
};

export function ReadinessGauge({ result }: { result: ReadinessResult }) {
  const { tier, reasoning, summary } = result;

  // SVG radial gauge
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const fillPercent = tier === "HIGH" ? 100 : tier === "MODERATE" ? 60 : 25;
  const dashOffset = circumference * (1 - fillPercent / 100);

  return (
    <div className={`rounded-2xl border p-6 ${tierBgColors[tier]}`}>
      <div className="flex items-center gap-6">
        {/* Gauge */}
        <div className="relative w-36 h-36 flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-zinc-800"
            />
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className={`${tierRingColors[tier]} transition-all duration-700 ease-out`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold ${tierColors[tier]}`}>
              {tier}
            </span>
          </div>
        </div>

        {/* Reasoning */}
        <div className="flex-1 min-w-0">
          <div className="space-y-1.5">
            {reasoning.map((signal) => (
              <div
                key={signal.signal}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-zinc-400">{signal.signal}</span>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-200 font-mono text-xs">
                    {typeof signal.value === "number"
                      ? signal.signal === "HRV"
                        ? `${signal.value} ms`
                        : signal.signal === "Sleep"
                        ? `${signal.value} hrs`
                        : signal.signal === "RHR delta"
                        ? `${signal.value >= 0 ? "+" : ""}${signal.value} bpm`
                        : `${signal.value}`
                      : signal.value}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      tierColors[signal.tier_assigned]
                    }`}
                  >
                    {signal.tier_assigned}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-zinc-500 mt-3">{summary}</p>
        </div>
      </div>
    </div>
  );
}
