"""
Readiness computation — deterministic scoring from snapshot data.
Implements rules/readiness.yaml exactly. No interpretation.
"""


# Cold start baselines (will be replaced by rolling averages after 14 days)
HRV_BASELINE_MEAN = 57.0
HRV_BASELINE_SD = 4.5
RHR_BASELINE_MEAN = 53.0


def compute_readiness(snapshot: dict) -> dict:
    """
    Compute readiness tier from snapshot data.
    Returns: { tier, signals, reasoning, volume_adjustment, rpe_cap }

    Conflict resolution: lowest signal wins.
    """
    signals = {}

    # --- HRV signal ---
    hrv = snapshot.get("hrv_ms")
    if hrv is not None:
        hrv_sd = (hrv - HRV_BASELINE_MEAN) / HRV_BASELINE_SD
        if hrv_sd < -1.5:
            signals["hrv"] = {"tier": "LOW", "value": hrv, "sd": round(hrv_sd, 1),
                              "reason": f"HRV {hrv}ms is {abs(round(hrv_sd, 1))} SD below baseline ({HRV_BASELINE_MEAN}ms)"}
        elif hrv_sd < -0.5:
            signals["hrv"] = {"tier": "MODERATE", "value": hrv, "sd": round(hrv_sd, 1),
                              "reason": f"HRV {hrv}ms is {abs(round(hrv_sd, 1))} SD below baseline"}
        else:
            signals["hrv"] = {"tier": "HIGH", "value": hrv, "sd": round(hrv_sd, 1),
                              "reason": f"HRV {hrv}ms is at/above baseline"}

    # --- RHR signal ---
    rhr = snapshot.get("rhr_bpm")
    rhr_avg = snapshot.get("rhr_7day_avg", RHR_BASELINE_MEAN)
    if rhr is not None:
        rhr_delta = rhr - rhr_avg
        if rhr_delta > 8:
            signals["rhr"] = {"tier": "LOW", "value": rhr, "delta": rhr_delta,
                              "reason": f"RHR {rhr} is +{rhr_delta} above 7-day avg ({rhr_avg})"}
        elif rhr_delta > 3:
            signals["rhr"] = {"tier": "MODERATE", "value": rhr, "delta": rhr_delta,
                              "reason": f"RHR {rhr} is +{rhr_delta} above 7-day avg"}
        else:
            signals["rhr"] = {"tier": "HIGH", "value": rhr, "delta": rhr_delta,
                              "reason": f"RHR {rhr} is within normal range (delta {rhr_delta:+d})"}

    # --- Sleep signal ---
    sleep = snapshot.get("sleep_hours")
    if sleep is not None:
        if sleep < 5:
            signals["sleep"] = {"tier": "LOW", "value": sleep,
                                "reason": f"Sleep {sleep}hrs — below 5hr threshold"}
        elif sleep <= 7:
            signals["sleep"] = {"tier": "MODERATE", "value": sleep,
                                "reason": f"Sleep {sleep}hrs — suboptimal (5-7hr range)"}
        else:
            signals["sleep"] = {"tier": "HIGH", "value": sleep,
                                "reason": f"Sleep {sleep}hrs — good"}

    # --- Symptom load signal ---
    symptom_load = snapshot.get("symptom_load", 0)
    if symptom_load >= 8:
        signals["symptoms"] = {"tier": "LOW", "value": symptom_load,
                                "reason": f"Symptom load {symptom_load}/12 — high"}
    elif symptom_load >= 4:
        signals["symptoms"] = {"tier": "MODERATE", "value": symptom_load,
                                "reason": f"Symptom load {symptom_load}/12 — moderate"}
    else:
        signals["symptoms"] = {"tier": "HIGH", "value": symptom_load,
                                "reason": f"Symptom load {symptom_load}/12 — low"}

    # --- Subjective energy override ---
    energy = snapshot.get("energy")
    if energy is not None and energy <= 3:
        signals["energy_override"] = {"tier": "MODERATE", "value": energy,
                                       "reason": f"Subjective energy {energy}/10 — downgrade if otherwise HIGH"}

    # --- Conflict resolution: lowest signal wins ---
    tier_rank = {"LOW": 0, "MODERATE": 1, "HIGH": 2}

    if not signals:
        return {"tier": "MODERATE", "signals": {}, "reasoning": "Insufficient data — defaulting to MODERATE",
                "volume_adjustment": "reduce 20-30%", "rpe_cap": 7}

    lowest_tier = min(signals.values(), key=lambda s: tier_rank[s["tier"]])["tier"]
    lowest_signal = [k for k, v in signals.items() if v["tier"] == lowest_tier]

    # Build output
    result = {
        "tier": lowest_tier,
        "signals": signals,
        "lowest_signal": lowest_signal,
        "reasoning": f"Tier {lowest_tier} — driven by: {', '.join(lowest_signal)}. Lowest signal wins.",
    }

    if lowest_tier == "LOW":
        result["volume_adjustment"] = "active recovery only"
        result["rpe_cap"] = None
        result["description"] = "Recovery only — walking, easy elliptical, no structured strength"
    elif lowest_tier == "MODERATE":
        result["volume_adjustment"] = "reduce 20-30%"
        result["rpe_cap"] = 7
        result["description"] = "Reduced volume, RPE cap 7, no PRs"
    else:  # HIGH
        result["volume_adjustment"] = "full programming"
        result["rpe_cap"] = 10
        result["description"] = "Full volume and intensity, progression attempts OK"

    return result
