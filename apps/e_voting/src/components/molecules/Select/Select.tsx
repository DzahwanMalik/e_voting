import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { ChevronDown } from "lucide-react";
import type { SelectProps } from "./Select.types";

const OFFSET = 8;

const Select = <T,>({
  options,
  value,
  onChange,
  placeholder = "Pilih...",
  disabled = false,
  isInvalid = false,
  className = "",
  ...props
}: SelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
    width: number;
  }>({ top: 0, left: 0, width: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption?.label ?? placeholder;

  const handleTriggerClick = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  };

  const handleOptionClick = (optionValue: T) => {
    onChange?.(optionValue);
    setIsOpen(false);
  };

  // Position the dropdown relative to the trigger (mirrors DropdownMenu pattern)
  useLayoutEffect(() => {
    if (!isOpen) return;

    const trigger = triggerRef.current;
    const listbox = listboxRef.current;
    if (!trigger || !listbox) return;

    const triggerRect = trigger.getBoundingClientRect();
    const listboxRect = listbox.getBoundingClientRect();

    const spaceBelow = window.innerHeight - triggerRect.bottom;

    const top =
      spaceBelow < listboxRect.height
        ? triggerRect.top - listboxRect.height - OFFSET + window.scrollY
        : triggerRect.bottom + OFFSET + window.scrollY;

    setPosition({
      top,
      left: triggerRect.left + window.scrollX,
      width: triggerRect.width,
    });
  }, [isOpen]);

  // Click-outside + Escape-to-close
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
      className={`relative inline-block w-full ${className}`.trim()}
      {...props}
    >
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={handleTriggerClick}
        className={`inline-flex w-full items-center justify-between h-11 px-3.5 text-sm rounded-xl transition-all duration-150 border bg-card text-foreground placeholder:text-muted-foreground ${
          isInvalid
            ? "border-destructive text-destructive focus:outline-none focus:ring-2 focus:ring-destructive focus:border-destructive"
            : "border-input hover:border-border-hover focus:border-primary focus:ring-primary focus:outline-none focus:ring-2 focus:ring-opacity-20"
        } ${disabled ? "bg-muted cursor-not-allowed opacity-70" : ""}`}
      >
        <span
          className={`truncate ${
            !selectedOption ? "text-muted-foreground" : ""
          }`}
        >
          {displayLabel}
        </span>
        <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
      </button>

      {isOpen && (
        <div
          ref={listboxRef}
          role="listbox"
          aria-orientation="vertical"
          className="fixed z-40 w-auto min-w-60 max-h-60 bg-card border border-border rounded-xl shadow-lg overflow-y-auto"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            width: `${position.width}px`,
          }}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={String(option.value)}
                type="button"
                role="option"
                disabled={option.disabled}
                aria-selected={isSelected}
                onClick={() =>
                  !option.disabled && handleOptionClick(option.value)
                }
                className={`flex items-center w-full px-3.5 py-2 text-sm text-left truncate ${
                  option.disabled
                    ? "text-muted-foreground cursor-not-allowed opacity-50"
                    : isSelected
                      ? "bg-primary/10 text-primary font-medium hover:bg-primary/15"
                      : "text-foreground hover:bg-accent"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Select;
