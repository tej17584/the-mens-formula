import type { ReactNode } from "react";

type Variant = "products" | "brands" | "volume" | "shipping";

function StatArt({ variant }: { variant: Variant }) {
  if (variant === "products") {
    return (
      <svg
        className="home-stat-card-art"
        viewBox="0 0 128 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="20"
          y="32"
          width="52"
          height="52"
          rx="12"
          stroke="currentColor"
          strokeWidth="2.5"
          opacity="0.28"
        />
        <rect
          x="38"
          y="46"
          width="52"
          height="52"
          rx="12"
          stroke="currentColor"
          strokeWidth="2.5"
          opacity="0.5"
        />
        <rect
          x="56"
          y="60"
          width="52"
          height="52"
          rx="12"
          fill="currentColor"
          opacity="0.14"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <path
          d="M74 78h16M74 70h10M74 86h12"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.65"
        />
      </svg>
    );
  }
  if (variant === "brands") {
    return (
      <svg
        className="home-stat-card-art"
        viewBox="0 0 128 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M88 40a22 22 0 1 0-44 0 22 22 0 0 0 44 0Z"
          stroke="currentColor"
          strokeWidth="2.5"
          opacity="0.28"
        />
        <path
          d="M72 54a24 24 0 1 0-48 0 24 24 0 0 0 48 0Z"
          stroke="currentColor"
          strokeWidth="2.5"
          opacity="0.46"
        />
        <path
          d="M56 68a24 24 0 1 0-48 0 24 24 0 0 0 48 0Z"
          fill="currentColor"
          opacity="0.12"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <path
          d="M44 88c8-10 22-14 36-14s28 4 36 14"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.65"
        />
        <circle cx="80" cy="50" r="3" fill="currentColor" opacity="0.7" />
      </svg>
    );
  }
  if (variant === "shipping") {
    return (
      <svg
        className="home-stat-card-art home-stat-card-art--shipping"
        viewBox="0 0 128 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="16"
          y="48"
          width="58"
          height="34"
          rx="8"
          stroke="currentColor"
          strokeWidth="2.5"
          opacity="0.45"
        />
        <path
          d="M74 56h24l14 26H74V56Z"
          fill="currentColor"
          opacity="0.12"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <circle cx="38" cy="94" r="9" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="90" cy="94" r="9" stroke="currentColor" strokeWidth="2.5" />
        <path
          d="M18 94h20M82 94h22"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.4"
        />
        <rect
          x="52"
          y="24"
          width="56"
          height="18"
          rx="5"
          fill="currentColor"
          opacity="0.18"
        />
        <text
          x="80"
          y="37"
          textAnchor="middle"
          fill="currentColor"
          fontFamily="var(--font-display), sans-serif"
          fontSize="11"
          fontWeight="800"
          letterSpacing="0.22em"
        >
          FORZA
        </text>
      </svg>
    );
  }
  return (
    <svg
      className="home-stat-card-art"
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M28 92V54h14v38M54 92V42h14v50M80 92V30h14v62"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.35"
      />
      <path
        d="M22 96h84"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.28"
      />
      <rect
        x="72"
        y="20"
        width="40"
        height="24"
        rx="7"
        fill="currentColor"
        opacity="0.16"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path
        d="M80 28h24M80 34h14"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

export function HomeStatCard({
  variant,
  kicker,
  value,
  label,
  wide = false,
}: {
  variant: Variant;
  kicker: string;
  value: ReactNode;
  label: string;
  wide?: boolean;
}) {
  return (
    <article
      className={`home-stat-card home-stat-card--${variant}${wide ? " home-stat-card--wide" : ""}`}
    >
      <StatArt variant={variant} />
      <div className="home-stat-card-grid" aria-hidden="true" />
      <p className="home-stat-card-kicker">{kicker}</p>
      <div className="home-stat-card-value">{value}</div>
      <p className="home-stat-card-label">{label}</p>
    </article>
  );
}