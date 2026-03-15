import { SessionPlan } from "@/lib/types";
import { ExerciseTable } from "./exercise-table";
import { Target, Sparkle, Leaf } from "./line-art";

const tierBadge: Record<string, string> = {
  HIGH: "bg-sage/10 text-sage-dark border-sage/20",
  MODERATE: "bg-amber-100/60 text-amber-700 border-amber-300/30",
  LOW: "bg-rose-soft/10 text-rose-soft border-rose-soft/20",
};

export function SessionCard({ plan }: { plan: SessionPlan }) {
  return (
    <div className="bg-white border border-cream-300/50 rounded-2xl overflow-hidden card-soft">
      {/* Header */}
      <div className="px-5 py-5 border-b border-cream-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-cream-900 font-semibold text-[15px]">
              {plan.session_type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </h3>
            <p className="text-cream-600 text-xs mt-1 font-light">
              {plan.date} · {plan.location === "planet_fitness" ? "Planet Fitness" : "Home Gym"}
              {plan.week_number && ` · Week ${plan.week_number}`}
              {plan.is_deload && " · DELOAD"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${tierBadge[plan.readiness_score]}`}>
              {plan.readiness_score}
            </span>
            <span className="text-cream-500 text-xs font-light">
              ~{plan.estimated_duration_minutes}m
            </span>
          </div>
        </div>

        {/* Focus */}
        <div className="mt-4 bg-sage/[0.04] border border-sage/10 rounded-xl p-3 flex gap-2.5 items-start">
          <Target size={16} color="#C08B6F" className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] text-cream-600 uppercase tracking-widest mb-1 font-medium">Focus cue</p>
            <p className="text-cream-800 text-[13px] italic font-light leading-relaxed">
              {plan.focus_cue}
            </p>
          </div>
        </div>
      </div>

      {/* Warm-up */}
      {plan.warmup && (
        <div className="px-5 py-3.5 border-b border-cream-200/60 bg-cream-100/50 flex gap-2.5 items-start">
          <Sparkle size={14} color="#C08B6F" className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-cream-600 text-[10px] uppercase tracking-widest mb-1 font-medium">Warm-up</p>
            <p className="text-cream-700 text-sm font-light">{plan.warmup}</p>
          </div>
        </div>
      )}

      {/* Exercises */}
      <div className="px-5 py-4">
        <ExerciseTable exercises={plan.exercises} />
      </div>

      {/* Notes */}
      <div className="px-5 py-4 border-t border-cream-200/60 space-y-4">
        {plan.progression_note && (
          <div>
            <p className="text-cream-600 text-[10px] uppercase tracking-widest font-medium">Progression</p>
            <p className="text-cream-700 text-sm font-light mt-1">{plan.progression_note}</p>
          </div>
        )}
        {plan.soreness_adjustments && (
          <div>
            <p className="text-cream-600 text-[10px] uppercase tracking-widest font-medium">Soreness Adjustments</p>
            <p className="text-cream-700 text-sm font-light mt-1">{plan.soreness_adjustments}</p>
          </div>
        )}
        {plan.nutrition_note && (
          <div className="bg-sage/[0.04] border border-sage/10 rounded-xl p-3 flex gap-2.5 items-start">
            <Leaf size={14} color="#7BAE7F" className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-cream-600 text-[10px] uppercase tracking-widest font-medium">Nutrition</p>
              <p className="text-cream-700 text-sm font-light mt-1">{plan.nutrition_note}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
