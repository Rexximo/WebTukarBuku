import type { ReactNode } from "react";

export interface FieldExtras {
  id: string;
  label: string;
  hint?: string;
  optional?: boolean;
  span?: boolean;
  fieldClass?: string;
}

export function FieldShell({
  id,
  label,
  hint,
  optional,
  span,
  fieldClass,
  children,
}: FieldExtras & { children: ReactNode }) {
  const classes = ["field", span ? "field-span" : null, fieldClass]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <label htmlFor={id}>
        {label}
        {optional ? <small> (opsional)</small> : null}
      </label>
      {children}
      {hint ? <span className="field-hint">{hint}</span> : null}
    </div>
  );
}
