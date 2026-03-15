"use client";

import { useState } from "react";
import { Snapshot, ReadinessResult } from "@/lib/types";
import { computeReadiness, DEFAULT_BASELINE } from "@/lib/readiness";
import { SliderInput } from "./slider-input";
import { SeverityPicker } from "./severity-picker";
import { ReadinessGauge } from "./readiness-gauge";

export function SnapshotForm() {
  const [submitted, setSubmitted] = useState(false);
  const [readinessResult, setReadinessResult] = useState<ReadinessResult | null>(null);

  const [hrv, setHrv] = useState(57);
  const [rhr, setRhr] = useState(53);
  const [sleep, setSleep] = useState(7);
  const [energy, setEnergy] = useState(6);
  const [mood, setMood] = useState(3);
  const [pillDay, setPillDay] = useState(15);
  const [equipment, setEquipment] = useState<"home_gym" | "planet_fitness">("home_gym");

  const [bloating, setBloating] = useState(0);
  const [gi, setGi] = useState(0);
  const [cramps, setCramps] = useState(0);
  const [fatigue, setFatigue] = useState(0);

  const [sorenessLower, setSorenessLower] = useState(0);
  const [sorenessUpper, setSorenessUpper] = useState(0);
  const [sorenessCore, setSorenessCore] = useState(0);

  const [notes, setNotes] = useState("");

  const symptomLoad = bloating + gi + cramps + fatigue;
  const pillPhase = pillDay <= 21 ? "active" : "placebo";

  const handleSubmit = () => {
    const snapshot: Snapshot = {
      date: new Date().toISOString().split("T")[0],
      hrv_ms: hrv,
      rhr_bpm: rhr,
      rhr_7day_avg: DEFAULT_BASELINE.rhr_7day_avg,
      rhr_delta: rhr - DEFAULT_BASELINE.rhr_7day_avg,
      sleep_hours: sleep,
      subjective_energy: energy,
      pill_pack_day: pillDay,
      pill_phase: pillPhase as "active" | "placebo",
      symptoms: {
        bloating,
        gi_symptoms: gi,
        cramps_pain: cramps,
        fatigue,
      },
      symptom_load: symptomLoad,
      mood,
      equipment_available: equipment,
      soreness: {
        lower_body: sorenessLower,
        upper_body: sorenessUpper,
        core: sorenessCore,
      },
      notes: notes || undefined,
    };

    const result = computeReadiness(snapshot);
    setReadinessResult(result);
    setSubmitted(true);

    // TODO: save to Supabase
  };

  if (submitted && readinessResult) {
    return (
      <div className="space-y-4">
        <ReadinessGauge result={readinessResult} />
        <button
          onClick={() => setSubmitted(false)}
          className="w-full py-3 rounded-xl bg-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-700 transition-colors"
        >
          Edit Snapshot
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Biometrics */}
      <div className="space-y-4">
        <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Biometrics</h3>
        <SliderInput label="HRV" value={hrv} onChange={setHrv} min={20} max={120} unit="ms" />
        <SliderInput label="Resting HR" value={rhr} onChange={setRhr} min={35} max={100} unit="bpm" />
        <SliderInput label="Sleep" value={sleep} onChange={setSleep} min={0} max={14} step={0.5} unit="hrs" />
      </div>

      {/* Subjective */}
      <div className="space-y-4">
        <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">How you feel</h3>
        <SliderInput label="Energy" value={energy} onChange={setEnergy} min={1} max={10} />
        <SliderInput label="Mood" value={mood} onChange={setMood} min={1} max={5} />
      </div>

      {/* Pill pack */}
      <div className="space-y-4">
        <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Pill Pack</h3>
        <div className="flex items-center justify-between">
          <SliderInput label="Day" value={pillDay} onChange={setPillDay} min={1} max={28} />
        </div>
        <p className="text-xs text-zinc-600">
          {pillPhase === "active" ? "Active pills" : "Placebo week"}
        </p>
      </div>

      {/* Symptoms */}
      <div className="space-y-3">
        <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
          Symptoms
          {symptomLoad > 0 && (
            <span className="ml-2 text-zinc-600">load: {symptomLoad}/12</span>
          )}
        </h3>
        <SeverityPicker label="Bloating" value={bloating} onChange={setBloating} />
        <SeverityPicker label="GI (nausea, cramps)" value={gi} onChange={setGi} />
        <SeverityPicker label="Pain (cramps, headache)" value={cramps} onChange={setCramps} />
        <SeverityPicker label="Fatigue (heaviness)" value={fatigue} onChange={setFatigue} />
      </div>

      {/* Soreness */}
      <div className="space-y-3">
        <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Soreness</h3>
        <SeverityPicker label="Lower body" value={sorenessLower} onChange={setSorenessLower} />
        <SeverityPicker label="Upper body" value={sorenessUpper} onChange={setSorenessUpper} />
        <SeverityPicker label="Core" value={sorenessCore} onChange={setSorenessCore} />
      </div>

      {/* Equipment */}
      <div className="space-y-2">
        <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Equipment</h3>
        <div className="grid grid-cols-2 gap-2">
          {(["home_gym", "planet_fitness"] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setEquipment(opt)}
              className={`py-2.5 px-3 rounded-xl text-sm font-medium border transition-all ${
                equipment === opt
                  ? "bg-emerald-900/30 text-emerald-400 border-emerald-800"
                  : "bg-zinc-900 text-zinc-500 border-zinc-800"
              }`}
            >
              {opt === "home_gym" ? "Home Gym" : "Planet Fitness"}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Notes</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Fasted, stressed, didn't eat well..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-200 placeholder:text-zinc-700 resize-none h-20 focus:outline-none focus:border-zinc-600"
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="w-full py-3.5 rounded-xl bg-emerald-500 text-zinc-950 font-semibold text-sm hover:bg-emerald-400 transition-colors"
      >
        Check Readiness
      </button>
    </div>
  );
}
