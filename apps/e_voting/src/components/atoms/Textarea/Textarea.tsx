import type { TextareaProps } from "./Textarea.types";

/**
 * Maps the consumer-facing `rows` prop to a Tailwind arbitrary utility that
 * sets `min-block-size`. Under `field-sizing: content` the `rows` attribute is
 * ignored for sizing, so this minimum gives the empty field a sensible height
 * (roughly `rows` line boxes) while content-driven growth is handled entirely
 * by CSS.
 *
 * Static string literals are required so Tailwind's content scanner can extract
 * and generate the utilities at build time — runtime-computed values cannot be
 * statically analyzed.
 */
const MIN_BLOCK_SIZE_BY_ROWS: Record<number, string> = {
  1: "[min-block-size:1lh]",
  2: "[min-block-size:2lh]",
  3: "[min-block-size:3lh]",
  4: "[min-block-size:4lh]",
  5: "[min-block-size:5lh]",
  6: "[min-block-size:6lh]",
  7: "[min-block-size:7lh]",
  8: "[min-block-size:8lh]",
};

/**
 * Auto-expanding textarea atom — styled entirely with theme semantic tokens and
 * the native CSS `field-sizing: content` property. No JavaScript is used to
 * drive the height; the browser sizes the field to its content, so it expands
 * (and shrinks) as text is added/removed and is never scrollable for content
 * that fits.
 *
 * `ref` is forwarded as a plain React 19 prop (compatible with
 * `react-hook-form`'s `register()`). The `rows` attribute is retained purely as
 * a fallback height for browsers that do not yet support `field-sizing`.
 */
const Textarea = ({
  ref,
  className = "",
  isInvalid = false,
  disabled,
  rows = 4,
  ...props
}: TextareaProps) => {
  const minBlockSizeClass = MIN_BLOCK_SIZE_BY_ROWS[rows] ?? "[min-block-size:4lh]";

  const textareaClasses = `w-full bg-card text-foreground placeholder:text-muted-foreground text-sm rounded-xl transition-all duration-150 border px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-opacity-20 resize-none overflow-y-auto [field-sizing:content] ${minBlockSizeClass} ${
    isInvalid
      ? "border-destructive text-destructive focus:ring-destructive focus:border-destructive"
      : "border-input hover:border-border-hover focus:border-primary focus:ring-primary"
  } ${disabled ? "bg-muted cursor-not-allowed opacity-70" : ""} ${className}`.trim();

  return (
    <textarea
      ref={ref}
      disabled={disabled}
      rows={rows}
      className={textareaClasses}
      {...props}
    />
  );
};

export default Textarea;
