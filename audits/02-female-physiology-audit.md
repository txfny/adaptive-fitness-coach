# Audit 2: Female Exercise Physiology Review

*Date: 2026-03-15*
*Perspective: Exercise physiologist specializing in female athlete physiology*
*Key sources: Sims (2024 ROAR revised), Janse de Jonge (2022), 2023 IOC REDs consensus, McNulty (2020), 2024/2025 systematic reviews*

---

## Critical: system built on male-biased assumptions

### 1. HRV thresholds are wrong for women
The fixed cutoffs (HRV <35 LOW, 35–55 MODERATE, >55 HIGH) come from Plews 2013, which studied male endurance athletes. HRV naturally drops in the luteal phase due to progesterone — that's normal physiology, not poor readiness. The system would flag users as MODERATE or LOW during half the cycle just because of hormones.

**What should happen:** Replace absolute thresholds with individualized rolling baseline (7–14 day mean ± standard deviation). Flag deviations from the individual's norm. Account for expected luteal-phase HRV suppression so it doesn't trigger false readiness downgrades.

**Source:** Marco Altini (HRV and menstrual cycle); PMC: HRV changes and progesterone (PMC7141121); SimpliFaster: interpreting HRV trends in athletes.

### 2. Hard intensity ceilings by phase are not well-supported
Post-2020 research consistently finds trivial-to-small performance differences across cycle phases when methodology is rigorous:
- 2024 meta-analysis: medium effects for isometric strength favoring late follicular, but limited to isometric testing
- 2023 systematic review (McMaster): "premature to conclude that short-term fluctuations in reproductive hormones appreciably influence acute exercise performance"
- 2025 systematic review (J Applied Physiology): majority of high-quality studies found no phase effects on endurance, power, or strength

Stacy Sims has evolved away from prescriptive cycle-syncing. Her updated position: "Instead of 'train hard in week 2,' we ask 'how ready are you today?'" Phase data should be context, not a hard ceiling.

The menstrual phase ceiling (MODERATE) is actually too conservative — early menstruation is a low-hormone window where many women perform well.

**What should happen:** Soften ceilings from hard limits to suggestions with easy user override. Phase informs the plan but doesn't constrain it. Readiness data + subjective input take priority.

**Source:** Sims (2024 ROAR revised); Frontiers in Sports and Active Living 2023; Frontiers in Endocrinology 2025.

### 3. The 28-day fixed-calendar model excludes most women
Only ~13% of women have a consistent 28-day cycle. The system has no handling for:
- **Variable cycle lengths** (normal range: 21–35 days). Fixed day ranges (e.g., "ovulatory = days 14–16") will be wrong for most cycles.
- **Anovulatory cycles** — common in active women and women under-fueling. Bleeding occurs but ovulation doesn't, so the hormonal profile the rules assume (estrogen surge, progesterone rise) doesn't exist.
- **Hormonal contraceptive use** — suppresses endogenous hormones entirely. Synthetic hormones at steady-state. Phase-based rules become meaningless. 2023 meta-analysis found strength adaptations similar between OC users and non-users, but the hormonal rationale for phase-based training doesn't apply.
- **Ovulation is never confirmed** — without BBT shift or urinary LH strips, the system maps recommendations to assumed hormonal states that may not exist.

**What should happen:** Ask about contraceptive use and disable phase-based hormone assumptions for OC users. Allow variable cycle lengths. Use ovulation confirmation (BBT or LH) rather than calendar prediction. Have a fallback readiness model that works without cycle data.

**Source:** PMC: Is it necessary to adapt training to the menstrual cycle? (PMC10455893); Sims (2024); Springer: hormonal contraceptives and strength adaptations (2023).

### 4. Luteal-phase HR drift makes running data misleading
Core temperature rises 0.3–0.7°C in the luteal phase (progesterone). RHR goes up 2–4 bpm. At the same running speed, HR will be higher in luteal than follicular — that's thermoregulation, not poor fitness or overexertion.

From the session data: peak HR 200 on Mar 12 (cycle day 19, luteal) vs 188 on Mar 14 (day 21, also luteal but easy effort). Some of that HR elevation is hormonal.

**What should happen:** Apply a luteal-phase HR offset (+3–5 bpm to acceptable zones) or use RPE as the primary intensity metric during luteal phase rather than HR.

**Source:** ScienceDirect: Menstrual cycle effects on thermoregulation during exercise (2024); PMC: temperature regulation in women (PMC7575238).

---

## Major gaps an expert would call inexcusable

### 5. No RED-S screening
Relative Energy Deficiency in Sport. The 2023 IOC consensus statement updated this to "REDs" with a clinical assessment tool (IOC REDs CAT2) using a four-level traffic-light severity system.

The system already has signals that could detect it: cycle irregularity, declining performance, persistently elevated RHR, suppressed HRV. It just doesn't look for the pattern.

Screening signals available from existing data:
- Menstrual irregularity (missed periods, cycle length changes)
- Unexplained performance decline
- Persistent elevated RHR
- Suppressed HRV trends
- Training inconsistency patterns

Additional signals to add:
- Self-reported energy levels (already collected)
- Mood changes
- History of stress fractures
- Disordered eating behaviors
- Libido changes

The LEAF-Q (Low Energy Availability in Females Questionnaire) is a validated screening tool that could be integrated as a periodic check-in.

**What should happen:** Implement periodic LEAF-Q-style screening. Flag patterns consistent with low energy availability (missed periods + declining performance + elevated RHR). Provide educational alerts with referral guidance. This system should never diagnose — it should detect and refer.

**Source:** 2023 IOC Consensus Statement on REDs (pubmed: 37752011); IOC REDs CAT2; PMC: REDs prevalence in professional female football (PMC11235940).

### 6. No iron deficiency awareness
Most common nutritional deficiency in female athletes. Menstrual blood loss = 10–40 mg iron per cycle. Heavy flow dramatically increases risk. 2024 systematic review (23 studies, 669 athletes): iron-deficient athletes who supplemented with 100mg/day elemental iron improved endurance performance by 2–20%.

65% of iron supplementation studies fail to report menstrual cycle phase or status — a major research gap.

**What should happen:** Track self-reported menstrual flow volume (light/moderate/heavy). Flag users with consistently heavy periods for iron screening. Incorporate fatigue/performance-decline patterns that may indicate iron depletion. Prompt for periodic ferritin checks.

**Source:** PMC: Iron deficiency supplementation and sports performance — systematic review (PMC11863318); PMC: High prevalence of iron deficiency in non-professional female endurance athletes (PMC9778947).

### 7. No nutrition component
Luteal phase:
- Impaired glycogen access → need more carbs pre-exercise
- Elevated protein catabolism → need 30g+ protein per meal (leucine-rich)
- Higher metabolic rate → increased caloric needs

2024 study (J Physiology, isotope tracers): menstrual cycle phase did not significantly influence muscle protein synthesis in response to resistance exercise (follicular MPS 1.52%/day vs luteal 1.46%/day — not statistically significant). So the catabolism narrative is partially supported but the magnitude is small.

Practical recommendation holds regardless: 1.6g/kg/day protein, 20–30g per meal every 3–4 hours. Increasing protein slightly in luteal is a reasonable precaution.

Sims is emphatic: the system adjusts training by phase but ignores the fueling that makes training productive.

**What should happen:** Add phase-aware fueling guidance at minimum: carb/protein timing recommendations by phase. The system doesn't need to be a nutrition coach, but it should flag when fueling strategy matters most.

**Source:** Sims (2024 ROAR revised); Huberman Lab episode with Sims; GSSI: muscle protein metabolism in female athletes.

---

## Missing metrics for a female-specific system

The system tracks HRV, RHR, sleep. An expert would say this is insufficient.

| Metric | Why | How |
|---|---|---|
| Basal body temperature (BBT) | Only reliable way to confirm ovulation actually happened. Without it, phase mapping is a guess. | Wearable (Oura, TempDrop) or morning oral thermometer |
| Menstrual flow volume | Heavy flow = iron loss risk. Absent flow = RED-S red flag. | Self-report: light / moderate / heavy / absent |
| Cycle length + regularity | Detects anovulatory cycles, low energy availability, hormonal disruption | Auto-tracked from period start dates |
| GI symptoms | 73% of menstruating women report premenstrual GI issues. Bloating, nausea affect training capacity and fueling. | Daily checklist: none / mild / moderate / severe |
| Mood / perceived recovery | Predicts readiness better than HRV alone in some contexts. Strongly correlated with cycle phase. | Daily 1–5 scale |
| Pain (cramps, breast tenderness) | Affects what movements are tolerable. Common in late luteal and menstrual phases. | Self-report: none / mild / moderate / severe |
| Ovulation confirmation | Calendar prediction is unreliable. LH strips or BBT shift needed. | LH test strips or BBT tracking |

Elite sporting organizations (Chelsea FC women's team, US Women's National Soccer Team) have adopted multi-metric approaches combining cycle tracking with subjective wellness, RPE, and performance data.

**Source:** MDPI: Menstrual cycle tracking in sports research (2023); IJSPT: Beyond the menstrual cycle — holistic approach; SAGE: Menstrual cycle monitoring in applied sport settings (2025).

---

## Phase model assessment

The 5-phase model is reasonable granularity. However, Janse de Jonge et al. (2022, Sports Medicine) argued that transitions between phases matter more than the phases themselves. The hormonal changes during transitions (estrogen surge before ovulation, progesterone drop pre-menstruation) can be rapid and large.

The pre-menstrual window (roughly days 25–28) is when most women report worst symptoms and most compromised training. The system lumps this into "late luteal" which is correct but should receive special attention.

**What should happen:** Add transition-day awareness. Flag 1–2 days around phase transitions as potentially high-symptom periods. Lean more heavily on subjective readiness during those windows.

**Source:** PMC: Importance of phases and transitions (PMC9213297); Springer: Transitions between phases — authors' reply (PMC10156996).

---

## Citation base assessment

The current citation index is male-biased. Key papers to add:

| Citation | What it adds |
|---|---|
| Sims (2024) — ROAR revised edition | Updated framework: cycle data as context not prescription; nutrition by phase; strength training non-negotiable throughout cycle |
| Janse de Jonge et al. (2022) — Sports Medicine | Phase transitions matter more than phases; pre-menstrual window understudied |
| 2023 IOC REDs Consensus Statement | Clinical assessment tool for RED-S screening; traffic-light severity system |
| 2024 MPS study (J Physiology) | Menstrual cycle phase does not significantly influence muscle protein synthesis — challenges catabolism narrative magnitude |
| 2025 systematic review (Frontiers in Endocrinology) | Majority of high-quality studies find no phase effects on performance — supports softening intensity ceilings |
| 2023 McMaster systematic review (Frontiers in Sports) | "Premature to conclude reproductive hormones appreciably influence acute exercise performance" |
| Cole et al. 1999 (NEJM) — already in system | Heart rate recovery; already cited |
| Marco Altini — HRV and menstrual cycle | Individualized HRV baselines; CV method for athletes; luteal-phase suppression is normal |

---

## Summary: what needs to change

### Fundamental rework needed
1. **HRV scoring** → individualized rolling baseline, not fixed thresholds
2. **Phase model** → soften ceilings to suggestions; add variable cycle length; add contraceptive-use mode; add ovulation confirmation
3. **Snapshot** → add BBT, flow volume, GI symptoms, mood, pain
4. **Running HR** → luteal-phase offset (+3–5 bpm to zones)

### New layers needed
5. **RED-S screening** → pattern detection from existing signals + periodic LEAF-Q-style questionnaire
6. **Iron deficiency flags** → track flow volume, flag fatigue patterns, prompt ferritin checks
7. **Nutrition guidance** → phase-aware carb/protein timing (not a full meal plan, just critical flags)

### Citation updates needed
8. Add female-specific research to citations.yaml (Sims 2024, Janse de Jonge 2022, IOC REDs 2023, 2024 MPS study, 2025 systematic review)
