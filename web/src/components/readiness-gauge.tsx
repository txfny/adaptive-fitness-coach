"use client";

import { ReadinessResult } from "@/lib/types";
import { FlexArm, Moon, Lotus } from "./line-art";

const tierColors: Record<string, string> = {
  HIGH: "text-sage",
  MODERATE: "text-amber-600",
  LOW: "text-rose-soft",
};

const tierBgColors: Record<string, string> = {
  HIGH: "bg-sage/[0.06] border-sage/15",
  MODERATE: "bg-amber-100/40 border-amber-300/20",
  LOW: "bg-rose-soft/[0.06] border-rose-soft/15",
};

const tierRingColors: Record<string, string> = {
  HIGH: "stroke-sage",
  MODERATE: "stroke-amber-500",
  LOW: "stroke-rose-soft",
};

const tierLabels: Record<string, string> = {
  HIGH: "Let's go!",
  MODERATE: "Easy does it today",
  LOW: "Rest & recover",
};

const tierIcons: Record<string, typeof FlexArm> = {
  HIGH: FlexArm,
  MODERATE: Lotus,
  LOW: Moon,
};

export function ReadinessGauge({ result }: { result: ReadinessResult }) {
  const { tier, reasoning, summary } = result;

  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const fillPercent = tier === "HIGH" ? 100 : tier === "MODERATE" ? 60 : 25;
  const dashOffset = circumference * (1 - fillPercent / 100);
  const TierIcon = tierIcons[tier];
  const iconColor = tier === "HIGH" ? "#7BAE7F" : tier === "MODERATE" ? "#D97706" : "#E8A0B4";

  return (
    <div className={`rounded-2xl border p-6 ${tierBgColors[tier]}`}>
      <div className="flex items-center gap-6">
        {/* Gauge */}
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
            <circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-cream-300/60"
            />
            <circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className={`${tierRingColors[tier]} transition-all duration-1000 ease-out`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <TierIcon size={24} color={iconColor} />
            <span className={`text-sm font-bold mt-1 ${tierColors[tier]}`}>
              {tier}
            </span>
            <span className="text-[10px] text-cream-500 font-light mt-0.5">readiness</span>
          </div>
        </div>

        {/* Signals */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium mb-3 ${tierColors[tier]}`}>
            {tierLabels[tier]}
          </p>
          <div className="space-y-2">
            {reasoning.map((signal) => (
              <div
                key={signal.signal}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-cream-600 font-light text-xs">{signal.signal}</span>
                <div className="flex items-center gap-2">
                  <span className="text-cream-800 font-mono text-xs">
                    {typeof signal.value === "number"
                      ? signal.signal === "HRV"
                        ? `${signal.value} ms`
                        : signal.signal === "Sleep"
                        ? `${signal.value} hrs`
                        : signal.signal === "RHR delta"
                        ? `${signal.value >= 0 ? "+" : ""}${signal.value}`
                        : `${signal.value}`
                      : signal.value}
                  </span>
                  <span
                    className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${
                      tierColors[signal.tier_assigned]
                    } opacity-70`}
                  >
                    {signal.tier_assigned}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-cream-500 mt-3 font-light">{summary}</p>
        </div>
      </div>
    </div>
  );
}
