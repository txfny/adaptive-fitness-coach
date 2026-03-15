# Adaptive Fitness Coaching System

This is a deterministic, research-backed adaptive fitness coaching system designed to generate personalized training sessions that respond to daily physiological signals, menstrual cycle phase, and cumulative training history.

## What This System Does

Rather than following a fixed program, this system generates each session fresh by running your current readiness data through a layered rule engine, then applying progression logic on top of whatever your last few sessions actually looked like. The output is a concrete, reasoned workout plan — not a generic template.

## Architecture

### 5 Agents

1. **Snapshot Agent** — Collects daily inputs (HRV, RHR, sleep, cycle day, subjective energy, equipment) and validates them against `schemas/snapshot.json`.
2. **Readiness Agent** — Runs readiness scoring rules from `rules/readiness.yaml`. Outputs a readiness tier (LOW / MODERATE / HIGH) with explicit reasoning.
3. **Cycle Phase Agent** — Identifies the current menstrual cycle phase from `rules/cycle-phase.yaml` and applies the appropriate intensity ceiling and modality preferences.
4. **Progression Agent** — Reads the last 3 sessions from `data/sessions/`, applies rules from `rules/progression.yaml`, and determines what to load, volume, and intensity adjustments are appropriate today.
5. **Plan Agent** — Synthesizes all upstream outputs into a concrete session plan conforming to `schemas/session-plan.json`, then collects the post-session log conforming to `schemas/post-session-log.json` and writes it to `data/sessions/`.

### Feedback Loop

After each session, the system logs actual performance against the prediction. Over time, the Progression Agent uses this history to calibrate future plans — if the system consistently over- or under-estimates your capacity at a given cycle phase or readiness tier, it adjusts accordingly.

### GitHub Versioning

All session logs, rule changes, and schema updates are version-controlled via git. This gives you a full audit trail of every recommendation, every disagreement, and every rule edit — making the system auditable and reversible.

### Research-Backed Push-Back

When you disagree with a recommendation, the system doesn't just fold. It cites the specific paper behind the rule (see `research/citations.yaml`), explains the reasoning in plain language, and then defers to your decision — logging the override so the feedback loop accounts for it.

## File Map

```
rules/          Deterministic scoring rules (readiness, cycle phase, progression)
research/       Citation lookup table backing every rule
schemas/        JSON Schema definitions for all structured data
data/sessions/  Dated session logs written after each workout
skills/         Claude skill file (the coaching brain)
```

## Getting Started

Open `skills/fitness-coach/SKILL.md` in Claude Code. When you start a session, Claude will walk you through collecting your daily snapshot and then produce a reasoned training plan.
