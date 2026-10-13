import type { HTMLAttributes } from "react";

interface SelectOption<T = string | number> {
  label: string;
  value: T;
  disabled?: boolean;
}

interface SelectProps<T = string | number>
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: SelectOption<T>[];
  value?: T | null;
  onChange?: (value: T | null) => void;
  placeholder?: string;
  disabled?: boolean;
  isInvalid?: boolean;
}

export type { SelectOption, SelectProps };
