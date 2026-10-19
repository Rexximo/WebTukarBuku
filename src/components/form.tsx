import type {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { FieldShell, type FieldExtras } from "@/components/field-shell";
import { PasswordField } from "@/components/password-field";
import {
  RadixSelectField,
  type SelectFieldProps,
} from "@/components/radix-select-field";

export function TextField({
  id,
  label,
  hint,
  optional,
  span,
  fieldClass,
  ...inputProps
}: FieldExtras & InputHTMLAttributes<HTMLInputElement>) {
  if (inputProps.type === "password") {
    return (
      <PasswordField
        id={id}
        label={label}
        hint={hint}
        optional={optional}
        span={span}
        fieldClass={fieldClass}
        {...inputProps}
      />
    );
  }

  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      optional={optional}
      span={span}
      fieldClass={fieldClass}
    >
      <input id={id} className="control" {...inputProps} />
    </FieldShell>
  );
}

export function SelectField(props: SelectFieldProps) {
  return <RadixSelectField {...props} />;
}

export function TextAreaField({
  id,
  label,
  hint,
  optional,
  span,
  fieldClass,
  ...textAreaProps
}: FieldExtras & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      optional={optional}
      span={span}
      fieldClass={fieldClass}
    >
      <textarea id={id} className="control" {...textAreaProps} />
    </FieldShell>
  );
}

export function ReadonlyField({
  label,
  value,
  span,
}: {
  label: string;
  value: string;
  span?: boolean;
}) {
  return (
    <div className={span ? "field field-span" : "field"}>
      <span className="field-label">{label}</span>
      <div className="readonly-value">{value}</div>
    </div>
  );
}

export function CheckboxField({
  id,
  label,
  hint,
  span,
  ...checkboxProps
}: Omit<FieldExtras, "label"> & { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={span ? "field field-span" : "field"}>
      <label className="check-line" htmlFor={id}>
        <input id={id} type="checkbox" {...checkboxProps} />
        {label}
      </label>
      {hint ? <span className="field-hint">{hint}</span> : null}
    </div>
  );
}

export function UploadBoxField({
  id,
  title,
  description,
  accept = "image/png,image/jpeg,image/webp",
}: {
  id: string;
  title: string;
  description: string;
  accept?: string;
}) {
  return (
    <div className="field">
      <span className="field-label">
        Foto buku <small>(opsional)</small>
      </span>
      <label className="upload-box" htmlFor={id}>
        <strong>{title}</strong>
        <input id={id} name="photo" type="file" accept={accept} />
        <p>{description}</p>
      </label>
    </div>
  );
}
