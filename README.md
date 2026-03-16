# Coach — Adaptive Fitness PWA

A research-backed fitness coaching app that generates personalized training sessions based on your daily physiology, not a fixed program. Built as a Progressive Web App with a warm, minimal aesthetic designed specifically for young women.

![Coach App Banner](screenshots/banner-placeholder.png)

## Why This Exists

Most fitness apps treat everyone the same — fixed programs that ignore how you actually feel on any given day. Coach adapts to you. Every morning you check in with your biometrics (HRV, resting heart rate, sleep), subjective energy, symptoms, and soreness. The system runs that data through a deterministic rule engine and generates a session calibrated to your readiness — not yesterday's plan.

The design is grounded in **Self-Determination Theory** (autonomy, competence, relatedness) and behavior change research from JMIR, Frontiers in Psychology, and PMC. Every UI decision — from the forgiving streak system to the functional achievement badges — is intentional.

### Design Philosophy

- **Functional framing** — celebrates what your body *can do*, never appearance metrics
- **Forgiving streaks** — "3 of 7 this week" instead of fragile consecutive day counts
- **Warm, minimal aesthetic** — cream palette with sage green accents and single-stroke line art
- **Research-backed engagement** — activity rings, milestone badges, and motivational cues informed by academic studies on fitness app retention in young women

## Screenshots

| Home | Check-In | Session Plan | Post-Workout Log |
|------|----------|--------------|------------------|
| ![Home](screenshots/home-placeholder.png) | ![Check-In](screenshots/checkin-placeholder.png) | ![Session](screenshots/session-placeholder.png) | ![Log](screenshots/log-placeholder.png) |

| Progress | Readiness Result | Desktop Layout |
|----------|------------------|----------------|
| ![Progress](screenshots/progress-placeholder.png) | ![Readiness](screenshots/readiness-placeholder.png) | ![Desktop](screenshots/desktop-placeholder.png) |

## How It Works

### Daily Flow (4 Steps)

1. **Check In** — Enter morning biometrics (HRV, RHR, sleep), energy, mood, pill pack day, symptoms, and soreness
2. **Readiness Score** — The rule engine computes your readiness tier (HIGH / MODERATE / LOW) with explicit reasoning
3. **Your Session** — A concrete workout plan generated from readiness, equipment available, soreness map, and progression history
4. **Record Your Wins** — Log RPE, energy after, heart rate recovery, and whether the prediction matched reality

### The Feedback Loop

After each session, the system logs your actual performance against its prediction. Over time, this calibrates future sessions — if it consistently over- or under-estimates your capacity at a given readiness tier, it adjusts.

### What Gets Tracked

- **Biometrics**: HRV (ms), resting heart rate, heart rate recovery
- **Recovery signals**: sleep hours, subjective energy, mood
- **Hormonal context**: pill pack day and phase (active vs. placebo week)
- **Symptoms**: bloating, GI, pain, fatigue — summed into a symptom load score
- **Soreness**: lower body, upper body, core — affects exercise selection
- **Equipment**: home gym (dumbbell-focused) or Planet Fitness (cables + machines)

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 with React Compiler |
| Styling | Tailwind CSS v4 with custom cream/sage theme |
| Database | Supabase (PostgreSQL) with Row Level Security |
| Auth | PIN-based gate (server-verified, no full auth overhead) |
| Hosting | Vercel (auto-deploys from GitHub) |
| PWA | Service worker + manifest for install-to-homescreen |
| Icons | Custom single-stroke SVG line art (16 illustrations) |

## Architecture

### Rule Engine (5 Agents)

1. **Snapshot Agent** — Collects and validates daily inputs against `schemas/snapshot.json`
2. **Readiness Agent** — Scores readiness via `rules/readiness.yaml`, outputs tier + reasoning
3. **Cycle Phase Agent** — Maps pill pack day to phase, applies intensity ceilings
4. **Progression Agent** — Reads last 3 sessions, applies load/volume adjustments from `rules/progression.yaml`
5. **Plan Agent** — Synthesizes everything into a session plan, then collects the post-session log

### UI Components

- **Activity Rings** — Apple Watch-style SVG rings for Train / Track / Recover
- **Milestone Badges** — Functional achievements only (First Steps, Consistent, New PR, Recovery Pro, etc.)
- **Step Indicator** — Pipeline with line art icons showing your progress through the daily flow
- **Readiness Gauge** — Visual tier display with contextual icons and color coding
- **Responsive Layout** — Mobile-first with 2-column desktop grid and sidebar navigation

### Database Schema

```
snapshots    → daily check-ins (biometrics, symptoms, soreness, readiness results)
logs         → post-session data (RPE, HR recovery, prediction accuracy)
```

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project (free tier works)

### Setup

```bash
# Clone and install
git clone https://github.com/txfnys/adaptive-fitness-coach.git
cd adaptive-fitness-coach/web
npm install

# Configure environment
cp .env.local.example .env.local
# Fill in:
#   APP_PIN=<your 4-digit pin>
#   NEXT_PUBLIC_SUPABASE_URL=<your supabase url>
#   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your anon key>

# Set up database (run in Supabase SQL editor)
# → Copy contents of web/supabase-setup.sql

# Run locally
npm run dev
```

### Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel → set Root Directory to `web`
3. Add environment variables (APP_PIN, SUPABASE_URL, SUPABASE_ANON_KEY)
4. Deploy — auto-deploys on every push after that

## File Map

```
web/                    Next.js PWA
  src/app/              Pages (home, snapshot, session, log, progress, settings)
  src/components/       UI components (forms, gauges, rings, badges, nav)
  src/lib/              Rule engine, types, Supabase client
  public/               Manifest, icons, service worker
rules/                  Deterministic scoring rules (YAML)
schemas/                JSON Schema definitions
research/               Citation lookup table backing every rule
data/sessions/          Historical session logs
```

## Research References

Design decisions are informed by:

- Self-Determination Theory (Deci & Ryan) — autonomy, competence, relatedness in app engagement
- JMIR mHealth studies on fitness app retention factors for young women
- Behavior Change Technique taxonomy (Michie et al.) — goal setting, self-monitoring, feedback
- UXmatters 2024 — color psychology in health apps (sage green → 20% higher satisfaction)
- PMC research on streak systems and habit formation (forgiving > consecutive)

---

Built with Claude Code.
