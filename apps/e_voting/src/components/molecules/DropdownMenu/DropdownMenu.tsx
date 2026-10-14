import { useState, useEffect, useRef } from "react";
import { MoreHorizontal } from "lucide-react";
import Button from "@/components/atoms/Button";
import type { DropdownMenuProps } from "./DropdownMenu.types";

const DropdownMenu = ({
  options,
  triggerIcon,
  triggerLabel = "Options",
  align = "end",
  className = "",
  ...props
}: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTriggerClick = () => {
    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = (onClick?: () => void) => {
    onClick?.();
    setIsOpen(false);
  };

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

  const alignClass =
    align === "end"
      ? "right-0"
      : align === "start"
        ? "left-0"
        : "left-1/2 -translate-x-1/2";

  return (
    <div
      ref={containerRef}
      className={`relative inline-block text-left ${className}`.trim()}
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
          role="menu"
          aria-orientation="vertical"
          className={`absolute ${alignClass} top-full mt-1.5 z-50 min-w-44 bg-card border border-border rounded-xl shadow-lg py-1 overflow-hidden`}
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
