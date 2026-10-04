import { forwardRef } from "react";
import type { LabelProps } from "./Label.types";

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  (
    {
      children,
      required = false,
      optional = false,
      className = "",
      ...props
    },
    ref,
  ) => {
    return (
      <label
        ref={ref}
        className={`block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 select-none ${className}`.trim()}
        {...props}
      >
        {children}
        {required && <span className="ml-1 text-destructive">*</span>}
        {optional && !required && (
          <span className="ml-1.5 text-[11px] font-normal lowercase tracking-normal text-muted-foreground opacity-80">
            (optional)
          </span>
        )}
      </label>
    );
  },
);

Label.displayName = "Label";
