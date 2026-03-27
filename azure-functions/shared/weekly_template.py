"""
Weekly template — the ONLY source of truth for session types.
Deterministic. No interpretation. No Claude override.
"""

WEEKLY_TEMPLATE = {
    0: {  # Monday
        "type": "strength",
        "focus": "Lower body + core",
        "location": "home_gym",
        "with_bf": False,
        "morning": "elliptical_warmup",
    },
    1: {  # Tuesday
        "type": "strength",
        "focus": "Upper body + accessories",
        "location": "home_gym",  # default, can be planet_fitness
        "with_bf": False,
        "morning": "elliptical_warmup",
        "priority_note": "If at PF: lat pulldown and cable work FIRST",
    },
    2: {  # Wednesday
        "type": "active_recovery",
        "focus": "Light session with bf + elliptical or walk",
        "location": "home_gym",
        "with_bf": True,
        "morning": "run_or_elliptical_optional",
    },
    3: {  # Thursday
        "type": "strength",
        "focus": "Full body + core",
        "location": "home_gym",
        "with_bf": True,
        "morning": "elliptical_warmup",
    },
    4: {  # Friday
        "type": "cardio",
        "focus": "Run or elliptical — mood-based",
        "location": "home_gym",
        "with_bf": True,
        "morning": "run_or_elliptical",
    },
    5: {  # Saturday
        "type": "rest_or_light_cardio",
        "focus": "Run, elliptical, walk, or full rest — your call",
        "location": "home_gym",
        "with_bf": False,
    },
    6: {  # Sunday
        "type": "rest",
        "focus": "Full rest or walk",
        "location": None,
        "with_bf": False,
    },
}

DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]


def get_session_type(date) -> dict:
    """Return the session type for a given date. Deterministic."""
    weekday = date.weekday()  # 0=Mon, 6=Sun
    template = WEEKLY_TEMPLATE[weekday].copy()
    template["day_name"] = DAY_NAMES[weekday]
    template["date"] = date.isoformat()
    return template
