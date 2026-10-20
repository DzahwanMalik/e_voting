import type { StatCardProps, StatCardVariant } from "./StatCard.types";

const variantClasses: Record<StatCardVariant, string> = {
  secondary:
    "bg-secondary/30 border-secondary/50 text-secondary-foreground",
  info: "bg-info-subtle/30 border-info-subtle/50 text-info-subtle-foreground",
  warning:
    "bg-warning-subtle/30 border-warning-subtle/50 text-warning-subtle-foreground",
  success:
    "bg-success-subtle/30 border-success-subtle/50 text-success-subtle-foreground",
};

const StatCard = ({
  icon,
  label,
  value,
  variant = "secondary",
}: StatCardProps) => {
  const classes = variantClasses[variant];

  return (
    <div
      className={`rounded-2xl border p-4 text-center ${classes}`}
    >
      <div className="flex items-center justify-center gap-1.5 text-sm font-semibold mb-1 uppercase tracking-wider">
        {icon}
        <span>{label}</span>
      </div>
      <p className="font-sans text-3xl font-bold">{value}</p>
    </div>
  );
};

export default StatCard;
