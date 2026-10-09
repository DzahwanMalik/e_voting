import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/atoms/Button";
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
  const menuRef = useRef<HTMLDivElement>(null);

  const handleTriggerClick = () => {
    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = (onClick?: () => void) => {
    onClick?.();
    setIsOpen(false);
  };

  useLayoutEffect(() => {
    if (!isOpen) return;

    const trigger = containerRef.current?.querySelector("button");
    const menu = menuRef.current;
    if (!trigger || !menu) return;

    const triggerRect = trigger.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();

    const spaceBelow = window.innerHeight - triggerRect.bottom;

    const top =
      spaceBelow < menuRect.height
        ? triggerRect.top - menuRect.height - OFFSET + window.scrollY
        : triggerRect.bottom + OFFSET + window.scrollY;

    const triggerRight = triggerRect.right + window.scrollX;
    const triggerLeft = triggerRect.left + window.scrollX;
    const triggerCenter = triggerLeft + triggerRect.width / 2;

    const left =
      align === "end"
        ? triggerRight - menuRect.width
        : align === "start"
          ? triggerLeft
          : triggerCenter - menuRect.width / 2;

    setPosition({ top, left });
  }, [isOpen, align]);

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

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className={`relative inline-block ${className}`.trim()}
      {...props}
    >
      <Button
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
          ref={menuRef}
          role="menu"
          aria-orientation="vertical"
          className="fixed z-40 min-w-44 bg-card border border-border rounded-xl shadow-lg overflow-hidden"
          style={{ top: `${position.top}px`, left: `${position.left}px` }}
        >
          {options.map((option) => {
            const isDisabled = option.disabled ?? false;
            return (
              <button
                key={option.label}
                role="menuitem"
                disabled={isDisabled}
                onClick={() => handleOptionClick(option.onClick)}
                className={`flex items-center gap-2.5 w-full px-3.5 py-2 text-sm ${
                  isDisabled
                    ? "text-muted-foreground cursor-not-allowed"
                    : option.isDestructive
                      ? "text-destructive hover:bg-destructive/10 cursor-pointer"
                      : "hover:bg-accent cursor-pointer"
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
