import type { ReactNode } from "react";

export function EmptyState({
  icon = "⌕",
  title,
  description,
  children,
}: {
  icon?: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="card empty-state">
      <span className="empty-icon" aria-hidden="true">
        {icon}
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
    </section>
  );
}
