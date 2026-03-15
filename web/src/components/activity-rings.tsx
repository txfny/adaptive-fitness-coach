"use client";

/**
 * Apple Watch–style activity rings.
 * Three concentric rings: Move (train), Track (log), Recover (snapshot).
 * Research: circular progress indicators increase completion rates
 * via the Zeigarnik effect (people remember incomplete tasks).
 */

interface Ring {
  label: string;
  progress: number; // 0-1
  color: string;
  bgColor: string;
}

interface ActivityRingsProps {
  rings: Ring[];
  size?: number;
}

export function ActivityRings({ rings, size = 140 }: ActivityRingsProps) {
  const center = size / 2;
  const strokeWidth = size * 0.075;
  const gap = strokeWidth + 4;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {rings.map((ring, i) => {
          const radius = center - strokeWidth / 2 - i * gap;
          const circumference = 2 * Math.PI * radius;
          const dashOffset = circumference * (1 - ring.progress);

          return (
            <g key={ring.label}>
              {/* Background track */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={ring.bgColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
              {/* Progress arc */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={ring.color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                className="transition-all duration-1000 ease-out"
              />
            </g>
          );
        })}
      </svg>
      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-semibold text-cream-900">
          {Math.round(rings.reduce((sum, r) => sum + r.progress, 0) / rings.length * 100)}%
        </span>
        <span className="text-[10px] text-cream-500 font-light">today</span>
      </div>
    </div>
  );
}

export function ActivityRingsLegend({ rings }: { rings: Ring[] }) {
  return (
    <div className="space-y-2">
      {rings.map((ring) => (
        <div key={ring.label} className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ring.color }} />
          <div className="flex-1 flex items-center justify-between">
            <span className="text-xs text-cream-700 font-light">{ring.label}</span>
            <span className="text-xs font-mono text-cream-800">{Math.round(ring.progress * 100)}%</span>
          </div>
        </div>
      ))}
    </div>
  );
}
