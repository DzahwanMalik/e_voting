import { forwardRef } from "react";
import type { InputProps } from "./Input.types";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      isInvalid = false,
      leftElement,
      rightElement,
      disabled,
      ...props
    },
    ref,
  ) => {
    const hasElements = Boolean(leftElement || rightElement);

    const inputClasses = `w-full h-11 bg-card text-foreground placeholder:text-muted-foreground text-sm rounded-xl transition-all duration-150 border ${
      isInvalid
        ? "border-destructive text-destructive focus:ring-destructive focus:border-destructive"
        : "border-input hover:border-border-hover focus:border-primary focus:ring-primary"
    } focus:outline-none focus:ring-2 focus:ring-opacity-20 ${
      leftElement ? "pl-10" : "px-3.5"
    } ${rightElement ? "pr-10" : "px-3.5"} ${
      disabled ? "bg-muted cursor-not-allowed opacity-70" : ""
    } ${className}`.trim();

    if (!hasElements) {
      return (
        <input
          ref={ref}
          disabled={disabled}
          className={inputClasses}
          {...props}
        />
      );
    }

    return (
      <div className="relative flex items-center w-full">
        {leftElement && (
          <div className="absolute left-3.5 flex items-center justify-center text-muted-foreground pointer-events-none select-none">
            {leftElement}
          </div>
        )}
        <input
          ref={ref}
          disabled={disabled}
          className={inputClasses}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 flex items-center justify-center text-muted-foreground">
            {rightElement}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
