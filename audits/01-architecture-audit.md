# Audit 1: Architecture & Engineering Review

*Date: 2026-03-15*
*Perspective: Software architect + expert fitness coach (general)*

---

## What an expert coach would flag

### 1. No weekly programming structure
The system builds sessions day-by-day but never zooms out to ask: "what does this week look like?" A coach would plan a week: 2 strength days, 2 cardio days, 1 rest — then adjust daily. The planner only looks at the last 3 sessions. It can't enforce the 10% weekly volume cap or the 4th-week deload because there's no concept of a training week or weekly totals.

### 2. No periodization model
The system has progression rules (add reps, then add weight) but no macrocycle structure. A coach would ask: "What's the goal for the next 8 weeks? Are we in a hypertrophy block, a strength block, or a conditioning block?" The system linearly progresses forever until it can't — there's no planned phase where you intentionally shift focus.

### 3. Soreness is collected but never used
The snapshot asks for soreness (0–3 per body region) but the planner never references it. A coach wouldn't load heavy hip thrusts if you reported 3/3 lower body soreness. This field is decorative right now.

### 4. No warm-up or cool-down protocol
Sessions jump straight to working sets. A coach would prescribe specific warm-up sets (empty bar → 50% → 75% → working weight) and movement prep, especially given the ACL laxity note during ovulatory phase.

### 5. No exercise substitution logic
When hip thrusts couldn't happen on Mar 13 (Smith machine setup failed), there was no fallback. A coach would have a substitution table: "if hip thrust unavailable → glute bridge with dumbbell, or Bulgarian split squat."

### 6. OHP load is ambiguous
Is "20 lbs barbell" a 45 lb bar with plates, or a 20 lb fixed barbell? This matters — it's the difference between pressing 20 lbs and pressing 65 lbs. Progression decisions are wrong if this is wrong.

### 7. No session sequencing logic
Mar 13: back fatigue on goblet squats — likely because RDLs were done first. A coach would sequence exercises to avoid compounding fatigue: squat first (fresh legs, back isn't pre-fatigued), then hip hinge, then accessories.

### 8. Running HR is very high
Peak HR of 188–200 at 5.2–5.5 mph means zone 4–5 for most of the run. If the goal is extending duration at 5.5 mph, zone 2 work (slower, longer) may be needed to build the aerobic engine. The system has no HR zone prescription.

### 9. Lat pulldown only got 1 set on its only available day
Tuesday is the single window for this exercise. A coach would prioritize it early in the session, not as an afterthought that gets cut short.

### 10. No deload tracking mechanism
The rules say "deload every 4th week" but there's no week counter, no training block start date, nothing to trigger it. The auto-deload (2× RPE ≥ 9) exists but the scheduled deload can't fire.

---

## Engineering gaps

| Gap | Impact | Fix |
|---|---|---|
| No `week_number` or `training_block` in schema | Can't enforce deload schedule or weekly volume cap | Add training block tracker |
| No `weekly_tonnage` computation | 10% rule is unenforceable | Add weekly rollup in planner |
| `sleep_quality` defined but never used | Wasted signal | Wire into readiness or drop it |
| Readiness LOW + cycle phase ceiling undefined | What does LOW readiness look like during follicular vs luteal? | Define per-phase recovery protocols |
| `rhr_7day_avg` frequently estimated/missing | RHR delta unreliable | Add fallback: skip signal or use RHR absolute |
| No exercise substitution map | Equipment failures kill sessions | Add substitution table to progression.yaml |
| HRR assessment computed but not stored | Retrospective can't trend without re-computing | Add `hrr_assessment` field to schema |

---

## Cross-file inconsistencies

### Fields referenced but not defined
- `readiness_ceiling` and `cycle_phase_ceiling` — used in planner but never explicitly defined in schemas
- `auto_deload_trigger` — computed by logger but no schema field to store it
- `weekly_tonnage` — referenced in 10% rule but never computed or stored

### Fields defined but never used
- `sleep_quality` (1–5) — in snapshot schema, never referenced in readiness rules
- `soreness` object — in snapshot schema and planner skill mentions it, but no rule uses it
- `session_plan_ref` — in post-session-log schema, always null (no plans generated yet)

### Data type issues
- Reps: schema uses string ("8–12" ranges) but logs use string ("10, 10, 9" per-set). Automated progression parsing needs both formats handled.
- Load: free-form string ("25 lbs each", "bodyweight"). Fragile for automated comparison.

---

## Rules enforcement gaps

| Rule | Encoded | Enforced | Gap |
|---|---|---|---|
| Lowest signal wins | readiness.yaml | readiness skill | Clean |
| Never increase pace AND duration same week | progression.yaml | planner skill | No weekly tracking |
| 10% weekly volume cap | progression.yaml | planner skill | No weekly tonnage computation |
| Auto-deload: 2× RPE ≥ 9 | progression.yaml | logger/planner | Logger flags, planner must read previous session |
| Deload every 4th week | progression.yaml | planner skill | No week counter |
| No same-muscle-group within 48 hours | coach SKILL | planner skill | Requires date math, not in schema |
| Planet Fitness Tuesday only | progression.yaml | planner skill | Clean |
| Never auto-modify rules | coach SKILL | retrospective skill | Partially clean — git not integrated into schema |

---

## Session data observations (Mar 5–14)

- Sessions 1–2: health data only, no coaching context
- Sessions 3–7: mixed confirmed/estimated data
- Post-workout biometrics: never collected (all null)
- Prediction accuracy: never logged (all null)
- Session plans: never generated (all null)
- Note: these are pre-system historical sessions — gaps are expected for cold start

### Patterns visible in data
- Aerobic efficiency improving: peak HR 200 → 197 → 188 at increasing distance
- OHP stalled at 20 lbs (failed +5 and +2.5 attempts)
- RDL "improvement" Mar 10→13 was equipment familiarity, not strength gain
- Lat pulldown undertrained (1 set on only available day)
- Mar 9 + Mar 12: RPE 9 and 8 back-to-back (close to auto-deload trigger)
- Mar 14: low energy (4/10) but ran well at easy effort — subjective ≠ performance at low intensity
