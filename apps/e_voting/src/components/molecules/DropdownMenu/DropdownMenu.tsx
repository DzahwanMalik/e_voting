import {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import { MoreHorizontal } from "lucide-react";
import Button from "@/components/atoms/Button";
import type { DropdownMenuProps } from "./DropdownMenu.types";

const OFFSET = 8;

const DropdownMenu = ({
  options,
  triggerIcon,
  triggerLabel = "Options",
  align = "end",
  className = "",
  ...props
}: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleTriggerClick = () => {
    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = (onClick?: () => void) => {
    onClick?.();
    setIsOpen(false);
  };

  // Anchor the panel to the trigger using viewport-relative coordinates.
  // `position: fixed` lets the panel escape overflow clipping from ancestors
  // such as DataTable's `overflow-x-auto`; re-running this on scroll/resize
  // keeps the panel glued to the trigger while it is open.
  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    const panel = panelRef.current;
    if (!trigger || !panel) return;

    const triggerRect = trigger.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();

    // Vertical: prefer below, flip above when space is insufficient.
    const spaceBelow = window.innerHeight - triggerRect.bottom;
    const top =
      spaceBelow < panelRect.height
        ? triggerRect.top - panelRect.height - OFFSET
        : triggerRect.bottom + OFFSET;

    // Horizontal: honour the `align` prop against the trigger rect.
    let left: number;
    if (align === "start") {
      left = triggerRect.left;
    } else if (align === "center") {
      left = triggerRect.left + triggerRect.width / 2 - panelRect.width / 2;
    } else {
      // "end"
      left = triggerRect.right - panelRect.width;
    }

    setPosition({ top, left });
  }, [align]);

  // Run synchronously on open so the panel is already placed before paint.
  useLayoutEffect(() => {
    if (!isOpen) return;
    updatePosition();
  }, [isOpen, updatePosition]);

  // Click-outside + Escape-to-close + scroll/resize tracking
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    // Reposition on scroll/resize so the panel tracks the trigger even when
    // the page or a nested scrollable container (e.g. DataTable) scrolls.
    // `scroll` does not bubble, so we listen in the capture phase to also
    // catch scroll events fired on ancestor containers. `requestAnimationFrame`
    // throttles to one re-position per frame.
    let raf: number | undefined;
    const handleScrollResize = () => {
      if (raf !== undefined) cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(() => updatePosition());
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("scroll", handleScrollResize, true);
    window.addEventListener("resize", handleScrollResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("scroll", handleScrollResize, true);
      window.removeEventListener("resize", handleScrollResize);
      if (raf !== undefined) cancelAnimationFrame(raf);
    };
  }, [isOpen, updatePosition]);

  return (
    <div
      ref={containerRef}
      className={`relative inline-block text-left ${className}`.trim()}
      {...props}
    >
      <Button
        ref={triggerRef}
        variant="ghost"
        size="sm"
        onClick={handleTriggerClick}
        aria-label={triggerLabel}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {triggerIcon ?? <MoreHorizontal className="w-4 h-4" />}
      </Button>

      {isOpen && (
        <div
          ref={panelRef}
          role="menu"
          aria-orientation="vertical"
          className="fixed z-50 min-w-44 bg-card border border-border rounded-xl shadow-lg py-1 overflow-hidden"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          {options.map((option) => {
            const isDisabled = option.disabled ?? false;
            return (
              <button
                key={option.label}
                role="menuitem"
                disabled={isDisabled}
                onClick={() => handleOptionClick(option.onClick)}
                className={`flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-left transition-colors ${
                  isDisabled
                    ? "text-muted-foreground cursor-not-allowed"
                    : option.isDestructive
                      ? "text-destructive hover:bg-destructive/10 cursor-pointer"
                      : "text-foreground hover:bg-accent cursor-pointer"
                }`}
              >
                {option.icon}
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const DropdownMenuSeparator = () => {
  return <div className="border-t border-border my-1" role="separator" />;
};

export default DropdownMenu;
export { DropdownMenuSeparator };
