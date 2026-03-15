import { Snapshot, ReadinessTier, ReadinessSignal, ReadinessResult, UserBaseline } from "./types";

const DEFAULT_BASELINE: UserBaseline = {
  hrv_mean: 57,
  hrv_sd: 4.5,
  rhr_7day_avg: 53,
  data_points: 7,
  last_updated: "2026-03-14",
};

function scoreHRV(hrv: number, baseline: UserBaseline): { tier: ReadinessTier; deviation: number } {
  const deviations = (hrv - baseline.hrv_mean) / baseline.hrv_sd;

  if (deviations < -1.5) return { tier: "LOW", deviation: deviations };
  if (deviations < -0.5) return { tier: "MODERATE", deviation: deviations };
  return { tier: "HIGH", deviation: deviations };
}

function scoreRHR(rhrDelta: number): ReadinessTier {
  if (rhrDelta > 8) return "LOW";
  if (rhrDelta >= 3) return "MODERATE";
  return "HIGH";
}

function scoreSleep(hours: number): ReadinessTier {
  if (hours < 5) return "LOW";
  if (hours <= 7) return "MODERATE";
  return "HIGH";
}

function scoreSymptoms(load: number): ReadinessTier | null {
  if (load >= 8) return "LOW";
  if (load >= 4) return "MODERATE";
  return null; // no impact
}

const TIER_ORDER: Record<ReadinessTier, number> = {
  LOW: 0,
  MODERATE: 1,
  HIGH: 2,
};

function lowestTier(...tiers: (ReadinessTier | null)[]): ReadinessTier {
  const valid = tiers.filter((t): t is ReadinessTier => t !== null);
  if (valid.length === 0) return "MODERATE";
  return valid.reduce((a, b) => (TIER_ORDER[a] <= TIER_ORDER[b] ? a : b));
}

export function computeReadiness(
  snapshot: Snapshot,
  baseline: UserBaseline = DEFAULT_BASELINE
): ReadinessResult {
  const reasoning: ReadinessSignal[] = [];

  // HRV
  const hrv = scoreHRV(snapshot.hrv_ms, baseline);
  reasoning.push({
    signal: "HRV",
    value: snapshot.hrv_ms,
    baseline: `${baseline.hrv_mean} ± ${baseline.hrv_sd}`,
    deviation: `${hrv.deviation >= 0 ? "+" : ""}${hrv.deviation.toFixed(1)} SD`,
    tier_assigned: hrv.tier,
  });

  // RHR delta
  const rhrDelta = snapshot.rhr_delta ?? (snapshot.rhr_7day_avg ? snapshot.rhr_bpm - snapshot.rhr_7day_avg : 0);
  const rhrTier = scoreRHR(rhrDelta);
  reasoning.push({
    signal: "RHR delta",
    value: rhrDelta,
    tier_assigned: rhrTier,
  });

  // Sleep
  const sleepTier = scoreSleep(snapshot.sleep_hours);
  reasoning.push({
    signal: "Sleep",
    value: snapshot.sleep_hours,
    tier_assigned: sleepTier,
  });

  // Symptoms
  const symptomLoad = snapshot.symptom_load ?? 0;
  const symptomTier = scoreSymptoms(symptomLoad);
  if (symptomTier) {
    reasoning.push({
      signal: "Symptoms",
      value: symptomLoad,
      tier_assigned: symptomTier,
    });
  }

  // Lowest signal wins
  let tier = lowestTier(hrv.tier, rhrTier, sleepTier, symptomTier);

  // Subjective energy override (can downgrade, never upgrade)
  if (snapshot.subjective_energy <= 3 && tier === "HIGH") {
    tier = "MODERATE";
    reasoning.push({
      signal: "Energy override",
      value: snapshot.subjective_energy,
      tier_assigned: "MODERATE",
    });
  }

  const summaries: Record<ReadinessTier, string> = {
    HIGH: "Full programming. Progression attempts on the table.",
    MODERATE: "Reduced volume. RPE cap at 7. No maximal efforts.",
    LOW: "Recovery only. Elliptical, walking, or rest.",
  };

  return {
    tier,
    reasoning,
    summary: summaries[tier],
  };
}

export function computeBaseline(hrvReadings: number[]): UserBaseline {
  if (hrvReadings.length === 0) return DEFAULT_BASELINE;

  const mean = hrvReadings.reduce((a, b) => a + b, 0) / hrvReadings.length;
  const variance = hrvReadings.reduce((sum, v) => sum + (v - mean) ** 2, 0) / hrvReadings.length;
  const sd = Math.sqrt(variance);

  return {
    hrv_mean: Math.round(mean * 10) / 10,
    hrv_sd: Math.round(sd * 10) / 10 || 4.5, // fallback if SD is 0
    rhr_7day_avg: 53, // TODO: compute from RHR readings
    data_points: hrvReadings.length,
    last_updated: new Date().toISOString().split("T")[0],
  };
}

export { DEFAULT_BASELINE };
