# Coach Pipeline — Deterministic Tools

**Principle: Claude owns reasoning. Code owns data.**

Before building any session plan, you MUST call the deterministic tools. Do not guess session types, compute readiness in your head, or rely on conversation memory for working weights.

## Tool Endpoints

Base URL: `https://gym-healthy-coach.azurewebsites.net/api`
Auth: append `?code=<AZURE_FUNCTION_KEY>` to every request. Key is in `azure-functions/.env.keys` (gitignored).

### Pre-Session (call BEFORE planning)

| Endpoint | Method | Input | Returns |
|---|---|---|---|
| `/session-type?date=YYYY-MM-DD` | GET | date param | Day name, session type, focus, location, with_bf |
| `/readiness` | POST | `{ hrv_ms, rhr_bpm, rhr_7day_avg, sleep_hours, energy, symptom_load }` | Tier (LOW/MODERATE/HIGH), signals, reasoning, volume_adjustment, rpe_cap |
| `/ivg?date=YYYY-MM-DD` | GET | date param | Gap check: status (clear/gaps_found), list of missing days |
| `/working-weights` | GET | none | Latest working weight per exercise from Supabase |
| `/pre-session` | POST | `{ date, snapshot }` | All of the above in one call |

### Post-Session (call AFTER logging)

| Endpoint | Method | Input | Returns |
|---|---|---|---|
| `/save-snapshot` | POST | snapshot object | Confirmation of Supabase write |
| `/save-session` | POST | session log object | Confirmation + exercise_history rows saved |
| `/ovg` | POST | `{ date, session_plan }` | Validation: errors and warnings |
| `/post-session` | POST | `{ date, session_data }` | Save + OVG in one call |

## Mandatory Pipeline Order

```
1. GET  /session-type     → know what today IS (non-negotiable)
2. POST /readiness        → compute tier from user's snapshot
3. GET  /ivg              → check for data gaps this week
4. GET  /working-weights  → fetch current weights (don't guess)
5. [Claude builds session plan + justification using the above]
6. POST /save-session     → persist IMMEDIATELY after workout
7. POST /ovg              → validate everything before closing out
```

## Rules

- NEVER skip step 1. The session type is determined by code, not by you.
- NEVER prescribe a weight without checking /working-weights first.
- NEVER say a session is "logged" without calling /save-session.
- If /ivg returns gaps, resolve them before proceeding.
- If /ovg returns errors, fix them before showing output to the user.

## Reference Files

- `rules/readiness.yaml` — readiness scoring logic (implemented in code)
- `rules/progression.yaml` — weekly template, exercise pool, progression model
- `rules/cycle-phase.yaml` — OC rules (no phase-based intensity ceilings)
- `research/citations.yaml` — research sources for justification step
- `skills/` — coaching skill definitions (snapshot, readiness, planner, logger)
- `data/sessions/` — session JSON files (backup, also in Supabase)
