// Core progression logic — double progression model from rules/progression.yaml
import { Soreness } from "./types";
import { CatalogExercise, EXERCISE_CATALOG, getExercisesForSession, SESSION_TEMPLATES } from "./exercise-catalog";
import { SessionRecord, ExerciseRecord } from "./session-history";

export interface ProgressedExercise {
  id: string;
  name: string;
  target_area: string;
  sets: number;
  reps: string;
  load: string;
  rest_seconds: number;
  rpe_target: number;
  notes?: string;
}

// --- Session type selection ---

const DAY_TO_SESSION: Record<number, string> = {
  1: "strength_lower",  // Monday
  2: "strength_upper",  // Tuesday (PF day)
  3: "cardio",          // Wednesday
  4: "strength_full",   // Thursday
  5: "cardio",          // Friday
  6: "recovery",        // Saturday
  0: "recovery",        // Sunday
};

export function determineSessionType(
  readinessTier: string,
  location: string,
  recentSessions: SessionRecord[]
): string {
  if (readinessTier === "LOW") return "recovery";

  const dayOfWeek = new Date().getDay();
  let sessionType = DAY_TO_SESSION[dayOfWeek] ?? "recovery";

  // If at Planet Fitness on a non-upper day, switch to upper (that's where the cables are)
  if (location === "planet_fitness" && sessionType === "strength_lower") {
    sessionType = "strength_upper";
  }

  // Avoid repeating the same strength focus two days in a row
  if (recentSessions.length > 0) {
    const yesterday = recentSessions[0];
    if (yesterday.session_type === sessionType && sessionType.startsWith("strength_")) {
      // Swap lower <-> upper, or go full body
      if (sessionType === "strength_lower") sessionType = "strength_upper";
      else if (sessionType === "strength_upper") sessionType = "strength_lower";
    }
  }

  return sessionType;
}

// --- Deload check ---

export function shouldDeload(
  recentSessions: SessionRecord[],
  recentLogs: { overall_rpe: number; date: string }[]
): boolean {
  // Count strength sessions total for week cycling
  const strengthSessions = recentSessions.filter((s) =>
    s.session_type.startsWith("strength_")
  );
  // Simple: every 12th strength session is a deload (roughly every 4 weeks at 3x/week)
  if (strengthSessions.length > 0 && strengthSessions.length % 12 === 0) {
    return true;
  }

  // Auto-trigger: 2 consecutive strength sessions with RPE >= 9
  const recentStrengthLogs = recentLogs
    .filter((l) => l.overall_rpe >= 9)
    .slice(0, 2);
  if (recentStrengthLogs.length >= 2) {
    return true;
  }

  return false;
}

// --- Double progression ---

function parseReps(repsStr: string): number {
  // Handle formats: "12", "10-12" (take first number), "10, 10, 10" (take first)
  const match = repsStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 8;
}

function parseLoad(loadStr: string): { value: number; unit: string; raw: string } {
  if (!loadStr || loadStr === "BW" || loadStr === "bodyweight" || loadStr === "—") {
    return { value: 0, unit: "BW", raw: loadStr || "BW" };
  }
  const match = loadStr.match(/([\d.]+)/);
  const value = match ? parseFloat(match[1]) : 0;
  return { value, unit: loadStr.replace(/([\d.]+)/, "").trim() || "lbs", raw: loadStr };
}

export function progressExercise(
  catalog: CatalogExercise,
  lastPerformance: ExerciseRecord | null,
  lastRpe: number | null,
  isDeload: boolean,
  readinessTier: string
): ProgressedExercise {
  const rpeTarget = readinessTier === "MODERATE" ? 7 : catalog.rpe_target;
  const baseSets = readinessTier === "MODERATE" ? Math.max(2, catalog.default_sets - 1) : catalog.default_sets;

  // Deload: same weight, fewer sets, lower RPE
  if (isDeload) {
    const load = lastPerformance ? lastPerformance.load : catalog.default_load;
    return {
      id: catalog.id,
      name: catalog.name,
      target_area: catalog.target_area,
      sets: Math.max(2, Math.ceil(catalog.default_sets * 0.6)),
      reps: `${catalog.rep_range[0]}`,
      load,
      rest_seconds: catalog.rest_seconds,
      rpe_target: 6,
      notes: "Deload — maintain weight, reduce volume.",
    };
  }

  // No history: use catalog defaults
  if (!lastPerformance) {
    return {
      id: catalog.id,
      name: catalog.name,
      target_area: catalog.target_area,
      sets: baseSets,
      reps: `${catalog.rep_range[0]}`,
      load: catalog.default_load,
      rest_seconds: catalog.rest_seconds,
      rpe_target: rpeTarget,
      notes: "NEW — assessment. Find working weight.",
    };
  }

  const lastReps = parseReps(lastPerformance.reps);
  const lastLoad = parseLoad(lastPerformance.load);
  const effectiveRpe = lastRpe ?? 7; // conservative default

  // Bodyweight exercises: just progress reps
  if (lastLoad.unit === "BW") {
    let nextReps = lastReps;
    if (effectiveRpe <= 7 && lastReps < catalog.rep_range[1]) {
      nextReps = Math.min(lastReps + 2, catalog.rep_range[1]);
    }
    return {
      id: catalog.id,
      name: catalog.name,
      target_area: catalog.target_area,
      sets: baseSets,
      reps: `${nextReps}`,
      load: "BW",
      rest_seconds: catalog.rest_seconds,
      rpe_target: rpeTarget,
    };
  }

  // MODERATE readiness: hold, no progression
  if (readinessTier === "MODERATE") {
    return {
      id: catalog.id,
      name: catalog.name,
      target_area: catalog.target_area,
      sets: baseSets,
      reps: lastPerformance.reps,
      load: lastPerformance.load,
      rest_seconds: catalog.rest_seconds,
      rpe_target: rpeTarget,
      notes: "Moderate readiness — holding weight. No progression today.",
    };
  }

  // RPE 10 or likely failed: reduce load 10%, add a set
  if (effectiveRpe >= 10) {
    const reducedLoad = Math.round(lastLoad.value * 0.9);
    return {
      id: catalog.id,
      name: catalog.name,
      target_area: catalog.target_area,
      sets: Math.min(baseSets + 1, 4),
      reps: `${catalog.rep_range[0]}`,
      load: `${reducedLoad} ${lastLoad.unit}`.trim(),
      rest_seconds: catalog.rest_seconds,
      rpe_target: rpeTarget,
      notes: `Reduced from ${lastLoad.value} ${lastLoad.unit} — last session was RPE 10.`,
    };
  }

  // RPE 8-9: hold (same load, same reps)
  if (effectiveRpe >= 8) {
    return {
      id: catalog.id,
      name: catalog.name,
      target_area: catalog.target_area,
      sets: baseSets,
      reps: lastPerformance.reps,
      load: lastPerformance.load,
      rest_seconds: catalog.rest_seconds,
      rpe_target: rpeTarget,
      notes: effectiveRpe === 9 ? "Holding — last session was tough." : undefined,
    };
  }

  // RPE <= 7: advance
  if (lastReps >= catalog.rep_range[1]) {
    // At top of rep range — increase load, reset reps
    const newLoad = lastLoad.value + catalog.load_increment;
    return {
      id: catalog.id,
      name: catalog.name,
      target_area: catalog.target_area,
      sets: baseSets,
      reps: `${catalog.rep_range[0]}`,
      load: `${newLoad} ${lastLoad.unit}`.trim(),
      rest_seconds: catalog.rest_seconds,
      rpe_target: rpeTarget,
      notes: `Advanced from ${lastLoad.value} ${lastLoad.unit}. Reset reps to ${catalog.rep_range[0]}.`,
    };
  }

  // Not at top yet — increase reps
  const nextReps = Math.min(lastReps + 1, catalog.rep_range[1]);
  return {
    id: catalog.id,
    name: catalog.name,
    target_area: catalog.target_area,
    sets: baseSets,
    reps: `${nextReps}`,
    load: lastPerformance.load,
    rest_seconds: catalog.rest_seconds,
    rpe_target: rpeTarget,
    notes: nextReps === catalog.rep_range[1]
      ? `Top of rep range — next session: increase load by ${catalog.load_increment} lbs.`
      : undefined,
  };
}

// --- Soreness adjustments ---

export function applySorenessAdjustments(
  exercises: ProgressedExercise[],
  soreness: Soreness | undefined
): { exercises: ProgressedExercise[]; adjustmentNote: string | null } {
  if (!soreness) return { exercises, adjustmentNote: null };

  const adjustments: string[] = [];
  let filtered = [...exercises];

  // Lower body soreness
  if (soreness.lower_body >= 3) {
    filtered = filtered.filter((ex) => {
      const cat = EXERCISE_CATALOG.find((c) => c.id === ex.id);
      return cat?.category !== "lower";
    });
    adjustments.push("Skipped lower body exercises (soreness 3/3)");
  } else if (soreness.lower_body >= 2) {
    filtered = filtered.map((ex) => {
      const cat = EXERCISE_CATALOG.find((c) => c.id === ex.id);
      if (cat?.category === "lower") {
        return { ...ex, sets: Math.max(2, ex.sets - 1), notes: (ex.notes ? ex.notes + " " : "") + "Reduced volume — lower body sore." };
      }
      return ex;
    });
    adjustments.push("Reduced lower body volume (soreness 2/3)");
  }

  // Upper body soreness
  if (soreness.upper_body >= 3) {
    filtered = filtered.filter((ex) => {
      const cat = EXERCISE_CATALOG.find((c) => c.id === ex.id);
      return cat?.category !== "upper";
    });
    adjustments.push("Skipped upper body exercises (soreness 3/3)");
  } else if (soreness.upper_body >= 2) {
    filtered = filtered.map((ex) => {
      const cat = EXERCISE_CATALOG.find((c) => c.id === ex.id);
      if (cat?.category === "upper") {
        return { ...ex, sets: Math.max(2, ex.sets - 1), notes: (ex.notes ? ex.notes + " " : "") + "Reduced volume — upper body sore." };
      }
      return ex;
    });
    adjustments.push("Reduced upper body volume (soreness 2/3)");
  }

  // Core soreness
  if (soreness.core >= 3) {
    filtered = filtered.filter((ex) => {
      const cat = EXERCISE_CATALOG.find((c) => c.id === ex.id);
      return cat?.category !== "core";
    });
    adjustments.push("Skipped core exercises (soreness 3/3)");
  } else if (soreness.core >= 2) {
    const coreExercises = filtered.filter((ex) => {
      const cat = EXERCISE_CATALOG.find((c) => c.id === ex.id);
      return cat?.category === "core";
    });
    if (coreExercises.length > 2) {
      // Keep only first 2 core exercises, reduce sets
      let coreCount = 0;
      filtered = filtered.filter((ex) => {
        const cat = EXERCISE_CATALOG.find((c) => c.id === ex.id);
        if (cat?.category === "core") {
          coreCount++;
          return coreCount <= 2;
        }
        return true;
      }).map((ex) => {
        const cat = EXERCISE_CATALOG.find((c) => c.id === ex.id);
        if (cat?.category === "core") {
          return { ...ex, sets: 2 };
        }
        return ex;
      });
    }
    adjustments.push("Reduced core work (soreness 2/3)");
  }

  return {
    exercises: filtered,
    adjustmentNote: adjustments.length > 0 ? adjustments.join(". ") + "." : null,
  };
}

// --- Warmup builder ---

export function buildWarmup(sessionType: string, firstExercise: ProgressedExercise | null, location: string): string {
  if (sessionType === "recovery") {
    return "5-10 min easy walk or elliptical at conversational pace.";
  }

  if (sessionType === "cardio") {
    return "5 min walk at 3.5-4 mph → dynamic stretches (leg swings, hip circles, arm circles).";
  }

  const cardio = location === "planet_fitness"
    ? "5 min treadmill walk"
    : "5 min treadmill walk";

  const stretches = sessionType === "strength_lower" || sessionType === "strength_full"
    ? "leg swings, hip circles, bodyweight squats (10 each)"
    : "arm circles, band pull-aparts, push-ups (10 each)";

  const warmupSet = firstExercise
    ? `1 set ${firstExercise.name} @ 50% working weight × 10`
    : "";

  return [cardio, stretches, warmupSet].filter(Boolean).join(" → ");
}
