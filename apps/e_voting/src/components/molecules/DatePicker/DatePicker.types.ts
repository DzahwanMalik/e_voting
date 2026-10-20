import type { HTMLAttributes } from "react";

interface DatePickerProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "onChange" | "onBlur" | "defaultValue"
  > {
  id?: string;
  name?: string;
  value?: string | null;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  isInvalid?: boolean;
}

export type { DatePickerProps };
