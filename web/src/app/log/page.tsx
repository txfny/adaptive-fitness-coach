"use client";

import { useState, useEffect } from "react";
import { SliderInput } from "@/components/slider-input";
import { ExerciseLogRow } from "@/components/exercise-log-row";
import { Heart, Target, Pulse, Pen, Sparkle } from "@/components/line-art";
import { supabase } from "@/lib/supabase";
import { getTodaySession, saveExerciseHistory } from "@/lib/session-history";
import type { ExerciseLogEntry } from "@/lib/types";

export default function LogPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [exercises, setExercises] = useState<ExerciseLogEntry[]>([]);
  const [loadingSession, setLoadingSession] = useState(true);

  const [rpe, setRpe] = useState(7);
  const [energyAfter, setEnergyAfter] = useState(3);
  const [prediction, setPrediction] = useState<string>("accurate");
  const [hrStop, setHrStop] = useState(150);
  const [hr1Min, setHr1Min] = useState(120);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const hrrDelta = hrStop - hr1Min;
  const hrrAssessment = hrrDelta >= 20 ? "good" : hrrDelta >= 12 ? "watch" : "flag";
  const hrrColors = {
    good: "text-sage",
    watch: "text-amber-600",
    flag: "text-rose-soft",
  };
  const hrrBg = {
    good: "bg-sage/[0.06] border-sage/15",
    watch: "bg-amber-100/40 border-amber-300/20",
    flag: "bg-rose-soft/[0.06] border-rose-soft/15",
  };

  // Load today's session and pre-fill exercises
  useEffect(() => {
    (async () => {
      const session = await getTodaySession();
      if (session) {
        setSessionId(session.id);
        const prefilled: ExerciseLogEntry[] = (session.exercises || []).map((ex) => ({
          exercise_name: ex.name,
          target_area: undefined,
          prescribed_sets: ex.sets,
          prescribed_reps: ex.reps,
          prescribed_load: ex.load,
          prescribed_rpe: ex.rpe,
          sets_completed: ex.sets,
          reps_completed: ex.reps || "",
          load_used: ex.load || "BW",
          actual_rpe: ex.rpe,
          skipped: false,
        }));
        setExercises(prefilled);
      }
      setLoadingSession(false);
    })();
  }, []);

  const updateExercise = (index: number, updated: ExerciseLogEntry) => {
    setExercises((prev) => prev.map((e, i) => (i === index ? updated : e)));
  };

  const handleSubmit = async () => {
    setSaving(true);
    const today = new Date().toISOString().split("T")[0];

    // 1. Insert log, get back the ID
    const { data: logData } = await supabase
      .from("logs")
      .insert({
        date: today,
        session_id: sessionId,
        overall_rpe: rpe,
        energy_after: energyAfter,
        prediction_accuracy: prediction,
        hr_at_stop: hrStop,
        hr_1min_recovery: hr1Min,
        hrr_delta: hrrDelta,
        hrr_assessment: hrrAssessment,
        notes: notes || null,
      })
      .select("id")
      .single();

    // 2. Insert exercise history rows
    if (logData?.id && exercises.length > 0) {
      await saveExerciseHistory(logData.id, sessionId, today, exercises);
    }

    setSaving(false);
    setSubmitted(true);
  };

  if (submitted) {
    const logged = exercises.filter((e) => !e.skipped);
    const skipped = exercises.filter((e) => e.skipped);

    return (
      <div className="py-8 space-y-6 max-w-2xl mx-auto lg:pl-16">
        <div className="bg-white border border-cream-300/50 rounded-2xl p-6 text-center card-soft">
          <div className="celebrate mb-3">
            <Sparkle size={40} color="#7BAE7F" className="mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-cream-900 mb-1">You crushed it!</h2>
          <p className="text-sm text-cream-600 font-light mb-5">Session logged. Your future self thanks you.</p>

          {/* Exercise summary */}
          {logged.length > 0 && (
            <div className="space-y-1.5 mb-4 text-left">
              <p className="text-[10px] text-cream-500 uppercase tracking-widest font-medium px-1">
                Exercises logged
              </p>
              {logged.map((ex, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-cream-100/80 rounded-xl px-4 py-2"
                >
                  <span className="text-sm text-cream-700 font-light">{ex.exercise_name}</span>
                  <span className="font-mono text-xs text-cream-600">
                    {ex.sets_completed} × {ex.reps_completed} @ {ex.load_used}
                  </span>
                </div>
              ))}
              {skipped.length > 0 && (
                <p className="text-[11px] text-cream-400 font-light px-1 mt-1">
                  {skipped.length} skipped: {skipped.map((e) => e.exercise_name).join(", ")}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            {[
              { label: "RPE", value: `${rpe}/10`, icon: <FlexArmSmall /> },
              { label: "Heart Rate Recovery", value: `${hrrDelta} bpm`, color: hrrColors[hrrAssessment], icon: <PulseSmall /> },
              { label: "Prediction", value: prediction.replace("_", " "), icon: <TargetSmall /> },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between bg-cream-100/80 rounded-xl px-4 py-2.5">
                <span className="flex items-center gap-2 text-cream-600 text-sm font-light">
                  {row.icon}
                  {row.label}
                </span>
                <span className={`font-mono text-sm ${row.color || "text-cream-900"}`}>{row.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl bg-sage/[0.05] border border-sage/12 p-3">
            <p className="text-[13px] text-cream-700 font-light">
              Check your HRV + RHR tomorrow morning to close the loop.
            </p>
          </div>
        </div>
        <button
          onClick={() => setSubmitted(false)}
          className="w-full py-3 rounded-2xl bg-cream-200/70 text-cream-700 text-sm font-medium border border-cream-300/50"
        >
          Edit
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-7 max-w-2xl mx-auto lg:pl-16">
      <div>
        <p className="text-xs text-sage-dark font-medium uppercase tracking-widest">Step 4</p>
        <div className="flex items-center gap-2 mt-1">
          <h1 className="text-[28px] font-semibold text-cream-900 tracking-tight">Record Your Wins</h1>
          <Heart size={22} color="#C08B6F" />
        </div>
        <p className="text-sm text-cream-600 mt-1 font-light">How did it go? You make the system smarter.</p>
      </div>

      {/* Hint */}
      <div className="flex gap-3 items-start rounded-2xl bg-sage/[0.05] border border-sage/12 p-4">
        <Sparkle size={18} color="#7BAE7F" className="flex-shrink-0 mt-0.5" />
        <p className="text-[13px] text-cream-700 font-light leading-relaxed">
          Exercises are pre-filled from your plan. Confirm or edit what you actually did — then log overall feel below.
        </p>
      </div>

      {/* Exercises */}
      {loadingSession ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-cream-100 rounded-2xl h-24" />
          ))}
        </div>
      ) : exercises.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <DumbbellSmall />
            <h3 className="text-xs font-medium text-cream-700 uppercase tracking-widest">Exercises</h3>
          </div>
          {exercises.map((entry, i) => (
            <ExerciseLogRow
              key={i}
              entry={entry}
              onChange={(updated) => updateExercise(i, updated)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-cream-100/60 border border-cream-300/40 p-4 text-center">
          <p className="text-sm text-cream-500 font-light">
            No session plan found for today. Log your overall feel below.
          </p>
        </div>
      )}

      {/* Overall */}
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <FlexArmSmall />
          <h3 className="text-xs font-medium text-cream-700 uppercase tracking-widest">Overall</h3>
        </div>
        <SliderInput
          label="Session RPE"
          value={rpe}
          onChange={setRpe}
          min={1}
          max={10}
          hint="1 = barely moved · 7 = hard but doable · 10 = absolute max"
        />
        <SliderInput
          label="Energy After"
          value={energyAfter}
          onChange={setEnergyAfter}
          min={1}
          max={5}
          hint="1 = wiped · 3 = neutral · 5 = energized"
        />
      </div>

      {/* Prediction */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Target size={18} color="#C08B6F" />
          <div>
            <h3 className="text-xs font-medium text-cream-700 uppercase tracking-widest">
              Did the prediction match?
            </h3>
            <p className="text-[11px] text-cream-500 font-light mt-0.5">most valuable signal for calibration</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "accurate", label: "Spot on", desc: "felt right" },
            { value: "over_estimated", label: "Too high", desc: "harder than expected" },
            { value: "under_estimated", label: "Too low", desc: "had more in me" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPrediction(opt.value)}
              className={`py-3.5 rounded-2xl text-sm font-medium border transition-all duration-200 ${
                prediction === opt.value
                  ? "bg-sage/[0.06] text-sage-dark border-sage/20"
                  : "bg-white text-cream-600 border-cream-300/50 hover:border-cream-400/60"
              }`}
            >
              <span className="block text-[13px]">{opt.label}</span>
              <span className="block text-[10px] mt-0.5 opacity-50 font-light">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* HR */}
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <Pulse size={18} color="#C08B6F" />
          <div>
            <h3 className="text-xs font-medium text-cream-700 uppercase tracking-widest">Post-Workout HR</h3>
            <p className="text-[11px] text-cream-500 font-light mt-0.5">for recovery tracking</p>
          </div>
        </div>
        <SliderInput
          label="HR at stop"
          value={hrStop}
          onChange={setHrStop}
          min={80}
          max={210}
          unit="bpm"
          hint="check right when you finish"
        />
        <SliderInput
          label="HR after 1 min rest"
          value={hr1Min}
          onChange={setHr1Min}
          min={50}
          max={180}
          unit="bpm"
          hint="sit down, wait 60 seconds"
        />
        <div className={`flex items-center justify-between rounded-2xl p-4 border ${hrrBg[hrrAssessment]}`}>
          <div>
            <span className="text-sm text-cream-700 font-light">Heart Rate Recovery</span>
            <p className="text-[11px] text-cream-500 mt-0.5 font-light">
              {hrrAssessment === "good" ? "healthy autonomic response" :
               hrrAssessment === "watch" ? "worth monitoring" :
               "possible overtraining signal"}
            </p>
          </div>
          <span className={`font-mono font-semibold text-xl ${hrrColors[hrrAssessment]}`}>
            {hrrDelta}
          </span>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Pen size={18} color="#C08B6F" />
          <h3 className="text-xs font-medium text-cream-700 uppercase tracking-widest">Notes</h3>
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="what felt good, what to adjust next time..."
          className="w-full bg-white border border-cream-300/50 rounded-2xl p-4 text-sm text-cream-900 placeholder:text-cream-400 resize-none h-20 focus:outline-none focus:border-sage/20 transition-colors font-light"
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="w-full py-4 rounded-2xl bg-sage text-white font-semibold text-sm hover:bg-sage-dark transition-all duration-200"
      >
        {saving ? "Saving..." : "Record Your Wins"}
      </button>
    </div>
  );
}

function DumbbellSmall() {
  return (
    <svg width="14" height="14" viewBox="0 0 48 48" fill="none">
      <path d="M8 24h32M12 18v12M36 18v12M8 20v8M40 20v8" stroke="#C08B6F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FlexArmSmall() {
  return (
    <svg width="14" height="14" viewBox="0 0 48 48" fill="none">
      <path d="M12 34c2-1 3-3 4-5 1-3 1-5 0-7-1-3-1-5 1-7 1-1 3-2 5-2 2 0 3 1 4 2 2 2 3 5 2 8 0 2-1 3-1 5 0 1 1 2 2 3 2 1 4 1 6 0M28 16c1-2 3-3 5-3 2 0 3 1 3 3s-1 4-3 5" stroke="#C08B6F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PulseSmall() {
  return (
    <svg width="14" height="14" viewBox="0 0 48 48" fill="none">
      <path d="M4 24h8l3-8 4 16 4-12 3 6 4-2h14" stroke="#C08B6F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TargetSmall() {
  return (
    <svg width="14" height="14" viewBox="0 0 48 48" fill="none">
      <path d="M24 8a16 16 0 1 1 0 32 16 16 0 0 1 0-32zm0 6a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm0 6a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" stroke="#C08B6F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
