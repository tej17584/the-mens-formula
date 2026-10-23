import { cn } from "cn";

type BrandLoaderProps = {
  className?: string;
  label?: string;
  size?: "sm" | "md" | "lg";
};

export function BrandLoader({
  className,
  label,
  size = "md",
}: BrandLoaderProps) {
  return (
    <span
      className={cn("brand-loader-inline", className)}
      role={label ? "status" : undefined}
    >
      <span
        aria-hidden={Boolean(label)}
        className={cn("brand-loader", `brand-loader-${size}`)}
      />
      {label ? <span className="brand-loader-label">{label}</span> : null}
    </span>
  );
}
