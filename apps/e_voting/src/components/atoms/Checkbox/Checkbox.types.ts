import type {
  InputHTMLAttributes,
  ReactNode,
  Ref,
} from "react";

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "children"> {
  ref?: Ref<HTMLInputElement>;
  label?: ReactNode;
}

export type { CheckboxProps };
