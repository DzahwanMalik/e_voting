import { AlertCircle } from "lucide-react";
import { Label } from "@/components/atoms/Label";
import type { FormFieldProps } from "./FormField.types";

const FormField = ({
  id,
  label,
  required = false,
  optional = false,
  error,
  hint,
  className = "",
  children,
}: FormFieldProps) => {
  return (
    <div className={`flex flex-col w-full ${className}`.trim()}>
      <Label htmlFor={id} required={required} optional={optional}>
        {label}
      </Label>
      {children}
      {error ? (
        <p
          id={`${id}-error`}
          className="flex items-center gap-1.5 mt-1.5 text-xs font-medium text-destructive transition-all"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : hint ? (
        <p
          id={`${id}-hint`}
          className="mt-1.5 text-xs text-muted-foreground"
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
};

export default FormField;
