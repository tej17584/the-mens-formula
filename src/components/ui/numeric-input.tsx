import * as React from "react";
import { Input } from "@/components/ui/input";

function blurOnWheel(event: React.WheelEvent<HTMLInputElement>) {
  event.currentTarget.blur();
}

type NumericInputBaseProps = Omit<
  React.ComponentProps<"input">,
  "type" | "inputMode"
> & {
  /** Whole numbers only (e.g. stock). Default is decimal prices. */
  integer?: boolean;
};

/** Plain `<input>` for dashboard forms that use native field styling. */
export function NumericField({
  integer = false,
  onWheel,
  ...props
}: NumericInputBaseProps) {
  return (
    <input
      type="text"
      inputMode={integer ? "numeric" : "decimal"}
      autoComplete="off"
      onWheel={(event) => {
        blurOnWheel(event);
        onWheel?.(event);
      }}
      {...props}
    />
  );
}

/** shadcn-styled numeric field (filters, etc.). */
export function NumericInput({
  integer = false,
  onWheel,
  ...props
}: NumericInputBaseProps & React.ComponentProps<typeof Input>) {
  return (
    <Input
      type="text"
      inputMode={integer ? "numeric" : "decimal"}
      autoComplete="off"
      onWheel={(event) => {
        blurOnWheel(event);
        onWheel?.(event);
      }}
      {...props}
    />
  );
}
