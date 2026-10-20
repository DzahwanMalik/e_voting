import type { TabProps } from "./Tab.types";

const Tab = ({
  ref,
  children,
  isActive = false,
  count,
  icon,
  className = "",
  type = "button",
  ...props
}: TabProps) => {
  return (
    <button
      ref={ref}
      type={type}
      aria-pressed={isActive}
      className={`inline-flex items-center justify-center gap-2 h-9 px-3.5 rounded-full border text-xs font-medium whitespace-nowrap shrink-0 transition-all duration-150 select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
        isActive
          ? "bg-primary text-primary-foreground border-primary shadow-xs"
          : "bg-muted text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground"
      } ${className}`.trim()}
      {...props}
    >
      {icon && <span className="inline-flex items-center">{icon}</span>}
      <span>{children}</span>
      {typeof count === "number" && (
        <span
          className={`inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[10px] font-semibold leading-none ${
            isActive
              ? "bg-primary-foreground/20 text-primary-foreground"
              : "bg-card text-muted-foreground border border-border"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};

export default Tab;
