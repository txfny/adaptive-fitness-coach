"use client";

import { Check, FlexArm, Heart, Sparkle, Leaf, Lotus } from "./line-art";

/**
 * Milestone badges — tied to real functional achievements.
 * Research: badges boost 90-day retention to 24% (vs ~10-12% avg).
 * Only celebrate what the body CAN DO, never appearance metrics.
 */

interface Badge {
  id: string;
  label: string;
  description: string;
  icon: typeof FlexArm;
  earned: boolean;
  iconColor: string;
}

const badges: Badge[] = [
  {
    id: "first-session",
    label: "First Steps",
    description: "Completed your first session",
    icon: Leaf,
    earned: true,
    iconColor: "#A8C5A0",
  },
  {
    id: "week-consistent",
    label: "Consistent",
    description: "4 sessions in one week",
    icon: Sparkle,
    earned: true,
    iconColor: "#C08B6F",
  },
  {
    id: "first-pr",
    label: "New PR",
    description: "Set a personal record",
    icon: FlexArm,
    earned: true,
    iconColor: "#C4B5FD",
  },
  {
    id: "recovery-pro",
    label: "Recovery Pro",
    description: "HRV improved over baseline",
    icon: Heart,
    earned: false,
    iconColor: "#E8A0B4",
  },
  {
    id: "month-strong",
    label: "Month Strong",
    description: "Train 4 weeks straight",
    icon: Lotus,
    earned: false,
    iconColor: "#A8C5A0",
  },
  {
    id: "check-in-streak",
    label: "Self-Aware",
    description: "7-day check-in streak",
    icon: Check,
    earned: false,
    iconColor: "#C08B6F",
  },
];

export function MilestoneBadges() {
  const earned = badges.filter((b) => b.earned);
  const upcoming = badges.filter((b) => !b.earned);

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-medium text-cream-600 uppercase tracking-widest">Milestones</h3>

      {/* Earned */}
      <div className="flex gap-3 flex-wrap">
        {earned.map((badge) => (
          <div
            key={badge.id}
            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white border border-cream-300/50 card-soft min-w-[72px]"
          >
            <div className="w-9 h-9 rounded-full bg-cream-100 flex items-center justify-center">
              <badge.icon size={20} color={badge.iconColor} />
            </div>
            <span className="text-[10px] font-medium text-cream-800 text-center leading-tight">{badge.label}</span>
          </div>
        ))}
      </div>

      {/* Next up */}
      {upcoming.length > 0 && (
        <div>
          <p className="text-[10px] text-cream-500 font-light mb-2">Up next</p>
          <div className="space-y-1.5">
            {upcoming.slice(0, 2).map((badge) => (
              <div key={badge.id} className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-cream-200/40">
                <div className="w-6 h-6 rounded-full bg-cream-300/50 flex items-center justify-center opacity-50">
                  <badge.icon size={14} color={badge.iconColor} />
                </div>
                <div>
                  <span className="text-[11px] font-medium text-cream-600">{badge.label}</span>
                  <span className="text-[10px] text-cream-500 font-light ml-1.5">{badge.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
