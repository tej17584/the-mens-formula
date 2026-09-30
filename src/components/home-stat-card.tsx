import type { ReactNode } from "react";

type Variant = "products" | "brands" | "volume";

function StatArt({ variant }: { variant: Variant }) {
  if (variant === "products") {
    return (
      <svg
        className="home-stat-card-art"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="62"
          y="18"
          width="44"
          height="44"
          rx="10"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.35"
        />
        <rect
          x="42"
          y="38"
          width="44"
          height="44"
          rx="10"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.55"
        />
        <rect
          x="22"
          y="58"
          width="44"
          height="44"
          rx="10"
          fill="currentColor"
          opacity="0.12"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M34 78h20M34 70h14"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
    );
  }
  if (variant === "brands") {
    return (
      <svg
        className="home-stat-card-art"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="78" cy="42" r="28" stroke="currentColor" strokeWidth="2" opacity="0.3" />
        <circle cx="58" cy="58" r="28" stroke="currentColor" strokeWidth="2" opacity="0.45" />
        <circle
          cx="38"
          cy="74"
          r="28"
          fill="currentColor"
          opacity="0.1"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M48 74c6-8 14-12 22-12s16 4 22 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.55"
        />
      </svg>
    );
  }
  return (
    <svg
      className="home-stat-card-art"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24 88V52h16v36M52 88V40h16v48M80 88V28h16v60"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.35"
      />
      <path
        d="M20 92h80"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.25"
      />
      <rect
        x="70"
        y="14"
        width="36"
        height="22"
        rx="6"
        fill="currentColor"
        opacity="0.14"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M78 25h20M78 20h12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
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
