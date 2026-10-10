import type { HTMLAttributes, ReactNode } from "react";

type ModalSize =
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl"
  | "full";

interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  size?: ModalSize;
  showCloseButton?: boolean;
  closeButtonDisabled?: boolean;
  closeOnEscape?: boolean;
  closeOnBackdropClick?: boolean;
  children: ReactNode;
}

export type { ModalProps, ModalSize };
