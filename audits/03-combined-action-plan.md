# Combined Action Plan

*Merging Audit 1 (architecture/engineering) and Audit 2 (female physiology)*
*Date: 2026-03-15*

---

## Priority 1: Foundation fixes (system is unreliable without these)

These affect every session. If these are wrong, downstream decisions are wrong.

| # | Change | Source | Affects |
|---|---|---|---|
| 1.1 | **Replace fixed HRV thresholds with individualized rolling baseline** (7–14 day mean ± SD). Account for expected luteal-phase suppression. | Audit 2 §1 | readiness.yaml, readiness skill, snapshot schema (needs historical HRV array or rolling avg field) |
| 1.2 | **Soften cycle phase intensity ceilings from hard limits to suggestions.** Readiness + subjective input take priority. User override should be frictionless, not require a disagreement protocol. | Audit 2 §2 | cycle-phase.yaml, planner skill |
| 1.3 | **Support variable cycle lengths.** Replace fixed day ranges with proportional phase mapping. Add fields: `cycle_length_avg`, `last_period_start_date`. Compute phase from ratio, not absolute days. | Audit 2 §3 | cycle-phase.yaml, snapshot schema, planner skill |
| 1.4 | **Add contraceptive-use mode.** If user is on hormonal BC, disable phase-based hormone logic. Fall back to readiness-only model. | Audit 2 §3 | cycle-phase.yaml, snapshot schema, coach skill |
| 1.5 | **Clarify OHP load.** Is "20 lbs barbell" = 20 lb fixed barbell or 45 lb bar + plates? Confirm and update progression.yaml. | Audit 1 §6 | progression.yaml |

---

## Priority 2: Missing layers (system is incomplete without these)

These are capabilities the system claims or implies but doesn't have.

| # | Change | Source | Affects |
|---|---|---|---|
| 2.1 | **Add weekly programming structure.** Introduce `training_week` schema: week number, weekly tonnage, session count, rest days. Planner must check weekly context before building a session. | Audit 1 §1 | New schema, planner skill, coach skill |
| 2.2 | **Add training block / periodization model.** Define 4–8 week blocks (hypertrophy, strength, conditioning, deload). Block goal informs exercise selection and progression targets. | Audit 1 §2 | New schema, planner skill, progression.yaml |
| 2.3 | **Add exercise substitution table.** Every exercise needs 1–2 fallbacks per equipment scenario. | Audit 1 §5 | progression.yaml |
| 2.4 | **Add warm-up protocol.** Movement prep + ramping sets before working weight, especially during ovulatory phase (ACL laxity). | Audit 1 §4 | planner skill |
| 2.5 | **Add session sequencing logic.** Compound movements first (squat before hinge), accessories last. Avoid pre-fatiguing stabilizers needed for later lifts. | Audit 1 §7 | planner skill |
| 2.6 | **Add RED-S screening layer.** Periodic LEAF-Q-style questionnaire. Pattern detection from existing signals (cycle irregularity + declining performance + elevated RHR). Detect and refer, never diagnose. | Audit 2 §5 | New skill or addition to retrospective skill, new schema fields |
| 2.7 | **Add iron deficiency awareness.** Track flow volume. Flag fatigue + performance decline patterns. Prompt periodic ferritin checks. | Audit 2 §6 | snapshot schema (add flow_volume), retrospective skill |
| 2.8 | **Add phase-aware nutrition flags.** Not a meal plan — just critical timing: luteal phase carb pre-load, 30g+ protein per meal in luteal, increased caloric needs. | Audit 2 §7 | planner skill (add nutrition_note to session plan), session-plan schema |

---

## Priority 3: Signal improvements (system works without these but is less accurate)

| # | Change | Source | Affects |
|---|---|---|---|
| 3.1 | **Wire soreness into planner.** If lower_body soreness ≥ 2, reduce lower body volume or swap to upper body focus. Currently collected but ignored. | Audit 1 §3 | planner skill |
| 3.2 | **Apply luteal-phase HR offset.** +3–5 bpm to acceptable HR zones during luteal phase. Or deprioritize HR in favor of RPE during luteal. | Audit 2 §4 | progression.yaml (running section), planner skill |
| 3.3 | **Add missing snapshot metrics:** BBT (ovulation confirmation), GI symptoms, mood/perceived recovery, pain (cramps/tenderness), flow volume. | Audit 2 §missing metrics | snapshot schema, snapshot skill |
| 3.4 | **Add HR zone prescription for running.** Currently no zone guidance — just pace and duration. Need zone 2 work for aerobic base building. | Audit 1 §8 | progression.yaml, planner skill |
| 3.5 | **Prioritize Tuesday-only exercises.** Lat pulldown and cable work should be sequenced early on Planet Fitness days. | Audit 1 §9 | planner skill |
| 3.6 | **Add transition-day awareness.** Flag 1–2 days around phase transitions as high-symptom periods. Lean on subjective data more heavily. | Audit 2 §phase model | cycle-phase.yaml, planner skill |
| 3.7 | **Store HRR assessment in schema.** Currently computed at display time but not persisted. Retrospective needs it for trending. | Audit 1 §engineering | post-session-log schema |
| 3.8 | **Use or drop `sleep_quality`.** Currently in snapshot schema but never referenced by readiness rules. Either wire it in or remove it. | Audit 1 §engineering | readiness.yaml or snapshot schema |
| 3.9 | **Define LOW readiness recovery protocols per phase.** Currently: LOW = "recovery only" but no phase-specific guidance on what recovery looks like. | Audit 1 §engineering | cycle-phase.yaml, planner skill |

---

## Priority 4: Citation updates

| # | Citation to add | What it covers |
|---|---|---|
| 4.1 | Sims (2024) — ROAR revised edition | Cycle data as context not prescription; nutrition by phase; strength non-negotiable |
| 4.2 | Janse de Jonge et al. (2022) — Sports Medicine | Phase transitions > phases; pre-menstrual window |
| 4.3 | 2023 IOC REDs Consensus Statement | RED-S screening and severity tool |
| 4.4 | 2024 MPS study (J Physiology) | Cycle phase doesn't significantly affect muscle protein synthesis |
| 4.5 | 2025 systematic review (Frontiers in Endocrinology) | Majority of rigorous studies find no phase effects on performance |
| 4.6 | 2023 McMaster review (Frontiers in Sports) | "Premature to conclude hormones appreciably influence performance" |
| 4.7 | Marco Altini — HRV and menstrual cycle | Individualized HRV baselines; CV method; luteal suppression is normal |
| 4.8 | 2024 thermoregulation study (ScienceDirect) | Luteal-phase core temp elevation maintained during exercise |

---

## What does NOT need to change

- **5-agent architecture** — sound, well-scoped, independently callable
- **Feedback loop design** — prediction accuracy → calibration engine → user-approved rule changes
- **Git versioning** — audit trail for every rule change
- **RPE-based progression model** — well-supported, appropriate for this context
- **Conservative-by-default philosophy** — correct, just needs to be applied with female-specific baselines
- **Post-workout biometric tracking** — HRR and next-morning recovery are valid signals, just haven't been collected yet (cold start)

---

## Suggested build order

**Phase A — Get the foundation right (before next session):**
1.1 (HRV baseline rework), 1.2 (soften ceilings), 1.5 (OHP clarification)

**Phase B — Fill structural gaps (this week):**
2.1 (weekly structure), 2.3 (substitution table), 2.5 (sequencing logic), 3.1 (soreness wiring), 3.5 (Tuesday prioritization)

**Phase C — Add female-specific layers (next week):**
1.3 (variable cycle length), 3.2 (luteal HR offset), 3.3 (expanded snapshot metrics), 2.8 (nutrition flags), 4.x (citations)

**Phase D — Screening and long-term (after 2+ weeks of data):**
1.4 (contraceptive mode), 2.2 (periodization), 2.6 (RED-S screening), 2.7 (iron deficiency), 2.4 (warm-up protocol), 3.6 (transition days)

---

## Open questions for user

1. **OHP load**: Is "20 lbs barbell" a 20 lb fixed barbell or a standard 45 lb bar with plates?
2. **Contraceptive use**: Are you on hormonal birth control? This determines whether phase-based logic applies.
3. **Cycle length**: Is your cycle consistently ~28 days, or does it vary? Do you track ovulation (BBT, LH strips)?
4. **Training goals**: What's the priority for the next 8 weeks — building running endurance, strength progression, or balanced? This determines the periodization block.
5. **Nutrition**: Do you want the system to include phase-aware fueling notes, or keep it training-only?
