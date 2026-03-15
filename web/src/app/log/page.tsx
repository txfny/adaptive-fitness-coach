"use client";

import { useState } from "react";
import { SliderInput } from "@/components/slider-input";
import { SeverityPicker } from "@/components/severity-picker";

export default function LogPage() {
  const [rpe, setRpe] = useState(7);
  const [energyAfter, setEnergyAfter] = useState(3);
  const [prediction, setPrediction] = useState<string>("accurate");
  const [hrStop, setHrStop] = useState(150);
  const [hr1Min, setHr1Min] = useState(120);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const hrrDelta = hrStop - hr1Min;
  const hrrAssessment = hrrDelta >= 20 ? "good" : hrrDelta >= 12 ? "watch" : "flag";
  const hrrColors = {
    good: "text-emerald-400",
    watch: "text-amber-400",
    flag: "text-red-400",
  };

  const handleSubmit = () => {
    // TODO: save to Supabase
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="py-6 space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
          <div className="text-4xl mb-3">✓</div>
          <h2 className="text-xl font-bold text-zinc-100 mb-2">Session Logged</h2>
          <div className="space-y-1 text-sm text-zinc-400">
            <p>Overall RPE: <span className="text-zinc-200 font-mono">{rpe}/10</span></p>
            <p>
              HRR: <span className={`font-mono ${hrrColors[hrrAssessment]}`}>
                {hrrDelta} bpm drop
              </span> → {hrrAssessment}
            </p>
            <p>Prediction: <span className="text-zinc-200">{prediction.replace("_", " ")}</span></p>
          </div>
          <p className="text-xs text-zinc-600 mt-4">
            Send me your HRV + RHR tomorrow morning
          </p>
        </div>
        <button
          onClick={() => setSubmitted(false)}
          className="w-full py-3 rounded-xl bg-zinc-800 text-zinc-300 text-sm font-medium"
        >
          Edit Log
        </button>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Log Workout</h1>
        <p className="text-sm text-zinc-500 mt-1">How did it go?</p>
      </div>

      {/* Overall RPE */}
      <div className="space-y-4">
        <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Overall</h3>
        <SliderInput label="Session RPE" value={rpe} onChange={setRpe} min={1} max={10} />
        <SliderInput label="Energy After" value={energyAfter} onChange={setEnergyAfter} min={1} max={5} />
      </div>

      {/* Prediction accuracy */}
      <div className="space-y-2">
        <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
          Did the readiness prediction match?
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "accurate", label: "Accurate" },
            { value: "over_estimated", label: "Over" },
            { value: "under_estimated", label: "Under" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPrediction(opt.value)}
              className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                prediction === opt.value
                  ? "bg-emerald-900/30 text-emerald-400 border-emerald-800"
                  : "bg-zinc-900 text-zinc-500 border-zinc-800"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Post-workout biometrics */}
      <div className="space-y-4">
        <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
          Post-Workout HR
        </h3>
        <SliderInput label="HR at stop" value={hrStop} onChange={setHrStop} min={80} max={210} unit="bpm" />
        <SliderInput label="HR after 1 min rest" value={hr1Min} onChange={setHr1Min} min={50} max={180} unit="bpm" />
        <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl p-3">
          <span className="text-sm text-zinc-400">Heart Rate Recovery</span>
          <span className={`font-mono font-bold ${hrrColors[hrrAssessment]}`}>
            {hrrDelta} bpm → {hrrAssessment}
          </span>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Notes</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="What felt good, what to adjust..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-200 placeholder:text-zinc-700 resize-none h-20 focus:outline-none focus:border-zinc-600"
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="w-full py-3.5 rounded-xl bg-emerald-500 text-zinc-950 font-semibold text-sm hover:bg-emerald-400 transition-colors"
      >
        Log Session
      </button>
    </div>
  );
}
