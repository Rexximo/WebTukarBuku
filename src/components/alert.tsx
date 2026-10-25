import type { ReactNode } from "react";

type AlertVariant = "info" | "warning" | "success" | "danger";

const icons: Record<AlertVariant, string> = {
  info: "ⓘ",
  warning: "!",
  success: "✓",
  danger: "!",
};

export function Alert({
  variant = "info",
  children,
  className,
}: {
  variant?: AlertVariant;
  children: ReactNode;
  className?: string;
}) {
  const classes = ["alert", `alert-${variant}`, className]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={classes}>
      <span aria-hidden="true">{icons[variant]}</span>
      <span>{children}</span>
    </div>
  );
}
