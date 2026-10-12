import type { InputHTMLAttributes, Ref } from "react";

interface FileUploadProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onChange?: (file: File | null) => void;
  accept?: string;
  disabled?: boolean;
  placeholder?: string;
  inputRef?: Ref<HTMLInputElement>;
}

export type { FileUploadProps };
