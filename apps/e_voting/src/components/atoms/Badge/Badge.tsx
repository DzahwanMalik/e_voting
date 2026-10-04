import type { BadgeProps, BadgeVariant } from "./Badge.types";

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-muted text-muted-foreground border border-border",
  success: "bg-success-subtle text-success-subtle-foreground",
  warning: "bg-warning-subtle text-warning-subtle-foreground",
  pending: "bg-pending-subtle text-pending-subtle-foreground",
  info: "bg-info-subtle text-info-subtle-foreground",
  secondary: "bg-secondary text-secondary-foreground",
};

const Badge = ({
  children,
  variant = "default",
  icon,
  className = "",
  ...props
}: BadgeProps) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide whitespace-nowrap ${
        variantClasses[variant]
      } ${className}`.trim()}
      {...props}
    >
      {icon && <span className="inline-flex items-center">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
