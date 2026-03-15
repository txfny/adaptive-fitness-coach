"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StepIndicator, StepStatus } from "@/components/step-indicator";
import { ActivityRings, ActivityRingsLegend } from "@/components/activity-rings";
import { MilestoneBadges } from "@/components/milestone-badges";
import { Leaf, Sparkle } from "@/components/line-art";

type DailyState = {
  snapshotDone: boolean;
  readinessTier: string | null;
  sessionViewed: boolean;
  workoutStarted: boolean;
  logDone: boolean;
};

const initialState: DailyState = {
  snapshotDone: false,
  readinessTier: null,
  sessionViewed: false,
  workoutStarted: false,
  logDone: false,
};

const motivationalQuotes = [
  "You showed up. That's already winning.",
  "Stronger than yesterday, kinder than tomorrow.",
  "Your body is grateful you're here.",
  "Progress, not perfection.",
  "This is your hour. Own it.",
];

export default function HomePage() {
  const router = useRouter();
  const [state] = useState<DailyState>(initialState);
  const [greeting, setGreeting] = useState("");
  const [dayInfo, setDayInfo] = useState("");
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(
      hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"
    );
    setDayInfo(
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    );
    setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
  }, []);

  const getStepStatus = (step: number): StepStatus => {
    switch (step) {
      case 1: return state.snapshotDone ? "done" : "active";
      case 2: return state.snapshotDone ? (state.readinessTier ? "done" : "active") : "locked";
      case 3: return state.readinessTier ? (state.sessionViewed ? "done" : "active") : "locked";
      case 4: return state.sessionViewed ? (state.logDone ? "done" : "active") : "locked";
      default: return "locked";
    }
  };

  const steps = [
    {
      number: 1,
      label: "Check In",
      description: "How are you feeling today?",
      href: "/snapshot",
      status: getStepStatus(1),
      result: state.snapshotDone ? "HRV 74ms · Slept 7hrs · Energy 6/10" : undefined,
    },
    {
      number: 2,
      label: "Readiness",
      description: "Let's see what your body can handle.",
      href: state.snapshotDone ? "/snapshot" : undefined,
      status: getStepStatus(2),
      result: state.readinessTier ? `${state.readinessTier} — full programming available` : undefined,
    },
    {
      number: 3,
      label: "Your Session",
      description: "A workout built just for you.",
      href: state.readinessTier ? "/session" : undefined,
      status: getStepStatus(3),
      result: state.sessionViewed ? "Strength Lower · 7 exercises · ~50 min" : undefined,
    },
    {
      number: 4,
      label: "Record Your Wins",
      description: "Tell us how it went — you make it smarter.",
      href: state.sessionViewed ? "/log" : undefined,
      status: getStepStatus(4),
      result: state.logDone ? "RPE 7 · HRR 30bpm (good) · Prediction accurate" : undefined,
    },
  ];

  const completedSteps = steps.filter(s => s.status === "done").length;
  const activeStep = steps.find(s => s.status === "active");

  // Activity rings data — Train / Track / Recover
  const rings = [
    { label: "Train", progress: state.logDone ? 1 : state.workoutStarted ? 0.5 : 0, color: "#7BAE7F", bgColor: "rgba(123,174,127,0.12)" },
    { label: "Track", progress: state.snapshotDone ? 1 : 0, color: "#C08B6F", bgColor: "rgba(192,139,111,0.12)" },
    { label: "Recover", progress: state.logDone ? 1 : 0, color: "#C4B5FD", bgColor: "rgba(196,181,253,0.12)" },
  ];

  // Forgiving streak: X of last 7 days (not fragile consecutive count)
  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];
  const weekActivity = [true, true, true, false, false, false, false]; // demo

  return (
    <div className="py-8 lg:pl-16">
      {/* Header — full width */}
      <div className="mb-8">
        <p className="text-sm text-cream-600 font-light">{dayInfo || "\u00A0"}</p>
        <h1 className="text-[28px] lg:text-[32px] font-semibold text-cream-900 tracking-tight mt-1">
          {greeting || "\u00A0"}
        </h1>
        <div className="flex items-center gap-2 mt-2">
          <Leaf size={16} color="#7BAE7F" />
          <p className="text-sm text-cream-600 font-light italic">{quote || "\u00A0"}</p>
        </div>
      </div>

      {/* Desktop: 2-column grid / Mobile: single column */}
      <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-8">

        {/* LEFT COLUMN — Daily flow */}
        <div className="space-y-6">
          {/* Progress bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-cream-600 font-medium tracking-wide uppercase">
                Today&apos;s flow
              </p>
              <p className="text-xs text-cream-500 font-light">
                {completedSteps} of {steps.length}
              </p>
            </div>
            <div className="h-1.5 bg-cream-300/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-sage rounded-full transition-all duration-700 ease-out"
                style={{ width: `${Math.max((completedSteps / steps.length) * 100, 2)}%` }}
              />
            </div>
          </div>

          {/* Pipeline */}
          <StepIndicator
            steps={steps}
            onStepClick={(step) => step.href && router.push(step.href)}
          />

          {/* Hint */}
          {activeStep && (
            <div className="flex gap-3 items-start rounded-2xl bg-sage/[0.05] border border-sage/12 p-4">
              <Sparkle size={18} color="#7BAE7F" className="flex-shrink-0 mt-0.5" />
              <p className="text-[13px] text-cream-700 leading-relaxed">
                {activeStep.number === 1 && "Grab your HRV and resting heart rate from Apple Health — takes 30 seconds."}
                {activeStep.number === 2 && "Readiness is automatic — your lowest signal sets the ceiling so you never overdo it."}
                {activeStep.number === 3 && "Your session adapts to where you are today. Review it, then go crush it."}
                {activeStep.number === 4 && "Log within an hour of finishing. Your honesty is what makes this work."}
              </p>
            </div>
          )}

          {/* Last session */}
          <div className="rounded-2xl bg-white border border-cream-300/50 p-5 card-soft">
            <p className="text-[10px] text-cream-500 uppercase tracking-widest mb-3 font-medium">Last session</p>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-cream-900 font-medium text-[15px]">Run (Easy)</p>
                <p className="text-cream-600 text-xs mt-1 font-light">Mar 14 · 21 min · RPE 6</p>
              </div>
              <div className="text-right">
                <p className="text-sage text-xs font-medium">Peak HR 188</p>
                <p className="text-cream-500 text-[11px] mt-0.5">lowest at distance</p>
              </div>
            </div>
          </div>

          {/* Mini stats — visible on mobile, hidden on desktop (shown in sidebar) */}
          <div className="grid grid-cols-3 gap-3 lg:hidden">
            {[
              { value: "8", label: "Sessions" },
              { value: "Wk 2", label: "Block" },
              { value: "74", label: "HRV ms" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-white border border-cream-300/50 p-3.5 text-center card-soft">
                <p className="text-lg font-semibold font-mono tracking-tight text-cream-900">{stat.value}</p>
                <p className="text-[10px] text-cream-500 uppercase tracking-wider mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN — Sidebar (rings, streak, stats, badges) */}
        <div className="space-y-6 mt-8 lg:mt-0">
          {/* Activity rings */}
          <div className="rounded-2xl bg-white border border-cream-300/50 p-5 card-soft">
            <div className="flex flex-col items-center gap-4">
              <ActivityRings rings={rings} size={140} />
              <ActivityRingsLegend rings={rings} />
            </div>
          </div>

          {/* Forgiving streak */}
          <div className="rounded-2xl bg-white border border-cream-300/50 p-5 card-soft">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-cream-600 font-medium uppercase tracking-widest">This week</p>
              <p className="text-sm font-semibold text-sage">{weekActivity.filter(Boolean).length} of 7</p>
            </div>
            <div className="flex justify-between">
              {weekDays.map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium transition-all ${
                      weekActivity[i]
                        ? "bg-sage text-white"
                        : "bg-cream-200/60 text-cream-500"
                    }`}
                  >
                    {day}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-cream-500 font-light mt-3 text-center">
              3 days active — keep building the habit
            </p>
          </div>

          {/* Stats — desktop only */}
          <div className="hidden lg:grid grid-cols-3 gap-3">
            {[
              { value: "8", label: "Sessions" },
              { value: "Wk 2", label: "Block" },
              { value: "74", label: "HRV ms" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-white border border-cream-300/50 p-3 text-center card-soft">
                <p className="text-base font-semibold font-mono tracking-tight text-cream-900">{stat.value}</p>
                <p className="text-[9px] text-cream-500 uppercase tracking-wider mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Milestones */}
          <div className="rounded-2xl bg-white border border-cream-300/50 p-5 card-soft">
            <MilestoneBadges />
          </div>
        </div>
      </div>
    </div>
  );
}
