"""
Coach Pipeline — the deterministic backbone.

This is the full pipeline that runs before Claude does any reasoning.
It gathers data, computes readiness, validates gaps, and returns a
structured context object that Claude uses to build the session.

Claude's job: take this context and generate the session plan + justification.
This code's job: everything else.
"""

import json
from datetime import date, datetime
import sys
import os

# Add parent dir to path for shared imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from shared.weekly_template import get_session_type
from shared.readiness import compute_readiness
from shared.ivg import run_ivg
from shared.ovg import run_ovg
from shared.working_weights import get_working_weights
from shared.save_session import save_snapshot, save_session_log


def run_pre_session(target_date: date, snapshot: dict) -> dict:
    """
    Run the full pre-session pipeline. Returns structured context for Claude.

    Steps:
    1. Session type lookup (deterministic)
    2. Readiness computation (deterministic)
    3. IVG check (deterministic)
    4. Working weights fetch (deterministic)

    Claude receives this output and builds the session plan from it.
    """
    # Step 1: What type of session is today?
    session_type = get_session_type(target_date)

    # Step 2: What's the readiness tier?
    readiness = compute_readiness(snapshot)

    # Step 3: Any gaps in this week's data?
    ivg = run_ivg(target_date)

    # Step 4: Current working weights
    weights = get_working_weights()

    return {
        "date": target_date.isoformat(),
        "session_type": session_type,
        "readiness": readiness,
        "ivg": ivg,
        "working_weights": weights,
        "snapshot": snapshot,
    }


def run_post_session(session_data: dict, target_date: date) -> dict:
    """
    Run the full post-session pipeline. Persists data and validates.

    Steps:
    1. Save session log to Supabase (deterministic)
    2. OVG validation (deterministic)
    """
    # Step 1: Save
    save_result = save_session_log(session_data)

    # Step 2: Validate
    weights = get_working_weights()
    ovg = run_ovg(session_data, target_date, weights.get("weights", {}))

    return {
        "save_result": save_result,
        "ovg": ovg,
    }


# --- CLI for local testing ---
if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"))

    today = date.today()

    # Example snapshot
    test_snapshot = {
        "hrv_ms": 52,
        "rhr_bpm": 51,
        "rhr_7day_avg": 53,
        "sleep_hours": 7,
        "energy": 6,
        "symptom_load": 1,
        "cycle_day": 26,
        "soreness": {"lower": 0, "upper": 0, "core": 0},
        "equipment": "home_gym",
    }

    print("=== PRE-SESSION PIPELINE ===")
    result = run_pre_session(today, test_snapshot)
    print(json.dumps(result, indent=2, default=str))
