import Link from "next/link";
import { SessionCard } from "@/components/session-card";
import type { SessionPlan } from "@/lib/types";

const demoSession: SessionPlan = {
  date: "2026-03-16",
  training_block: "Hypertrophy Block 1",
  week_number: 1,
  is_deload: false,
  readiness_score: "HIGH",
  readiness_reasoning: [
    { signal: "HRV", value: 74, baseline: "57 ± 4.5", deviation: "+3.8 SD", tier_assigned: "HIGH" },
    { signal: "RHR delta", value: 0, tier_assigned: "HIGH" },
    { signal: "Sleep", value: 7, tier_assigned: "HIGH" },
  ],
  pill_phase: "active",
  session_type: "strength_lower",
  location: "home_gym",
  warmup: "5 min treadmill walk → leg swings, hip circles, bodyweight squats (10 each) → 1 set goblet squat @ 15 lbs × 10",
  exercises: [
    { name: "Goblet Squat", target_area: "quads, glutes", sets: 3, reps: "8", load: "30 lb DB", rest_seconds: 90, rpe_target: 7, notes: "Advanced from 25 lbs. Reset reps to 8." },
    { name: "Sumo Squat", target_area: "adductors, glutes", sets: 3, reps: "10–12", load: "25 lb DB", rest_seconds: 90, rpe_target: 7, notes: "NEW — assessment. Find working weight." },
    { name: "Romanian Deadlift", target_area: "hamstrings, glutes", sets: 3, reps: "12", load: "25 lbs ea", rest_seconds: 90, rpe_target: 7, notes: "Pushing to top of rep range before load increase." },
    { name: "Hip Thrust", target_area: "glutes", sets: 3, reps: "13–15", load: "35 lbs ea", rest_seconds: 90, rpe_target: 7, notes: "Building reps toward 15 before 40 lb jump." },
    { name: "Hanging Leg Raise", target_area: "lower abs", sets: 3, reps: "12", load: "BW", rest_seconds: 45, notes: "When easy, add ankle weights." },
    { name: "Dead Bug", target_area: "deep core", sets: 3, reps: "10 ea side", load: "BW", rest_seconds: 30 },
    { name: "Stomach Vacuum", target_area: "TVA", sets: 3, reps: "15 sec hold", load: "—", rest_seconds: 30, notes: "Progressed from 10 sec." },
  ],
  focus_cue: "Control the bottom of every squat and hinge — 2 sec pause at the stretch, then drive up.",
  estimated_duration_minutes: 50,
  progression_note: "Goblet squat advances 25→30 lbs (hit 3×12 at RPE ~7 on Mar 13). RDL pushing to top of rep range. Sumo squat is new — assess weight. Vacuum hold extended to 15 sec.",
  nutrition_note: "Get 25–30g protein within an hour after.",
};

export default function SessionPage() {
  return (
    <div className="py-8 max-w-2xl mx-auto lg:pl-16">
      <div className="mb-6">
        <p className="text-xs text-sage-dark font-medium uppercase tracking-widest">Step 3</p>
        <h1 className="text-[28px] font-semibold text-cream-900 mt-1 tracking-tight">Your Session</h1>
        <p className="text-sm text-cream-600 mt-1 font-light">
          Built from your readiness and where you left off.
        </p>
      </div>

      {/* How-to */}
      <div className="rounded-2xl bg-cream-200/50 border border-cream-300/50 p-4 mb-5">
        <p className="text-[12px] text-cream-600 font-light leading-relaxed">
          <span className="text-cream-800 font-medium">How to read this:</span> go top to bottom.
          Stop each set when you hit the RPE target, even if you have reps left.
        </p>
      </div>

      <SessionCard plan={demoSession} />

      <div className="mt-5 flex gap-3">
        <Link
          href="/"
          className="flex-1 py-3.5 text-center rounded-2xl bg-cream-200/70 text-cream-700 text-sm font-medium hover:bg-cream-300/70 transition-colors border border-cream-300/50"
        >
          Back
        </Link>
        <Link
          href="/log"
          className="flex-1 py-3.5 text-center rounded-2xl bg-sage text-white text-sm font-semibold hover:bg-sage-dark transition-colors"
        >
          Start Workout
        </Link>
      </div>
    </div>
  );
}
