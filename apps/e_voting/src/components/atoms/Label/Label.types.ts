import type { LabelHTMLAttributes, Ref } from "react";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  ref?: Ref<HTMLLabelElement>;
  required?: boolean;
  optional?: boolean;
}

export type { LabelProps };
