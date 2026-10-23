"use client";

import type { ReactNode } from "react";
import { BrandLoader } from "@/components/ui/brand-loader";
import { cn } from "cn";

export function RouteLoadingOverlay({ label }: { label: string }) {
  return (
    <div className="route-loading-overlay" aria-live="polite">
      <BrandLoader label={label} size="md" />
    </div>
  );
}

export function RouteLoadingRegion({
  pending,
  label,
  children,
  className,
}: {
  pending: boolean;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("route-loading-region", className)}
      data-pending={pending || undefined}
      aria-busy={pending || undefined}
    >
      {pending ? <RouteLoadingOverlay label={label} /> : null}
      {children}
    </div>
  );
}

export function PageLoadingState({ label }: { label: string }) {
  return (
    <div className="page-loading-state">
      <BrandLoader label={label} size="lg" />
    </div>
  );
}
