import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type Variant = "default" | "primary" | "sand" | "hibiscus" | "outline" | "muted";

const VARIANTS: Record<Variant, string> = {
  default: "bg-neutral-100 text-neutral-800",
  primary: "bg-primary-100 text-primary-800",
  sand: "bg-sand text-charcoal",
  hibiscus: "bg-hibiscus text-white",
  outline: "border border-border bg-white text-charcoal",
  muted: "bg-muted/60 text-charcoal/80",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium leading-none whitespace-nowrap",
        VARIANTS[variant],
        className,
      )}
      {...props}
    />
  );
}
