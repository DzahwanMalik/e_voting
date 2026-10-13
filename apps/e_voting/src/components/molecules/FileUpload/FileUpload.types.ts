import type { InputHTMLAttributes, Ref } from "react";

interface FileUploadProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "onError"> {
  onChange?: (file: File | null) => void;
  accept?: string;
  disabled?: boolean;
  placeholder?: string;
  inputRef?: Ref<HTMLInputElement>;
  /** Max file size in bytes. Files exceeding this are rejected. */
  maxSize?: number;
  /** Called when a file is rejected (type or size validation failure). */
  onError?: (error: string) => void;
}

export type { FileUploadProps };
