import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import type { ButtonProps, ButtonVariant, ButtonSize } from "./Button.types";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm active:scale-[0.99]",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-accent active:scale-[0.99]",
  outline:
    "border border-border text-foreground bg-transparent hover:bg-accent active:scale-[0.99]",
  ghost:
    "text-foreground hover:bg-accent active:scale-[0.99]",
  destructive:
    "bg-destructive text-destructive-foreground hover:opacity-90 active:scale-[0.99]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-xs gap-1.5",
  md: "h-11 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = "",
      variant = "primary",
      size = "md",
      isLoading = false,
      icon,
      fullWidth = false,
      disabled,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={`inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
          variantClasses[variant]
        } ${sizeClasses[size]} ${
          fullWidth ? "w-full" : ""
        } ${
          isDisabled ? "opacity-60 cursor-not-allowed hover:bg-auto active:scale-100" : ""
        } ${className}`.trim()}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          icon
        )}
        <span>{children}</span>
      </button>
    );
  },
);

Button.displayName = "Button";
