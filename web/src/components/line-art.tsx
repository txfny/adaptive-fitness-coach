/**
 * Continuous single-stroke line art SVGs.
 * All drawings use a single <path> with no fill — just one unbroken line.
 */

interface LineArtProps {
  size?: number;
  className?: string;
  color?: string;
}

const defaults = {
  size: 24,
  color: "currentColor",
};

/** Minimalist woman's face profile — single continuous stroke */
export function FaceProfile({ size = defaults.size, color = defaults.color, className }: LineArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <path
        d="M16 38c0-2 2-4 4-5 1-.5 2-1.5 2-3 0-1-1-2-1.5-3-.5-1.5 0-3 .5-4 1-2 3-3 5-3s4 1 5 3c.5 1 1 2.5.5 4-.5 1-1.5 2-1.5 3 0 1.5 1 2.5 2 3 2 1 4 3 4 5M20 20c-1-2-1-4 0-6 1.5-3 4-5 7-5 2 0 3.5.5 5 2 1 1 2 2.5 2 4.5 0 1.5-.5 3-1 4"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Lotus flower — single continuous stroke */
export function Lotus({ size = defaults.size, color = defaults.color, className }: LineArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <path
        d="M24 36c0-4-2-8-5-11-2-2-4-3-6-3 1 3 2 6 4 9 2 2 4 4 7 5zm0 0c0-4 2-8 5-11 2-2 4-3 6-3-1 3-2 6-4 9-2 2-4 4-7 5zm0 0c0-6 0-12-3-17M24 36c0-6 0-12 3-17M15 28c-2-4-2-9 0-13M33 28c2-4 2-9 0-13"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Flexing arm — single continuous stroke */
export function FlexArm({ size = defaults.size, color = defaults.color, className }: LineArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <path
        d="M12 34c2-1 3-3 4-5 1-3 1-5 0-7-1-3-1-5 1-7 1-1 3-2 5-2 2 0 3 1 4 2 2 2 3 5 2 8 0 2-1 3-1 5 0 1 1 2 2 3 2 1 4 1 6 0M28 16c1-2 3-3 5-3 2 0 3 1 3 3s-1 4-3 5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Heart — single continuous stroke */
export function Heart({ size = defaults.size, color = defaults.color, className }: LineArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <path
        d="M24 38c-2-1-14-9-14-18 0-4 3-8 7-8 3 0 5 1.5 7 4 2-2.5 4-4 7-4 4 0 7 4 7 8 0 9-12 17-14 18z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Pulse / heartbeat line — single continuous stroke */
export function Pulse({ size = defaults.size, color = defaults.color, className }: LineArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <path
        d="M4 24h8l3-8 4 16 4-12 3 6 4-2h14"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Hand on chest — single continuous stroke */
export function HandOnHeart({ size = defaults.size, color = defaults.color, className }: LineArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <path
        d="M18 32c-1 1-2 3-2 5M20 32c3-1 6-4 7-7 0-1-1-2-2-2s-2 1-2 2c-1 2-3 4-5 5l-2 1M24 23c1-3 3-5 5-5 2 0 2 2 1 4M28 18c1-3 2-5 4-5 2 0 2 2 1 4M31 15c1-2 2-4 4-4 2 0 2 2 0 5-1 2-3 5-5 7-2 1-4 2-6 2"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Leaf / plant — single continuous stroke */
export function Leaf({ size = defaults.size, color = defaults.color, className }: LineArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <path
        d="M14 36c4-4 8-10 10-18 2 8 6 14 10 18M24 18c0 6 0 12 0 18M18 28c2-1 4-1 6 0 2 1 4 1 6 0"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Body silhouette — single continuous stroke */
export function Body({ size = defaults.size, color = defaults.color, className }: LineArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <path
        d="M24 6c2 0 4 2 4 4s-2 4-4 4-4-2-4-4 2-4 4-4zm0 8c-3 0-5 2-6 4-1 3-1 6 0 8 1 1 2 2 3 2v8c0 2 1 3 3 3s3-1 3-3v-8c1 0 2-1 3-2 1-2 1-5 0-8-1-2-3-4-6-4z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Small house — single continuous stroke */
export function House({ size = defaults.size, color = defaults.color, className }: LineArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <path
        d="M8 24l16-14 16 14M12 22v14h8v-8h8v8h8V22"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Pen / pencil — single continuous stroke */
export function Pen({ size = defaults.size, color = defaults.color, className }: LineArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <path
        d="M10 38l2-8L32 10c1-1 3-1 4 0l2 2c1 1 1 3 0 4L18 36l-8 2zm22-28l6 6M12 30l6 6"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Moon — single continuous stroke (for rest/recovery) */
export function Moon({ size = defaults.size, color = defaults.color, className }: LineArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <path
        d="M34 28c-8 0-14-6-14-14 0-2 .5-4 1-6C14 10 9 16 9 24c0 8 7 15 15 15 6 0 12-4 14-11-1 0-3 0-4 0z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Sparkle / star — single continuous stroke */
export function Sparkle({ size = defaults.size, color = defaults.color, className }: LineArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <path
        d="M24 6c0 8-2 12-6 14 4 2 6 6 6 14 0-8 2-12 6-14-4-2-6-6-6-14zM10 20c4 0 6 2 8 4-2 2-4 4-8 4 4 0 6 2 8 4-2-2-4-4-8-4M38 20c-4 0-6 2-8 4 2 2 4 4 8 4-4 0-6 2-8 4 2-2 4-4 8-4"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Water drop — single continuous stroke (for pill/hydration) */
export function Drop({ size = defaults.size, color = defaults.color, className }: LineArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <path
        d="M24 6c-4 8-12 14-12 22 0 7 5 12 12 12s12-5 12-12c0-8-8-14-12-22z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Checkmark — single continuous stroke */
export function Check({ size = defaults.size, color = defaults.color, className }: LineArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <path
        d="M10 26l8 8 20-20"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Target / bullseye — single continuous stroke */
export function Target({ size = defaults.size, color = defaults.color, className }: LineArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <path
        d="M24 8a16 16 0 1 1 0 32 16 16 0 0 1 0-32zm0 6a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm0 6a4 4 0 1 1 0 8 4 4 0 0 1 0-8z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
