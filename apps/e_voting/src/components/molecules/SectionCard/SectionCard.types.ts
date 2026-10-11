import type { HTMLAttributes, ReactNode } from "react";

type SectionCardPadding = "default" | "none";

interface SectionCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Optional header title text. Ignored if `header` prop is provided. */
  title?: ReactNode;
  /** Optional header subtitle text. Ignored if `header` prop is provided. */
  subtitle?: ReactNode;
  /** Custom header content. Takes precedence over `title`/`subtitle`. */
  header?: ReactNode;
  /** Optional footer content (e.g., action buttons). */
  footer?: ReactNode;
  /** Body padding variant. `default` = p-6, `none` = no padding. */
  padding?: SectionCardPadding;
}

export type { SectionCardProps, SectionCardPadding };
