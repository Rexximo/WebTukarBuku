"use client";

import * as Select from "@radix-ui/react-select";
import { FieldShell, type FieldExtras } from "@/components/field-shell";

export interface SelectFieldProps extends FieldExtras {
  options: { value: string; label: string }[];
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
}

export function RadixSelectField({
  id,
  label,
  hint,
  optional,
  span,
  fieldClass,
  options,
  placeholder,
  ...selectProps
}: SelectFieldProps) {
  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      optional={optional}
      span={span}
      fieldClass={fieldClass}
    >
      <Select.Root {...selectProps}>
        <Select.Trigger id={id} className="control select-trigger" aria-label={label}>
          <Select.Value placeholder={placeholder ?? "Pilih opsi"} />
          <Select.Icon className="select-chevron" aria-hidden="true">
            <svg viewBox="0 0 20 20" fill="none">
              <path d="m5.5 7.5 4.5 4 4.5-4" />
            </svg>
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            className="select-content"
            position="popper"
            sideOffset={6}
            collisionPadding={8}
          >
            <Select.ScrollUpButton className="select-scroll-button" aria-hidden="true">
              <svg viewBox="0 0 20 20" fill="none">
                <path d="m5.5 12.5 4.5-4 4.5 4" />
              </svg>
            </Select.ScrollUpButton>
            <Select.Viewport className="select-viewport">
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  className="select-item"
                  value={option.value}
                >
                  <Select.ItemText>{option.label}</Select.ItemText>
                  <Select.ItemIndicator className="select-item-indicator">
                    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                      <path d="m4.5 10 3.5 3.5 7.5-7" />
                    </svg>
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
            <Select.ScrollDownButton className="select-scroll-button" aria-hidden="true">
              <svg viewBox="0 0 20 20" fill="none">
                <path d="m5.5 7.5 4.5 4 4.5-4" />
              </svg>
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </FieldShell>
  );
}
