import { useEffect } from "react";
import { X } from "lucide-react";
import type { ModalProps, ModalSize } from "./Modal.types";

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
  full: "max-w-[95vw]",
};

const Modal = ({
  isOpen,
  onClose,
  title,
  size = "lg",
  showCloseButton = true,
  closeButtonDisabled = false,
  closeOnEscape = true,
  closeOnBackdropClick = true,
  className = "",
  children,
}: ModalProps) => {
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  if (!isOpen) return null;

  const backdropClick = closeOnBackdropClick ? { onClick: onClose } : {};

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-xs transition-opacity duration-200"
      {...backdropClick}
    >
      <div
        className={`relative bg-card w-full ${sizeClasses[size]} max-h-[90vh] rounded-3xl border border-border shadow-xl flex flex-col overflow-y-auto scrollbar-none animate-in fade-in zoom-in-95 duration-200 ${className}`.trim()}
        onClick={(e) => e.stopPropagation()}
      >
        {title ? (
          <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card shrink-0 sticky top-0 z-10">
            <div className="font-sans font-bold text-lg text-card-foreground">
              {title}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                disabled={closeButtonDisabled}
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground cursor-pointer hover:text-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        ) : (
          showCloseButton && (
            <div className="absolute top-4 right-4 z-10">
              <button
                type="button"
                onClick={onClose}
                disabled={closeButtonDisabled}
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground cursor-pointer hover:text-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
