-- Seed historical session data from data/sessions/ JSON files
-- Run this AFTER creating the sessions table

INSERT INTO sessions (date, session_type, location, readiness_tier, is_deload, exercises, overall_rpe) VALUES

-- Mar 5: Cardio + core (pre-system, limited data)
('2026-03-05', 'cardio', 'home_gym', 'HIGH', false,
 '[{"id":"treadmill_run","name":"Treadmill Run","sets":1,"reps":"23 min","load":"—","rpe":null},
   {"id":"core_unspecified","name":"Core","sets":1,"reps":"21 min","load":"BW","rpe":null}]'::jsonb,
 null),

-- Mar 6: Cardio + core (pre-system, limited data)
('2026-03-06', 'cardio', 'home_gym', 'HIGH', false,
 '[{"id":"treadmill_run","name":"Treadmill Run","sets":1,"reps":"20 min","load":"—","rpe":null},
   {"id":"core_unspecified","name":"Core","sets":1,"reps":"25 min","load":"BW","rpe":null}]'::jsonb,
 null),

-- Mar 9: Cardio + core
('2026-03-09', 'cardio', 'home_gym', 'HIGH', false,
 '[{"id":"treadmill_run","name":"Treadmill Run","sets":1,"reps":"17 min","load":"5.2-5.5 mph","rpe":9},
   {"id":"hanging_leg_raise","name":"Hanging Leg Raise","sets":3,"reps":"10","load":"BW","rpe":null},
   {"id":"knee_raise","name":"Knee Raise","sets":3,"reps":"5","load":"BW","rpe":null},
   {"id":"stomach_vacuum","name":"Stomach Vacuum","sets":3,"reps":"10 sec","load":"BW","rpe":null}]'::jsonb,
 9),

-- Mar 10: Strength at Planet Fitness
('2026-03-10', 'strength_full', 'planet_fitness', 'MODERATE', false,
 '[{"id":"romanian_deadlift","name":"Romanian Deadlift","sets":3,"reps":"8","load":"25 lbs ea","rpe":null},
   {"id":"hip_thrust","name":"Hip Thrust","sets":3,"reps":"12","load":"35 lbs ea","rpe":null},
   {"id":"overhead_press","name":"Overhead Press","sets":3,"reps":"10","load":"20 lbs","rpe":null},
   {"id":"dumbbell_row","name":"Dumbbell Row","sets":3,"reps":"10","load":"20 lbs","rpe":null},
   {"id":"leg_press","name":"Leg Press","sets":3,"reps":"12","load":"220 lbs","rpe":null}]'::jsonb,
 7),

-- Mar 12: Cardio + core
('2026-03-12', 'cardio', 'home_gym', 'MODERATE', false,
 '[{"id":"treadmill_run","name":"Treadmill Run","sets":1,"reps":"18 min","load":"5.2-5.5 mph","rpe":8},
   {"id":"hanging_leg_raise","name":"Hanging Leg Raise","sets":3,"reps":"10","load":"BW","rpe":null},
   {"id":"knee_raise","name":"Knee Raise","sets":3,"reps":"5","load":"BW","rpe":null},
   {"id":"dead_bug","name":"Dead Bug","sets":3,"reps":"10 ea side","load":"BW","rpe":null},
   {"id":"plank_hip_dip","name":"Plank Hip Dip","sets":3,"reps":"20","load":"BW","rpe":null},
   {"id":"stomach_vacuum","name":"Stomach Vacuum","sets":3,"reps":"10 sec","load":"BW","rpe":null}]'::jsonb,
 8),

-- Mar 13: Strength at Planet Fitness
('2026-03-13', 'strength_full', 'planet_fitness', 'MODERATE', false,
 '[{"id":"romanian_deadlift","name":"Romanian Deadlift","sets":3,"reps":"10","load":"25 lbs ea","rpe":null},
   {"id":"dumbbell_row","name":"Dumbbell Row","sets":3,"reps":"10","load":"20 lbs","rpe":null},
   {"id":"overhead_press","name":"Overhead Press","sets":3,"reps":"10","load":"20 lbs","rpe":null},
   {"id":"goblet_squat","name":"Goblet Squat","sets":3,"reps":"12","load":"25 lb DB","rpe":null},
   {"id":"lat_pulldown","name":"Lat Pulldown","sets":1,"reps":"8","load":"60 lbs","rpe":null},
   {"id":"hanging_leg_raise","name":"Hanging Leg Raise","sets":3,"reps":"10","load":"BW","rpe":null},
   {"id":"knee_raise","name":"Knee Raise","sets":3,"reps":"5","load":"BW","rpe":null},
   {"id":"dead_bug","name":"Dead Bug","sets":3,"reps":"10 ea side","load":"BW","rpe":null},
   {"id":"plank_hip_dip","name":"Plank Hip Dip","sets":3,"reps":"20","load":"BW","rpe":null}]'::jsonb,
 7),

-- Mar 14: Cardio only (fasted run, skipped core due to soreness)
('2026-03-14', 'cardio', 'home_gym', 'MODERATE', false,
 '[{"id":"treadmill_run","name":"Treadmill Run","sets":1,"reps":"21 min","load":"5.2-5.5 mph","rpe":6}]'::jsonb,
 6);
