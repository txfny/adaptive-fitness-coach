import { SessionPlan } from "@/lib/types";
import { ExerciseTable } from "./exercise-table";

const tierColors: Record<string, string> = {
  HIGH: "text-emerald-400",
  MODERATE: "text-amber-400",
  LOW: "text-red-400",
};

export function SessionCard({ plan }: { plan: SessionPlan }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-zinc-100 font-semibold">
              {plan.session_type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </h3>
            <p className="text-zinc-500 text-xs mt-0.5">
              {plan.date} · {plan.location === "planet_fitness" ? "Planet Fitness" : "Home Gym"}
              {plan.week_number && ` · Week ${plan.week_number}`}
              {plan.is_deload && " · DELOAD"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-bold ${tierColors[plan.readiness_score]}`}>
              {plan.readiness_score}
            </span>
            <span className="text-zinc-500 text-xs">
              ~{plan.estimated_duration_minutes} min
            </span>
          </div>
        </div>

        {/* Focus cue */}
        <p className="text-zinc-300 text-sm mt-3 italic">
          {plan.focus_cue}
        </p>
      </div>

      {/* Warm-up */}
      {plan.warmup && (
        <div className="px-5 py-3 border-b border-zinc-800/50 bg-zinc-900/50">
          <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Warm-up</p>
          <p className="text-zinc-400 text-sm">{plan.warmup}</p>
        </div>
      )}

      {/* Exercises */}
      <div className="px-5 py-4">
        <ExerciseTable exercises={plan.exercises} />
      </div>

      {/* Footer notes */}
      <div className="px-5 py-3 border-t border-zinc-800/50 space-y-2">
        {plan.progression_note && (
          <div>
            <p className="text-zinc-500 text-xs uppercase tracking-wider">Progression</p>
            <p className="text-zinc-400 text-sm">{plan.progression_note}</p>
          </div>
        )}
        {plan.soreness_adjustments && (
          <div>
            <p className="text-zinc-500 text-xs uppercase tracking-wider">Soreness Adjustments</p>
            <p className="text-zinc-400 text-sm">{plan.soreness_adjustments}</p>
          </div>
        )}
        {plan.nutrition_note && (
          <div>
            <p className="text-zinc-500 text-xs uppercase tracking-wider">Nutrition</p>
            <p className="text-zinc-400 text-sm">{plan.nutrition_note}</p>
          </div>
        )}
      </div>
    </div>
  );
}
