import type { CheckboxProps } from "./Checkbox.types";

const Checkbox = ({
  ref,
  label,
  className = "",
  ...props
}: CheckboxProps) => {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer">
      <input
        ref={ref}
        type="checkbox"
        className={`w-4 h-4 rounded border cursor-pointer transition-colors
          focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
          ${className}`.trim()}
        {...props}
      />
      {label != null && (
        <span className="font-sans text-sm text-foreground">{label}</span>
      )}
    </label>
  );
};

export default Checkbox;
