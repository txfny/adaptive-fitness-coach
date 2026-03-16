// Exercise catalog derived from rules/progression.yaml
// Each exercise has equipment tags, body region, and progression defaults

export interface CatalogExercise {
  id: string;
  name: string;
  target_area: string;
  category: "lower" | "upper" | "core" | "cardio";
  movement_type: "compound" | "isolation" | "cardio";
  locations: ("home_gym" | "planet_fitness")[];
  sequence_priority: number; // lower = earlier in session
  rep_range: [number, number];
  default_sets: number;
  default_load: string;
  load_increment: number; // lbs per progression
  rest_seconds: number;
  rpe_target: number;
  notes?: string;
}

export const EXERCISE_CATALOG: CatalogExercise[] = [
  // === LOWER BODY ===
  {
    id: "goblet_squat",
    name: "Goblet Squat",
    target_area: "quads, glutes",
    category: "lower",
    movement_type: "compound",
    locations: ["home_gym", "planet_fitness"],
    sequence_priority: 1,
    rep_range: [8, 12],
    default_sets: 3,
    default_load: "25 lb DB",
    load_increment: 5,
    rest_seconds: 90,
    rpe_target: 7,
  },
  {
    id: "sumo_squat",
    name: "Sumo Squat",
    target_area: "adductors, glutes",
    category: "lower",
    movement_type: "compound",
    locations: ["home_gym", "planet_fitness"],
    sequence_priority: 2,
    rep_range: [10, 12],
    default_sets: 3,
    default_load: "25 lb DB",
    load_increment: 5,
    rest_seconds: 90,
    rpe_target: 7,
  },
  {
    id: "romanian_deadlift",
    name: "Romanian Deadlift",
    target_area: "hamstrings, glutes",
    category: "lower",
    movement_type: "compound",
    locations: ["home_gym", "planet_fitness"],
    sequence_priority: 1,
    rep_range: [8, 12],
    default_sets: 3,
    default_load: "25 lbs ea",
    load_increment: 5,
    rest_seconds: 90,
    rpe_target: 7,
  },
  {
    id: "hip_thrust",
    name: "Hip Thrust",
    target_area: "glutes",
    category: "lower",
    movement_type: "compound",
    locations: ["home_gym"],
    sequence_priority: 3,
    rep_range: [10, 15],
    default_sets: 3,
    default_load: "35 lbs ea",
    load_increment: 5,
    rest_seconds: 90,
    rpe_target: 7,
  },
  {
    id: "leg_press",
    name: "Leg Press",
    target_area: "quads, glutes",
    category: "lower",
    movement_type: "compound",
    locations: ["planet_fitness"],
    sequence_priority: 2,
    rep_range: [10, 12],
    default_sets: 3,
    default_load: "220 lbs",
    load_increment: 10,
    rest_seconds: 90,
    rpe_target: 7,
  },

  // === UPPER BODY ===
  {
    id: "lat_pulldown",
    name: "Lat Pulldown",
    target_area: "lats, biceps",
    category: "upper",
    movement_type: "compound",
    locations: ["planet_fitness"],
    sequence_priority: 1, // PF-exclusive goes first
    rep_range: [8, 12],
    default_sets: 3,
    default_load: "60 lbs",
    load_increment: 5,
    rest_seconds: 90,
    rpe_target: 7,
  },
  {
    id: "cable_pushdown",
    name: "Cable Pushdown",
    target_area: "triceps",
    category: "upper",
    movement_type: "isolation",
    locations: ["planet_fitness"],
    sequence_priority: 2,
    rep_range: [10, 15],
    default_sets: 3,
    default_load: "30 lbs",
    load_increment: 5,
    rest_seconds: 60,
    rpe_target: 7,
  },
  {
    id: "overhead_press",
    name: "Overhead Press",
    target_area: "shoulders, triceps",
    category: "upper",
    movement_type: "compound",
    locations: ["home_gym", "planet_fitness"],
    sequence_priority: 3,
    rep_range: [8, 10],
    default_sets: 3,
    default_load: "20 lbs",
    load_increment: 2.5,
    rest_seconds: 90,
    rpe_target: 7,
  },
  {
    id: "dumbbell_row",
    name: "Dumbbell Row",
    target_area: "back, biceps",
    category: "upper",
    movement_type: "compound",
    locations: ["home_gym", "planet_fitness"],
    sequence_priority: 3,
    rep_range: [8, 12],
    default_sets: 3,
    default_load: "20 lbs",
    load_increment: 5,
    rest_seconds: 90,
    rpe_target: 7,
  },
  {
    id: "tricep_dip",
    name: "Tricep Dip",
    target_area: "triceps, chest",
    category: "upper",
    movement_type: "compound",
    locations: ["home_gym"],
    sequence_priority: 4,
    rep_range: [8, 12],
    default_sets: 3,
    default_load: "BW",
    load_increment: 0,
    rest_seconds: 60,
    rpe_target: 7,
  },
  {
    id: "overhead_tricep_extension",
    name: "Overhead Tricep Extension",
    target_area: "triceps",
    category: "upper",
    movement_type: "isolation",
    locations: ["home_gym"],
    sequence_priority: 5,
    rep_range: [10, 15],
    default_sets: 3,
    default_load: "15 lbs",
    load_increment: 2.5,
    rest_seconds: 60,
    rpe_target: 7,
  },

  // === CORE ===
  {
    id: "hanging_leg_raise",
    name: "Hanging Leg Raise",
    target_area: "lower abs",
    category: "core",
    movement_type: "isolation",
    locations: ["home_gym", "planet_fitness"],
    sequence_priority: 10,
    rep_range: [10, 15],
    default_sets: 3,
    default_load: "BW",
    load_increment: 0,
    rest_seconds: 45,
    rpe_target: 7,
  },
  {
    id: "knee_raise",
    name: "Knee Raise",
    target_area: "lower abs",
    category: "core",
    movement_type: "isolation",
    locations: ["home_gym", "planet_fitness"],
    sequence_priority: 11,
    rep_range: [5, 10],
    default_sets: 3,
    default_load: "BW",
    load_increment: 0,
    rest_seconds: 45,
    rpe_target: 7,
  },
  {
    id: "dead_bug",
    name: "Dead Bug",
    target_area: "deep core",
    category: "core",
    movement_type: "isolation",
    locations: ["home_gym", "planet_fitness"],
    sequence_priority: 12,
    rep_range: [10, 15],
    default_sets: 3,
    default_load: "BW",
    load_increment: 0,
    rest_seconds: 30,
    rpe_target: 6,
  },
  {
    id: "plank_hip_dip",
    name: "Plank Hip Dip",
    target_area: "obliques",
    category: "core",
    movement_type: "isolation",
    locations: ["home_gym", "planet_fitness"],
    sequence_priority: 13,
    rep_range: [15, 20],
    default_sets: 3,
    default_load: "BW",
    load_increment: 0,
    rest_seconds: 30,
    rpe_target: 6,
  },
  {
    id: "stomach_vacuum",
    name: "Stomach Vacuum",
    target_area: "TVA",
    category: "core",
    movement_type: "isolation",
    locations: ["home_gym", "planet_fitness"],
    sequence_priority: 14,
    rep_range: [10, 20],
    default_sets: 3,
    default_load: "BW",
    load_increment: 0,
    rest_seconds: 30,
    rpe_target: 5,
    notes: "Hold for 15 sec",
  },
  {
    id: "cable_crunch",
    name: "Cable Crunch",
    target_area: "upper abs",
    category: "core",
    movement_type: "isolation",
    locations: ["planet_fitness"],
    sequence_priority: 10,
    rep_range: [12, 15],
    default_sets: 3,
    default_load: "40 lbs",
    load_increment: 5,
    rest_seconds: 45,
    rpe_target: 7,
  },
  {
    id: "pallof_press",
    name: "Pallof Press",
    target_area: "anti-rotation core",
    category: "core",
    movement_type: "isolation",
    locations: ["planet_fitness"],
    sequence_priority: 11,
    rep_range: [10, 12],
    default_sets: 3,
    default_load: "20 lbs",
    load_increment: 5,
    rest_seconds: 45,
    rpe_target: 7,
  },
];

// Session type templates: which exercises per session type + location
export interface SessionTemplate {
  type: string;
  label: string;
  categories: ("lower" | "upper" | "core" | "cardio")[];
  maxExercises: number; // max non-core exercises
  maxCore: number;
  focusCue: string;
}

export const SESSION_TEMPLATES: Record<string, SessionTemplate> = {
  strength_lower: {
    type: "strength_lower",
    label: "Strength Lower",
    categories: ["lower", "core"],
    maxExercises: 4,
    maxCore: 3,
    focusCue: "Control the bottom of every squat and hinge — 2 sec pause at the stretch, then drive up.",
  },
  strength_upper: {
    type: "strength_upper",
    label: "Strength Upper",
    categories: ["upper", "core"],
    maxExercises: 4,
    maxCore: 3,
    focusCue: "Squeeze at the top of every rep. Slow negatives — 3 seconds down.",
  },
  strength_full: {
    type: "strength_full",
    label: "Full Body",
    categories: ["lower", "upper", "core"],
    maxExercises: 5,
    maxCore: 2,
    focusCue: "Full body day — prioritize compound lifts with clean form over volume.",
  },
  cardio: {
    type: "cardio",
    label: "Cardio + Core",
    categories: ["core"],
    maxExercises: 0,
    maxCore: 3,
    focusCue: "Keep heart rate in zone 2-3 for the run. Core after.",
  },
  recovery: {
    type: "recovery",
    label: "Recovery",
    categories: [],
    maxExercises: 0,
    maxCore: 0,
    focusCue: "Listen to your body. Light movement only — walk, stretch, or easy elliptical.",
  },
};

export function getExercisesForSession(
  sessionType: string,
  location: "home_gym" | "planet_fitness"
): CatalogExercise[] {
  const template = SESSION_TEMPLATES[sessionType];
  if (!template) return [];

  return EXERCISE_CATALOG
    .filter((ex) => template.categories.includes(ex.category))
    .filter((ex) => ex.locations.includes(location))
    .sort((a, b) => a.sequence_priority - b.sequence_priority);
}
