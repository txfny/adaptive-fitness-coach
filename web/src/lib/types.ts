// Types derived from schemas/snapshot.json, session-plan.json, post-session-log.json

export interface Symptoms {
  bloating: number; // 0-3
  gi_symptoms: number;
  cramps_pain: number;
  fatigue: number;
}

export interface Soreness {
  lower_body: number; // 0-3
  upper_body: number;
  core: number;
}

export interface Snapshot {
  id?: string;
  date: string;
  hrv_ms: number;
  rhr_bpm: number;
  rhr_7day_avg?: number;
  rhr_delta?: number;
  sleep_hours: number;
  subjective_energy: number;
  pill_pack_day?: number;
  pill_phase?: "active" | "placebo";
  symptoms?: Symptoms;
  symptom_load?: number;
  mood?: number;
  equipment_available: "home_gym" | "planet_fitness" | "bodyweight_only";
  soreness?: Soreness;
  flow_status?: "none" | "light" | "moderate" | "heavy";
  notes?: string;
}

export type ReadinessTier = "LOW" | "MODERATE" | "HIGH";

export interface ReadinessSignal {
  signal: string;
  value: number;
  baseline?: string;
  deviation?: string;
  tier_assigned: ReadinessTier;
}

export interface ReadinessResult {
  tier: ReadinessTier;
  reasoning: ReadinessSignal[];
  summary: string;
}

export interface Exercise {
  name: string;
  target_area?: string;
  sets: number;
  reps?: string;
  load?: string;
  rest_seconds?: number;
  rpe_target?: number;
  is_warmup_set?: boolean;
  notes?: string;
}

export interface SessionPlan {
  id?: string;
  date: string;
  training_block?: string;
  week_number?: number;
  is_deload?: boolean;
  readiness_score: ReadinessTier;
  readiness_reasoning: ReadinessSignal[];
  pill_phase?: "active" | "placebo";
  session_type: string;
  location: "home_gym" | "planet_fitness";
  warmup?: string;
  exercises: Exercise[];
  focus_cue: string;
  estimated_duration_minutes: number;
  progression_note?: string;
  soreness_adjustments?: string;
  nutrition_note?: string;
  overrides_applied?: Array<{
    rule_overridden: string;
    user_preference: string;
    system_recommendation: string;
    citation_offered: string;
  }>;
}

export interface ExerciseLog {
  name: string;
  sets_completed: number;
  reps_completed: string;
  load_used: string;
  actual_rpe?: number;
  notes?: string;
}

export interface ExerciseLogEntry {
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
}

export interface PostWorkoutBiometrics {
  hr_at_stop_bpm?: number;
  hr_1min_recovery_bpm?: number;
  hrr_delta?: number;
  hrr_assessment?: "good" | "watch" | "flag";
}

export interface NextMorningRecovery {
  hrv_ms?: number;
  rhr_bpm?: number;
}

export interface PostSessionLog {
  id?: string;
  date: string;
  session_plan_ref?: string;
  actual_exercises?: ExerciseLog[];
  overall_rpe: number;
  energy_after?: number;
  prediction_accuracy: "accurate" | "over_estimated" | "under_estimated";
  prediction_accuracy_notes?: string;
  post_workout_biometrics?: PostWorkoutBiometrics;
  next_morning_recovery?: NextMorningRecovery;
  running_data?: {
    duration_minutes?: number;
    pace_mph?: number;
    peak_hr_bpm?: number;
    avg_hr_bpm?: number;
    rpe?: number;
    notes?: string;
  };
  notes?: string;
  flag_for_rule_review?: boolean;
  flag_reason?: string;
}

export interface UserBaseline {
  hrv_mean: number;
  hrv_sd: number;
  rhr_7day_avg: number;
  data_points: number;
  last_updated: string;
}

// For the dashboard
export interface DashboardData {
  latestSnapshot?: Snapshot;
  latestReadiness?: ReadinessResult;
  lastSession?: PostSessionLog;
  baseline: UserBaseline;
  weeklyTonnage?: number;
  sessionCount?: number;
}
