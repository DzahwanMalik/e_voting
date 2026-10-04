import type { LabelProps } from "./Label.types";

const Label = ({
  ref,
  children,
  required = false,
  optional = false,
  className = "",
  ...props
}: LabelProps) => {
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
};

export default Label;
