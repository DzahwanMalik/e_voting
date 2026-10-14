import type {
  Ref,
  TextareaHTMLAttributes,
} from "react";

interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  ref?: Ref<HTMLTextAreaElement>;
  /**
   * Visual validation state. When `true`, renders the destructive
   * token set (red border + destructive focus ring + destructive text).
   * Mirrors the `isInvalid` prop on the `Input` atom.
   */
  isInvalid?: boolean;
}

export type { TextareaProps };
