import type { SectionCardProps } from "./SectionCard.types";

const SectionCard = ({
  title,
  subtitle,
  header,
  footer,
  padding = "default",
  className = "",
  children,
  ...props
}: SectionCardProps) => {
  const bodyPaddingClass = padding === "none" ? "" : "p-6";

  return (
    <div
      className={`bg-card rounded-3xl border border-border shadow-sm flex flex-col ${className}`.trim()}
      {...props}
    >
      {/* Optional Header */}
      {header !== undefined
        ? header
        : title !== undefined
          ? (
              <div className="px-6 py-4 border-b border-border">
                <h2 className="font-sans text-xl font-bold text-card-foreground">
                  {title}
                </h2>
                {subtitle !== undefined ? (
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {subtitle}
                  </p>
                ) : null}
              </div>
            )
          : null}

      {/* Body (children provided by parent) */}
      <div className={bodyPaddingClass}>
        {children}
      </div>

      {/* Optional Footer */}
      {footer !== undefined ? (
        <div className="px-6 py-4 border-t border-border bg-muted/30">
          {footer}
        </div>
      ) : null}
    </div>
  );
};

export default SectionCard;
