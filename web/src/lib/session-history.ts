// Supabase query helpers for session generation
import { supabase } from "./supabase";

export interface SessionRecord {
  id: string;
  date: string;
  session_type: string;
  location: string;
  readiness_tier: string;
  is_deload: boolean;
  exercises: ExerciseRecord[];
  overall_rpe?: number;
}

export interface ExerciseRecord {
  id: string; // catalog exercise id
  name: string;
  sets: number;
  reps: string;
  load: string;
  rpe?: number;
}

export async function getTodaySnapshot() {
  const today = new Date().toISOString().split("T")[0];
  const { data } = await supabase
    .from("snapshots")
    .select("*")
    .eq("date", today)
    .order("created_at", { ascending: false })
    .limit(1);
  return data?.[0] ?? null;
}

export async function getRecentSessions(days: number = 14): Promise<SessionRecord[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceStr = since.toISOString().split("T")[0];

  const { data } = await supabase
    .from("sessions")
    .select("*")
    .gte("date", sinceStr)
    .order("date", { ascending: false });

  return (data ?? []) as SessionRecord[];
}

export async function getRecentLogs(days: number = 14) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceStr = since.toISOString().split("T")[0];

  const { data } = await supabase
    .from("logs")
    .select("*")
    .gte("date", sinceStr)
    .order("date", { ascending: false });

  return data ?? [];
}

export async function getTodaySession(): Promise<SessionRecord | null> {
  const today = new Date().toISOString().split("T")[0];
  const { data } = await supabase
    .from("sessions")
    .select("*")
    .eq("date", today)
    .order("created_at", { ascending: false })
    .limit(1);

  return (data?.[0] as SessionRecord) ?? null;
}

export async function saveSession(session: Omit<SessionRecord, "id"> & { id?: string }) {
  const { data, error } = await supabase
    .from("sessions")
    .insert(session)
    .select()
    .single();

  if (error) console.error("Failed to save session:", error);
  return data;
}

export async function saveExerciseHistory(
  logId: string,
  sessionId: string | null,
  date: string,
  exercises: {
    exercise_name: string;
    target_area?: string;
    prescribed_sets: number;
    prescribed_reps?: string;
    prescribed_load?: string;
    prescribed_rpe?: number;
    sets_completed: number;
    reps_completed: string;
    load_used: string;
    actual_rpe?: number;
    skipped: boolean;
    notes?: string;
  }[]
) {
  const rows = exercises.map((ex) => ({
    log_id: logId,
    session_id: sessionId,
    date,
    exercise_name: ex.exercise_name,
    target_area: ex.target_area || null,
    prescribed_sets: ex.prescribed_sets,
    prescribed_reps: ex.prescribed_reps || null,
    prescribed_load: ex.prescribed_load || null,
    prescribed_rpe: ex.prescribed_rpe || null,
    sets_completed: ex.sets_completed,
    reps_completed: ex.reps_completed,
    load_used: ex.load_used,
    actual_rpe: ex.actual_rpe || null,
    skipped: ex.skipped,
    notes: ex.notes || null,
  }));

  const { error } = await supabase.from("exercise_history").insert(rows);
  if (error) console.error("Failed to save exercise history:", error);
}
