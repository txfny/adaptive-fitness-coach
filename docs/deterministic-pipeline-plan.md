# Deterministic Pipeline Plan

## Problem
Skills are prose instructions. Claude reads them (or doesn't), follows them (or doesn't), persists data (or doesn't). Every step is probabilistic — depends on Claude paying attention. Data has been lost between conversations because of this.

## Principle
**Claude owns reasoning. Code owns data.**

## Current vs Target

| Step | Currently | Target |
|------|-----------|--------|
| Collect snapshot | Claude asks, user answers, Claude holds in memory | Claude asks → **app form saves to Supabase** |
| Compute readiness | Claude does math in its head | **Code computes from Supabase data** |
| IVG (week continuity) | Claude reads files, maybe | **Code queries Supabase: "any gaps this week?"** |
| Build session plan | Claude reasoning | Claude — this is where judgment matters |
| Justify session | Claude reasoning | Claude — same |
| Log session results | Claude collects, maybe writes file | Claude collects → **app form saves to Supabase** |
| OVG (validate output) | Claude checks itself | **Code validates: weights match? dates correct?** |
| Persist to files | Claude writes (or forgets) | **Code auto-exports from Supabase** |

## What Code Should Own
1. **Snapshot form** — user punches in HRV, RHR, sleep, energy, pill day, soreness → saves to Supabase
2. **Readiness computation** — deterministic scoring from snapshot data, not Claude guessing
3. **IVG query** — "SELECT days this week with no session logged" — binary, no interpretation
4. **Session log form** — exercise results go through the app, not Claude's memory
5. **OVG validation** — code checks: working weights match latest logged? dates correct? all fields present?
6. **Auto-export** — Supabase → JSON files on disk, triggered after every write

## What Claude Should Own
1. **Session planning** — reasoning about what to train today based on readiness, history, goals, soreness
2. **Justification** — explaining why this session, citing research
3. **Coaching conversation** — tone, motivation, disagreement handling, ED-aware check-ins
4. **Pattern detection** — retrospective analysis across sessions
5. **Progression decisions** — when to bump weight, when to hold, when to deload

## Priority Zero: Session Type Lookup
Two Claudes in the same repo gave different session types for the same day (one said "Run + Core", the other correctly said "Strength Full Body + Core"). This is the most dangerous failure — wrong session type cascades into wrong everything.

**Fix:** Code returns session type from weekly template. Not Claude.
```
GET /api/session-type?date=2026-03-26
→ { "day": "Thursday", "type": "strength_full_body + core", "with_bf": true }
```
Claude receives this as input. Cannot override it.

## Build Order (TBD)
0. **Session type lookup** — code returns today's session type from weekly template (HIGHEST PRIORITY)
1. Supabase schema updates (snapshot table, readiness table if needed)
2. Readiness computation endpoint/function
3. IVG + OVG as API routes or edge functions
4. Snapshot form in web app
5. Session log form improvements (already partially built)
6. Auto-export script

## Status
- [ ] Planning — this doc
- [ ] Schema design
- [ ] Implementation
- [ ] Testing
- [ ] Migration of existing data
