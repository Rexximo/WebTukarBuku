"use client";

import { useState, type InputHTMLAttributes } from "react";
import { FieldShell, type FieldExtras } from "@/components/field-shell";

export function PasswordField({
  id,
  label,
  hint,
  optional,
  span,
  fieldClass,
  ...inputProps
}: FieldExtras & InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);
  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      optional={optional}
      span={span}
      fieldClass={fieldClass}
    >
      <div className="password-control">
        <input
          {...inputProps}
          id={id}
          className="control"
          type={visible ? "text" : "password"}
        />
        <button
          className="password-toggle"
          type="button"
          aria-label={visible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          aria-pressed={visible}
          onClick={() => setVisible(!visible)}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {visible ? (
              <>
                <path d="M3 3l18 18" />
                <path d="M10.6 10.6a2 2 0 002.8 2.8" />
                <path d="M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.3 4.2 9.3 6-.4.8-1.2 1.9-2.3 2.9" />
                <path d="M6.2 6.2C4 7.5 2.8 9.5 2.7 11c.6 1.1 3.9 6 9.3 6 1 0 2-.2 2.8-.5" />
              </>
            ) : (
              <>
                <path d="M2.7 12s3.3-6 9.3-6 9.3 6 9.3 6-3.3 6-9.3 6-9.3-6-9.3-6z" />
                <circle cx="12" cy="12" r="2.5" />
              </>
            )}
          </svg>
        </button>
      </div>
    </FieldShell>
  );
}
