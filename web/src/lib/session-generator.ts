// Orchestrator: generates a full session plan from today's snapshot + history
import { SessionPlan, ReadinessResult, Soreness, Exercise } from "./types";
import { EXERCISE_CATALOG, getExercisesForSession, SESSION_TEMPLATES } from "./exercise-catalog";
import {
  determineSessionType,
  shouldDeload,
  progressExercise,
  applySorenessAdjustments,
  buildWarmup,
  ProgressedExercise,
} from "./progression-engine";
import {
  SessionRecord,
  ExerciseRecord,
  getRecentSessions,
  getRecentLogs,
  getTodaySession,
  saveSession,
} from "./session-history";

export interface GenerateSessionInput {
  date: string;
  readiness: ReadinessResult;
  equipment: "home_gym" | "planet_fitness";
  soreness?: Soreness;
  pillPhase?: "active" | "placebo";
}

function findLastPerformance(
  exerciseId: string,
  exerciseName: string,
  recentSessions: SessionRecord[]
): ExerciseRecord | null {
  for (const session of recentSessions) {
    if (!session.exercises) continue;
    const found = session.exercises.find(
      (ex) => ex.id === exerciseId || ex.name.toLowerCase() === exerciseName.toLowerCase()
    );
    if (found) return found;
  }
  return null;
}

function getLastSessionRpe(
  exerciseId: string,
  recentSessions: SessionRecord[]
): number | null {
  // Use overall session RPE as proxy (per-exercise RPE not reliably tracked yet)
  for (const session of recentSessions) {
    if (!session.exercises) continue;
    const found = session.exercises.find(
      (ex) => ex.id === exerciseId
    );
    if (found) return session.overall_rpe ?? null;
  }
  return null;
}

export async function generateSession(
  input: GenerateSessionInput
): Promise<SessionPlan> {
  const { date, readiness, equipment, soreness, pillPhase } = input;

  // Check if we already have a session for today
  const existing = await getTodaySession();
  if (existing) {
    // Convert stored session to SessionPlan format
    return sessionRecordToPlan(existing, readiness);
  }

  // Fetch history
  const recentSessions = await getRecentSessions(14);
  const recentLogs = await getRecentLogs(14);

  // Determine session type
  const sessionType = determineSessionType(readiness.tier, equipment, recentSessions);
  const template = SESSION_TEMPLATES[sessionType];

  // Recovery session — no exercises needed
  if (sessionType === "recovery") {
    const plan: SessionPlan = {
      date,
      readiness_score: readiness.tier,
      readiness_reasoning: readiness.reasoning,
      pill_phase: pillPhase,
      session_type: sessionType,
      location: equipment,
      warmup: buildWarmup(sessionType, null, equipment),
      exercises: [],
      focus_cue: template.focusCue,
      estimated_duration_minutes: 20,
      progression_note: "Recovery day. Light movement only — walk, stretch, or easy elliptical.",
      nutrition_note: "Stay hydrated. Get 25-30g protein with your next meal.",
    };

    await saveSessionFromPlan(plan);
    return plan;
  }

  // Cardio session
  if (sessionType === "cardio") {
    const coreExercises = getExercisesForSession(sessionType, equipment);
    const isDeload = shouldDeload(recentSessions, recentLogs);

    let progressed: ProgressedExercise[] = coreExercises.slice(0, template.maxCore).map((cat) => {
      const last = findLastPerformance(cat.id, cat.name, recentSessions);
      const lastRpe = getLastSessionRpe(cat.id, recentSessions);
      return progressExercise(cat, last, lastRpe, isDeload, readiness.tier);
    });

    const { exercises: adjusted, adjustmentNote } = applySorenessAdjustments(progressed, soreness);

    const runExercise: Exercise = {
      name: "Treadmill Run",
      target_area: "cardiovascular",
      sets: 1,
      reps: "20 min",
      load: "5.2-5.5 mph",
      rest_seconds: 0,
      rpe_target: readiness.tier === "MODERATE" ? 7 : 8,
      notes: "5 min walk → 12-15 min @ pace → cool down. No forced progression on running.",
    };

    const plan: SessionPlan = {
      date,
      readiness_score: readiness.tier,
      readiness_reasoning: readiness.reasoning,
      pill_phase: pillPhase,
      session_type: sessionType,
      location: equipment,
      is_deload: isDeload,
      warmup: buildWarmup(sessionType, null, equipment),
      exercises: [runExercise, ...toExercises(adjusted)],
      focus_cue: template.focusCue,
      estimated_duration_minutes: 40,
      soreness_adjustments: adjustmentNote ?? undefined,
      nutrition_note: "Get 25-30g protein within an hour after.",
    };

    await saveSessionFromPlan(plan);
    return plan;
  }

  // Strength session
  const isDeload = shouldDeload(recentSessions, recentLogs);
  const catalogExercises = getExercisesForSession(sessionType, equipment);

  // Split into main + core
  const mainExercises = catalogExercises.filter((ex) => ex.category !== "core");
  const coreExercises = catalogExercises.filter((ex) => ex.category === "core");

  // Progress each exercise
  const progressedMain = mainExercises.slice(0, template.maxExercises).map((cat) => {
    const last = findLastPerformance(cat.id, cat.name, recentSessions);
    const lastRpe = getLastSessionRpe(cat.id, recentSessions);
    return progressExercise(cat, last, lastRpe, isDeload, readiness.tier);
  });

  const progressedCore = coreExercises.slice(0, template.maxCore).map((cat) => {
    const last = findLastPerformance(cat.id, cat.name, recentSessions);
    const lastRpe = getLastSessionRpe(cat.id, recentSessions);
    return progressExercise(cat, last, lastRpe, isDeload, readiness.tier);
  });

  const allProgressed = [...progressedMain, ...progressedCore];

  // Apply soreness adjustments
  const { exercises: adjusted, adjustmentNote } = applySorenessAdjustments(allProgressed, soreness);

  // Build progression note from exercises that advanced
  const advancedNotes = adjusted
    .filter((ex) => ex.notes && (ex.notes.includes("Advanced") || ex.notes.includes("NEW")))
    .map((ex) => `${ex.name}: ${ex.notes}`)
    .join(". ");

  const plan: SessionPlan = {
    date,
    readiness_score: readiness.tier,
    readiness_reasoning: readiness.reasoning,
    pill_phase: pillPhase,
    session_type: sessionType,
    location: equipment,
    is_deload: isDeload,
    warmup: buildWarmup(sessionType, adjusted[0] ?? null, equipment),
    exercises: toExercises(adjusted),
    focus_cue: template.focusCue,
    estimated_duration_minutes: estimateDuration(adjusted),
    progression_note: advancedNotes || (isDeload ? "Deload week — maintain weight, reduce volume." : undefined),
    soreness_adjustments: adjustmentNote ?? undefined,
    nutrition_note: "Get 25-30g protein within an hour after.",
  };

  await saveSessionFromPlan(plan);
  return plan;
}

// Force regenerate (ignores cached session)
export async function regenerateSession(
  input: GenerateSessionInput
): Promise<SessionPlan> {
  const recentSessions = await getRecentSessions(14);
  const recentLogs = await getRecentLogs(14);

  const sessionType = determineSessionType(input.readiness.tier, input.equipment, recentSessions);

  // Delete today's existing session first
  const { supabase } = await import("./supabase");
  await supabase.from("sessions").delete().eq("date", input.date);

  // Regenerate by calling generateSession (which won't find a cached one now)
  return generateSession(input);
}

// --- Helpers ---

function toExercises(progressed: ProgressedExercise[]): Exercise[] {
  return progressed.map((p) => ({
    name: p.name,
    target_area: p.target_area,
    sets: p.sets,
    reps: p.reps,
    load: p.load,
    rest_seconds: p.rest_seconds,
    rpe_target: p.rpe_target,
    notes: p.notes,
  }));
}

function estimateDuration(exercises: ProgressedExercise[]): number {
  // Rough: warmup (5) + exercises * sets * (set time + rest) + buffer
  const totalSets = exercises.reduce((sum, ex) => sum + ex.sets, 0);
  return Math.round(5 + totalSets * 2.5);
}

async function saveSessionFromPlan(plan: SessionPlan) {
  const record = {
    date: plan.date,
    session_type: plan.session_type,
    location: plan.location,
    readiness_tier: plan.readiness_score,
    is_deload: plan.is_deload ?? false,
    exercises: plan.exercises.map((ex) => ({
      id: EXERCISE_CATALOG.find((c) => c.name === ex.name)?.id ?? ex.name.toLowerCase().replace(/\s+/g, "_"),
      name: ex.name,
      sets: ex.sets,
      reps: ex.reps ?? "",
      load: ex.load ?? "",
      rpe: ex.rpe_target,
    })),
    overall_rpe: undefined,
  };

  await saveSession(record);
}

function sessionRecordToPlan(record: SessionRecord, readiness: ReadinessResult): SessionPlan {
  return {
    date: record.date,
    readiness_score: record.readiness_tier as "HIGH" | "MODERATE" | "LOW",
    readiness_reasoning: readiness.reasoning,
    session_type: record.session_type,
    location: record.location as "home_gym" | "planet_fitness",
    is_deload: record.is_deload,
    warmup: buildWarmup(record.session_type, null, record.location),
    exercises: (record.exercises ?? []).map((ex) => ({
      name: ex.name,
      target_area: EXERCISE_CATALOG.find((c) => c.id === ex.id)?.target_area ?? "",
      sets: ex.sets,
      reps: ex.reps,
      load: ex.load,
      rest_seconds: EXERCISE_CATALOG.find((c) => c.id === ex.id)?.rest_seconds ?? 60,
      rpe_target: ex.rpe ?? 7,
    })),
    focus_cue: SESSION_TEMPLATES[record.session_type]?.focusCue ?? "",
    estimated_duration_minutes: estimateDuration(
      (record.exercises ?? []).map((ex) => ({
        ...ex,
        target_area: "",
        rest_seconds: 60,
        rpe_target: 7,
      }))
    ),
    nutrition_note: "Get 25-30g protein within an hour after.",
  };
}
