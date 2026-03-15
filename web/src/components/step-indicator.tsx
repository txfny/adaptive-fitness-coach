"use client";

import { FaceProfile, Lotus, FlexArm, Heart, Check } from "./line-art";

export type StepStatus = "done" | "active" | "locked";

interface Step {
  number: number;
  label: string;
  description: string;
  emoji?: string;
  status: StepStatus;
  href?: string;
  result?: string;
}

interface StepIndicatorProps {
  steps: Step[];
  onStepClick?: (step: Step) => void;
}

const stepIcons = [FaceProfile, Lotus, FlexArm, Heart];

export function StepIndicator({ steps, onStepClick }: StepIndicatorProps) {
  return (
    <div className="space-y-2.5">
      {steps.map((step, idx) => {
        const isClickable = step.status !== "locked" && step.href;
        const IconComponent = stepIcons[idx];

        return (
          <button
            key={step.number}
            onClick={() => isClickable && onStepClick?.(step)}
            disabled={step.status === "locked"}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 card-soft ${
              step.status === "done"
                ? "bg-white/80 border-sage/20"
                : step.status === "active"
                ? "bg-white border-sage/25 shadow-[0_0_0_1px_rgba(123,174,127,0.08)]"
                : "bg-cream-200/40 border-cream-300/40"
            } ${isClickable ? "cursor-pointer" : "cursor-default"}`}
          >
            {/* Step icon */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                step.status === "done"
                  ? "bg-sage/10"
                  : step.status === "active"
                  ? "bg-sage/8"
                  : "bg-cream-300/40"
              }`}
            >
              {step.status === "done" ? (
                <Check size={20} color="#7BAE7F" />
              ) : (
                <IconComponent
                  size={22}
                  color={step.status === "active" ? "#C08B6F" : "#B8A892"}
                />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 text-left min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${
                  step.status === "done"
                    ? "text-cream-700"
                    : step.status === "active"
                    ? "text-cream-900"
                    : "text-cream-500"
                }`}>
                  {step.label}
                </span>
                {step.status === "active" && (
                  <span className="text-[10px] font-medium text-sage-dark bg-sage/10 px-2 py-0.5 rounded-full">
                    up next
                  </span>
                )}
              </div>
              <p className={`text-xs mt-0.5 font-light ${
                step.status === "locked" ? "text-cream-400" : "text-cream-600"
              }`}>
                {step.result || step.description}
              </p>
            </div>

            {/* Arrow */}
            {isClickable && (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-cream-400 flex-shrink-0">
                <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}
