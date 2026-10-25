import type { ReactNode } from "react";
import type { BadgeVariant } from "@/lib/types";

export function Badge({
  variant,
  children,
  className,
}: {
  variant: BadgeVariant;
  children: ReactNode;
  className?: string;
}) {
  const classes = ["badge", `badge-${variant}`, className]
    .filter(Boolean)
    .join(" ");
  return <span className={classes}>{children}</span>;
}
