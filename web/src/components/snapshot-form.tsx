"use client";

import { useState } from "react";
import Link from "next/link";
import { Snapshot, ReadinessResult } from "@/lib/types";
import { computeReadiness, DEFAULT_BASELINE } from "@/lib/readiness";
import { supabase } from "@/lib/supabase";
import { SliderInput } from "./slider-input";
import { SeverityPicker } from "./severity-picker";
import { ReadinessGauge } from "./readiness-gauge";
import { Pulse, HandOnHeart, Drop, Body, House, Pen, Sparkle } from "./line-art";

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
  const [saving, setSaving] = useState(false);

  const symptomLoad = bloating + gi + cramps + fatigue;
  const pillPhase = pillDay <= 21 ? "active" : "placebo";

  const handleSubmit = async () => {
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
      symptoms: { bloating, gi_symptoms: gi, cramps_pain: cramps, fatigue },
      symptom_load: symptomLoad,
      mood,
      equipment_available: equipment,
      soreness: { lower_body: sorenessLower, upper_body: sorenessUpper, core: sorenessCore },
      notes: notes || undefined,
    };
    const result = computeReadiness(snapshot);

    // Save to Supabase
    setSaving(true);
    await supabase.from("snapshots").insert({
      date: snapshot.date,
      hrv_ms: snapshot.hrv_ms,
      rhr_bpm: snapshot.rhr_bpm,
      rhr_7day_avg: snapshot.rhr_7day_avg,
      rhr_delta: snapshot.rhr_delta,
      sleep_hours: snapshot.sleep_hours,
      subjective_energy: snapshot.subjective_energy,
      pill_pack_day: snapshot.pill_pack_day,
      pill_phase: snapshot.pill_phase,
      symptoms: snapshot.symptoms,
      symptom_load: snapshot.symptom_load,
      mood: snapshot.mood,
      equipment_available: snapshot.equipment_available,
      soreness: snapshot.soreness,
      notes: snapshot.notes,
      readiness_tier: result.tier,
      readiness_reasoning: result.reasoning,
      readiness_summary: result.summary,
    });
    setSaving(false);

    setReadinessResult(result);
    setSubmitted(true);
  };

  if (submitted && readinessResult) {
    return (
      <div className="space-y-5">
        <ReadinessGauge result={readinessResult} />
        <div className="flex gap-3">
          <button
            onClick={() => setSubmitted(false)}
            className="flex-1 py-3 rounded-2xl bg-cream-200/70 text-cream-700 text-sm font-medium hover:bg-cream-300/70 transition-colors border border-cream-300/50"
          >
            Edit
          </button>
          <Link
            href="/session"
            className="flex-1 py-3 text-center rounded-2xl bg-sage text-white text-sm font-semibold hover:bg-sage-dark transition-colors"
          >
            See Your Session
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7 max-w-lg">
      {/* Context */}
      <div className="flex gap-3 items-start rounded-2xl bg-sage/[0.05] border border-sage/12 p-4">
        <Sparkle size={18} color="#7BAE7F" className="flex-shrink-0 mt-0.5" />
        <p className="text-[13px] text-cream-700 font-light leading-relaxed">
          <span className="text-sage-dark font-medium">Step 1 of 4</span> — enter your morning numbers. These determine how hard you should train today.
        </p>
      </div>

      {/* Biometrics */}
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <Pulse size={18} color="#C08B6F" />
          <div>
            <h3 className="text-xs font-medium text-cream-700 uppercase tracking-widest">Biometrics</h3>
            <p className="text-[11px] text-cream-500 font-light mt-0.5">from Apple Health</p>
          </div>
        </div>
        <SliderInput
          label="HRV"
          value={hrv}
          onChange={setHrv}
          min={20}
          max={120}
          unit="ms"
          hint={`your baseline: ${DEFAULT_BASELINE.hrv_mean} ± ${DEFAULT_BASELINE.hrv_sd} ms`}
        />
        <SliderInput
          label="Resting HR"
          value={rhr}
          onChange={setRhr}
          min={35}
          max={100}
          unit="bpm"
          hint={`7-day avg: ${DEFAULT_BASELINE.rhr_7day_avg} bpm · ${Math.abs(rhr - DEFAULT_BASELINE.rhr_7day_avg) <= 2 ? "normal" : rhr > DEFAULT_BASELINE.rhr_7day_avg ? "elevated" : "below avg"}`}
        />
        <SliderInput
          label="Sleep"
          value={sleep}
          onChange={setSleep}
          min={0}
          max={14}
          step={0.5}
          unit="hrs"
          hint={sleep < 5 ? "under 5hrs flags LOW readiness" : sleep <= 7 ? "7+ hrs for HIGH readiness" : "solid recovery window"}
        />
      </div>

      {/* Feel */}
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <HandOnHeart size={18} color="#C08B6F" />
          <div>
            <h3 className="text-xs font-medium text-cream-700 uppercase tracking-widest">How you feel</h3>
            <p className="text-[11px] text-cream-500 font-light mt-0.5">honest gut check</p>
          </div>
        </div>
        <SliderInput
          label="Energy"
          value={energy}
          onChange={setEnergy}
          min={1}
          max={10}
          hint={energy <= 3 ? "low energy can downgrade readiness" : undefined}
        />
        <SliderInput label="Mood" value={mood} onChange={setMood} min={1} max={5} hint="tracked for patterns" />
      </div>

      {/* Pill */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Drop size={18} color="#C08B6F" />
          <h3 className="text-xs font-medium text-cream-700 uppercase tracking-widest">Pill Pack</h3>
        </div>
        <SliderInput label="Day" value={pillDay} onChange={setPillDay} min={1} max={28} />
        <div className="flex items-center gap-2.5">
          <span className={`w-2 h-2 rounded-full ${pillPhase === "active" ? "bg-lavender-soft" : "bg-amber-400"}`} />
          <p className="text-xs text-cream-600 font-light">
            {pillPhase === "active" ? "Active pills — no intensity ceiling from phase" : "Placebo week — watch for withdrawal symptoms"}
          </p>
        </div>
      </div>

      {/* Symptoms */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <FaceProfileIcon size={18} color="#C08B6F" />
          <div>
            <h3 className="text-xs font-medium text-cream-700 uppercase tracking-widest">
              Symptoms
              {symptomLoad > 0 && (
                <span className={`ml-2 font-mono text-[11px] ${symptomLoad >= 8 ? "text-rose-soft" : symptomLoad >= 4 ? "text-amber-600" : "text-cream-500"}`}>
                  {symptomLoad}/12
                </span>
              )}
            </h3>
            <p className="text-[11px] text-cream-500 font-light mt-0.5">
              4+ reduces readiness · 8+ flags LOW
            </p>
          </div>
        </div>
        <SeverityPicker label="Bloating" value={bloating} onChange={setBloating} />
        <SeverityPicker label="GI (nausea, cramps)" value={gi} onChange={setGi} />
        <SeverityPicker label="Pain (cramps, headache)" value={cramps} onChange={setCramps} />
        <SeverityPicker label="Fatigue (heaviness)" value={fatigue} onChange={setFatigue} />
      </div>

      {/* Soreness */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Body size={18} color="#C08B6F" />
          <div>
            <h3 className="text-xs font-medium text-cream-700 uppercase tracking-widest">Soreness</h3>
            <p className="text-[11px] text-cream-500 font-light mt-0.5">affects exercise selection, not readiness</p>
          </div>
        </div>
        <SeverityPicker label="Lower body" value={sorenessLower} onChange={setSorenessLower} />
        <SeverityPicker label="Upper body" value={sorenessUpper} onChange={setSorenessUpper} />
        <SeverityPicker label="Core" value={sorenessCore} onChange={setSorenessCore} />
      </div>

      {/* Equipment */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <House size={18} color="#C08B6F" />
          <h3 className="text-xs font-medium text-cream-700 uppercase tracking-widest">Where today?</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {(["home_gym", "planet_fitness"] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setEquipment(opt)}
              className={`py-3.5 px-3 rounded-2xl text-sm font-medium border transition-all duration-200 ${
                equipment === opt
                  ? "bg-sage/[0.06] text-sage-dark border-sage/20"
                  : "bg-white text-cream-600 border-cream-300/50 hover:border-cream-400/60"
              }`}
            >
              {opt === "home_gym" ? "Home Gym" : "Planet Fitness"}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-cream-500 font-light">
          {equipment === "planet_fitness"
            ? "lat pulldown + cables available — prioritized first"
            : "dumbbell-focused programming"}
        </p>
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
          placeholder="fasted, stressed, period starting..."
          className="w-full bg-white border border-cream-300/50 rounded-2xl p-4 text-sm text-cream-900 placeholder:text-cream-400 resize-none h-20 focus:outline-none focus:border-sage/20 transition-colors font-light"
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="w-full py-4 rounded-2xl bg-sage text-white font-semibold text-sm hover:bg-sage-dark transition-all duration-200"
      >
        {saving ? "Saving..." : "Check in with your body"}
      </button>
    </div>
  );
}

function FaceProfileIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path
        d="M16 38c0-2 2-4 4-5 1-.5 2-1.5 2-3 0-1-1-2-1.5-3-.5-1.5 0-3 .5-4 1-2 3-3 5-3s4 1 5 3c.5 1 1 2.5.5 4-.5 1-1.5 2-1.5 3 0 1.5 1 2.5 2 3 2 1 4 3 4 5M20 20c-1-2-1-4 0-6 1.5-3 4-5 7-5 2 0 3.5.5 5 2 1 1 2 2.5 2 4.5 0 1.5-.5 3-1 4"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
