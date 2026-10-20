import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Maximize2, X } from "lucide-react";
import type { ImagePreviewProps } from "./ImagePreview.types";

const ImagePreview = ({
  src,
  alt,
  caption,
  className = "",
  imageClassName = "",
  loading = "lazy",
  onError,
}: ImagePreviewProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const hasOpenedRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      hasOpenedRef.current = true;
      closeButtonRef.current?.focus();
      return;
    }

    if (!hasOpenedRef.current) return;
    hasOpenedRef.current = false;
    triggerRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== "Escape") return;
      // Prevent a parent Modal from closing at the same time as the lightbox.
      event.stopImmediatePropagation();
      setIsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isOpen]);

  const handleOpen = (): void => {
    setIsOpen(true);
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={(event) => {
          // A preview must not trigger parent actions (e.g. radio selection).
          event.stopPropagation();
          handleOpen();
        }}
        aria-label={`Lihat foto ${alt}`}
        className={`group relative block overflow-hidden cursor-zoom-in bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset ${className}`.trim()}
      >
        <img
          src={src}
          alt={alt}
          loading={loading}
          onError={onError}
          className={imageClassName}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center bg-foreground/0 text-transparent transition-colors group-hover:bg-foreground/40 group-hover:text-background group-focus-visible:bg-foreground/40 group-focus-visible:text-background"
        >
          <Maximize2 className="w-5 h-5" />
        </span>
      </button>

      {isOpen &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={caption ?? alt}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/80 p-4 backdrop-blur-sm animate-in fade-in duration-150 sm:p-8"
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Tutup pratinjau"
              className="absolute top-4 right-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground shadow-lg transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <X className="w-5 h-5" />
            </button>

            <figure
              onClick={(event) => event.stopPropagation()}
              className="flex max-h-full max-w-full flex-col items-center gap-3"
            >
              <img
                src={src}
                alt={alt}
                className="max-h-[85vh] max-w-[95vw] rounded-2xl object-contain shadow-2xl"
              />
              {caption && (
                <figcaption className="text-center text-sm font-medium text-background">
                  {caption}
                </figcaption>
              )}
            </figure>
          </div>,
          document.body,
        )}
    </>
  );
};

export default ImagePreview;
