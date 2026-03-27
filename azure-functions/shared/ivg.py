"""
Input Validation Gate — checks data completeness before starting a new session.
Queries Supabase for gaps in the current week.
"""

from datetime import date, timedelta
from .supabase_client import get_client
from .weekly_template import DAY_NAMES


def get_week_start(d: date) -> date:
    """Return Monday of the week containing date d."""
    return d - timedelta(days=d.weekday())


def run_ivg(target_date: date) -> dict:
    """
    Check all days from Monday to (target_date - 1) for data gaps.
    Returns: { status: "clear" | "gaps_found", gaps: [...], summary: str }
    """
    client = get_client()
    week_start = get_week_start(target_date)

    # Get all sessions for this week from Supabase
    week_end = target_date - timedelta(days=1)  # don't check today
    if week_end < week_start:
        return {"status": "clear", "gaps": [], "summary": "First day of the week — no prior days to check."}

    # Query logs table for this week
    result = client.table("logs").select("created_at, session_type, overall_rpe").gte(
        "created_at", week_start.isoformat()
    ).lte(
        "created_at", week_end.isoformat() + "T23:59:59"
    ).execute()

    logged_dates = set()
    for row in result.data:
        log_date = row["created_at"][:10]  # extract YYYY-MM-DD
        logged_dates.add(log_date)

    # Check each day from week_start to week_end
    gaps = []
    current = week_start
    while current <= week_end:
        day_str = current.isoformat()
        weekday = current.weekday()
        day_name = DAY_NAMES[weekday]

        if day_str not in logged_dates:
            gaps.append({
                "date": day_str,
                "day": day_name,
                "issue": "no_session_logged",
            })

        current += timedelta(days=1)

    if gaps:
        gap_days = ", ".join(f"{g['day']} {g['date']}" for g in gaps)
        return {
            "status": "gaps_found",
            "gaps": gaps,
            "summary": f"Missing session data for: {gap_days}. Resolve before proceeding.",
        }

    return {"status": "clear", "gaps": [], "summary": "All prior days this week have logged sessions."}
