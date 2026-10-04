import type { InputHTMLAttributes, ReactNode, Ref } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?: Ref<HTMLInputElement>;
  isInvalid?: boolean;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
}

export type { InputProps };
