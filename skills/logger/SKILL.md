# Logger Agent
# Collects post-session feedback and writes it to persistent storage.

---

## PURPOSE

Capture what actually happened vs what was prescribed. This is the most valuable signal in the system — predicted vs actual divergence is how every rule gets calibrated over time.

Can be invoked independently. You do not need to run the full coaching flow to log a session.

---

## WHAT TO COLLECT

Ask for these after the workout:

1. **Did you complete everything as prescribed?** If not, what changed and why?
2. **Actual reps and loads** for each exercise (if different from the plan)
3. **Overall RPE** (1–10) — how hard did the session feel as a whole?
4. **Energy after** (1–5) — 1 = depleted, 5 = energized
5. **Prediction accuracy** — did the readiness assessment match reality?
   - **accurate** — the plan matched how the session felt
   - **over_estimated** — system thought you were more ready than you were
   - **under_estimated** — system was too conservative, you had more in the tank
6. **Notes** — anything else. What felt good, what to adjust, mood, etc.
7. **Flag for review?** — did anything happen that contradicts a system rule? (yes/no + reason)

For running sessions, also collect:
- Duration (minutes)
- Pace (mph)
- Peak HR and average HR (if available)
- Running-specific RPE

---

## POST-WORKOUT BIOMETRICS (collect every session)

These readings measure the autonomic cost of the session. Collect immediately after:

1. **HR at stop** (bpm) — heart rate when the last exercise ends. Read from Apple Watch.
2. **HR after 1 min rest** (bpm) — heart rate 1 minute after stopping.

The system computes **Heart Rate Recovery (HRR)** = HR at stop − HR at 1 min. This is a validated marker of cardiovascular fitness and parasympathetic reactivation (Cole et al., 1999). A drop ≥ 20 bpm in 1 min is normal for trained individuals. If HRR declines over time at the same workload, it's an early overtraining signal.

**Next-morning readings** (optional but high-value):
Tell the user: "Tomorrow morning, check your HRV and RHR when you wake up and send them to me."

3. **Next-morning HRV** (ms) — compared to pre-workout HRV. A drop > 15% suggests the session imposed more autonomic stress than the readiness engine predicted (Stanley et al., 2013).
4. **Next-morning RHR** (bpm) — elevation > 5 bpm above pre-workout RHR suggests incomplete recovery (Plews et al., 2013).

These next-morning readings can be appended to the log the following day. They do not need to be collected at the same time as the post-session feedback.

---

## COMPUTED FIELDS

After collecting, compute:
- **HRR delta**: hr_at_stop − hr_1min_recovery. Higher = better recovery. Do not ask the user for this.
- **Next-morning HRV delta** (when available): next_morning_hrv − pre_workout_hrv. Negative = suppression.
- **Next-morning RHR delta** (when available): next_morning_rhr − pre_workout_rhr. Positive = elevated.
- **Prescribed vs actual delta** for each exercise: did reps/load increase, decrease, or hold?
- If overall RPE ≥ 9 for this session AND the previous session, flag auto-deload trigger.
- If `prediction_accuracy` is `over_estimated` or `under_estimated`, increment the running tally for calibration (see Retrospective Agent).

---

## OUTPUT

Write the completed log to: `data/sessions/YYYY-MM-DD-post-session.json`

Conform to `schemas/post-session-log.json`.

Display a brief summary to the user:

```
Session logged — [date]
  Overall RPE: [X]/10
  HRR: [X] bpm drop in 1 min [good/watch/flag]
  Prediction: [accurate / over / under]
  Progression signals: [list exercises ready to advance next session]
  Recovery check: [remind to send HRV + RHR tomorrow morning]
  Flags: [any flags, or "none"]
```

**HRR assessment:**
- Drop ≥ 20 bpm → "good" (healthy parasympathetic reactivation)
- Drop 12–19 bpm → "watch" (adequate but declining trend would be concerning)
- Drop < 12 bpm → "flag" (poor recovery response — note in log, factor into next readiness assessment)

---

## WHAT THIS AGENT DOES NOT DO

- Does not build the next session plan
- Does not modify rules
- Does not interpret trends — that's the Retrospective Agent's job

This agent writes data. The Retrospective Agent reads it.
