"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SessionCard } from "@/components/session-card";
import { generateSession, regenerateSession, GenerateSessionInput } from "@/lib/session-generator";
import { getTodaySnapshot } from "@/lib/session-history";
import { computeReadiness } from "@/lib/readiness";
import { Sparkle, FlexArm, Moon } from "@/components/line-art";
import type { SessionPlan, Snapshot, Soreness } from "@/lib/types";

export default function SessionPage() {
  const [plan, setPlan] = useState<SessionPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [noSnapshot, setNoSnapshot] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const loadSession = async () => {
    setLoading(true);
    const snapshot = await getTodaySnapshot();

    if (!snapshot) {
      setNoSnapshot(true);
      setLoading(false);
      return;
    }

    const snapshotTyped: Snapshot = {
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
      soreness: snapshot.soreness as Soreness | undefined,
      notes: snapshot.notes,
    };

    const readiness = computeReadiness(snapshotTyped);

    const input: GenerateSessionInput = {
      date: snapshot.date,
      readiness,
      equipment: snapshot.equipment_available,
      soreness: snapshot.soreness as Soreness | undefined,
      pillPhase: snapshot.pill_phase,
    };

    const session = await generateSession(input);
    setPlan(session);
    setLoading(false);
  };

  const handleRegenerate = async () => {
    if (!plan) return;
    setRegenerating(true);

    const snapshot = await getTodaySnapshot();
    if (!snapshot) return;

    const snapshotTyped: Snapshot = {
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
      soreness: snapshot.soreness as Soreness | undefined,
      notes: snapshot.notes,
    };

    const readiness = computeReadiness(snapshotTyped);
    const input: GenerateSessionInput = {
      date: snapshot.date,
      readiness,
      equipment: snapshot.equipment_available,
      soreness: snapshot.soreness as Soreness | undefined,
      pillPhase: snapshot.pill_phase,
    };

    const session = await regenerateSession(input);
    setPlan(session);
    setRegenerating(false);
  };

  useEffect(() => {
    loadSession();
  }, []);

  if (loading) {
    return (
      <div className="py-8 max-w-2xl mx-auto lg:pl-16">
        <div className="mb-6">
          <p className="text-xs text-sage-dark font-medium uppercase tracking-widest">Step 3</p>
          <h1 className="text-[28px] font-semibold text-cream-900 mt-1 tracking-tight">Your Session</h1>
        </div>
        <div className="bg-white border border-cream-300/50 rounded-2xl p-8 text-center card-soft">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-cream-200 rounded w-3/4 mx-auto" />
            <div className="h-4 bg-cream-200 rounded w-1/2 mx-auto" />
            <div className="h-32 bg-cream-200 rounded" />
            <div className="h-4 bg-cream-200 rounded w-2/3 mx-auto" />
          </div>
          <p className="text-sm text-cream-500 mt-4 font-light">Building your session...</p>
        </div>
      </div>
    );
  }

  if (noSnapshot) {
    return (
      <div className="py-8 max-w-2xl mx-auto lg:pl-16">
        <div className="mb-6">
          <p className="text-xs text-sage-dark font-medium uppercase tracking-widest">Step 3</p>
          <h1 className="text-[28px] font-semibold text-cream-900 mt-1 tracking-tight">Your Session</h1>
        </div>
        <div className="bg-white border border-cream-300/50 rounded-2xl p-8 text-center card-soft">
          <Sparkle size={40} color="#7BAE7F" className="mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-cream-900 mb-2">Check in first</h2>
          <p className="text-sm text-cream-600 font-light mb-5">
            Your session is built from your morning numbers. Complete your check-in to get a personalized plan.
          </p>
          <Link
            href="/snapshot"
            className="inline-block py-3 px-8 rounded-2xl bg-sage text-white text-sm font-semibold hover:bg-sage-dark transition-colors"
          >
            Start Check-In
          </Link>
        </div>
      </div>
    );
  }

  if (!plan) return null;

  // Recovery session has a special view
  if (plan.session_type === "recovery") {
    return (
      <div className="py-8 max-w-2xl mx-auto lg:pl-16">
        <div className="mb-6">
          <p className="text-xs text-sage-dark font-medium uppercase tracking-widest">Step 3</p>
          <div className="flex items-center gap-2 mt-1">
            <h1 className="text-[28px] font-semibold text-cream-900 tracking-tight">Recovery Day</h1>
            <Moon size={22} color="#C08B6F" />
          </div>
          <p className="text-sm text-cream-600 mt-1 font-light">
            Your body is asking for rest. That&apos;s the smart move.
          </p>
        </div>

        <div className="bg-white border border-cream-300/50 rounded-2xl p-6 card-soft space-y-4">
          <div className="bg-rose-soft/[0.06] border border-rose-soft/15 rounded-xl p-4">
            <p className="text-sm text-cream-700 font-light">
              <span className="text-rose-soft font-medium">LOW readiness</span> — {plan.progression_note}
            </p>
          </div>
          <div className="bg-sage/[0.04] border border-sage/10 rounded-xl p-4">
            <p className="text-sm text-cream-700 font-light">{plan.focus_cue}</p>
          </div>
          <p className="text-[13px] text-cream-500 font-light">
            Options: easy walk, gentle stretching, or full rest. Skip the gym guilt — recovery IS training.
          </p>
        </div>

        <div className="mt-5">
          <Link
            href="/"
            className="block w-full py-3.5 text-center rounded-2xl bg-cream-200/70 text-cream-700 text-sm font-medium hover:bg-cream-300/70 transition-colors border border-cream-300/50"
          >
            Back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-2xl mx-auto lg:pl-16">
      <div className="mb-6">
        <p className="text-xs text-sage-dark font-medium uppercase tracking-widest">Step 3</p>
        <div className="flex items-center gap-2 mt-1">
          <h1 className="text-[28px] font-semibold text-cream-900 tracking-tight">Your Session</h1>
          <FlexArm size={22} color="#C08B6F" />
        </div>
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

      <SessionCard plan={plan} />

      <div className="mt-5 flex gap-3">
        <Link
          href="/"
          className="flex-1 py-3.5 text-center rounded-2xl bg-cream-200/70 text-cream-700 text-sm font-medium hover:bg-cream-300/70 transition-colors border border-cream-300/50"
        >
          Back
        </Link>
        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          className="py-3.5 px-5 rounded-2xl bg-cream-200/70 text-cream-700 text-sm font-medium hover:bg-cream-300/70 transition-colors border border-cream-300/50 disabled:opacity-50"
        >
          {regenerating ? "..." : "Regenerate"}
        </button>
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
