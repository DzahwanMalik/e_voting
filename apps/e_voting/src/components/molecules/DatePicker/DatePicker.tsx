import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Input from "@/components/atoms/Input";
import { toDateInputValue } from "@/lib/utils";
import type { DatePickerProps } from "./DatePicker.types";

const OFFSET = 8;

const WEEKDAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const MONTH_LABELS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const MONTH_SHORT_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

type CalendarView = "days" | "months" | "years";

const pad = (value: number): string => String(value).padStart(2, "0");

const parseDateValue = (value?: string | null): Date | null => {
  const normalized = toDateInputValue(value);
  if (!normalized) return null;

  const [year, month, day] = normalized.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const toDateValue = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const formatDisplayValue = (date: Date): string =>
  new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

const DatePicker = ({
  id,
  name,
  value,
  onChange,
  onBlur,
  placeholder = "Pilih tanggal",
  disabled = false,
  isInvalid = false,
  className = "",
  ...props
}: DatePickerProps) => {
  const selectedDate = parseDateValue(value);
  const today = new Date();

  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<CalendarView>("days");
  const [viewYear, setViewYear] = useState(
    selectedDate?.getFullYear() ?? today.getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(
    selectedDate?.getMonth() ?? today.getMonth(),
  );
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    onBlur?.();
  }, [onBlur]);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    const popover = popoverRef.current;
    if (!trigger || !popover) return;

    const triggerRect = trigger.getBoundingClientRect();
    const popoverRect = popover.getBoundingClientRect();

    const spaceBelow = window.innerHeight - triggerRect.bottom;
    const top =
      spaceBelow < popoverRect.height + OFFSET
        ? Math.max(OFFSET, triggerRect.top - popoverRect.height - OFFSET)
        : triggerRect.bottom + OFFSET;

    const left = Math.max(
      OFFSET,
      Math.min(
        triggerRect.left,
        window.innerWidth - popoverRect.width - OFFSET,
      ),
    );

    setPosition({ top, left });
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) return;
    updatePosition();
  }, [isOpen, view, updatePosition]);

  // Click-outside + Escape-to-close + scroll/resize tracking.
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        close();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

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
  }, [isOpen, close, updatePosition]);

  const handleTriggerClick = () => {
    if (disabled) return;

    if (isOpen) {
      close();
      return;
    }

    // Sync the visible calendar with the selected value when opening.
    const base = parseDateValue(value) ?? new Date();
    setViewYear(base.getFullYear());
    setViewMonth(base.getMonth());
    setView("days");
    setIsOpen(true);
  };

  const handlePrev = () => {
    if (view === "years") {
      setViewYear((year) => year - 12);
      return;
    }

    if (view === "months") {
      setViewYear((year) => year - 1);
      return;
    }

    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((year) => year - 1);
    } else {
      setViewMonth((month) => month - 1);
    }
  };

  const handleNext = () => {
    if (view === "years") {
      setViewYear((year) => year + 12);
      return;
    }

    if (view === "months") {
      setViewYear((year) => year + 1);
      return;
    }

    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((year) => year + 1);
    } else {
      setViewMonth((month) => month + 1);
    }
  };

  const handleHeaderClick = () => {
    if (view === "days") {
      setView("months");
      return;
    }

    if (view === "months") {
      setView("years");
      return;
    }

    setView("days");
  };

  const handleDaySelect = (day: number) => {
    onChange?.(toDateValue(new Date(viewYear, viewMonth, day)));
    close();
  };

  const handleMonthSelect = (month: number) => {
    setViewMonth(month);
    setView("days");
  };

  const handleYearSelect = (year: number) => {
    setViewYear(year);
    setView("months");
  };

  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const dayCells: Array<number | null> = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  while (dayCells.length < 42) {
    dayCells.push(null);
  }

  const isSelectedDay = (day: number): boolean =>
    selectedDate !== null &&
    selectedDate.getFullYear() === viewYear &&
    selectedDate.getMonth() === viewMonth &&
    selectedDate.getDate() === day;

  const isToday = (day: number): boolean =>
    today.getFullYear() === viewYear &&
    today.getMonth() === viewMonth &&
    today.getDate() === day;

  const startYear = Math.floor(viewYear / 12) * 12;
  const years = Array.from({ length: 12 }, (_, index) => startYear + index);

  const headerLabel =
    view === "years"
      ? `${startYear} - ${startYear + 11}`
      : view === "months"
        ? String(viewYear)
        : `${MONTH_LABELS[viewMonth]} ${viewYear}`;

  const displayValue = selectedDate ? formatDisplayValue(selectedDate) : "";

  return (
    <div
      ref={containerRef}
      className={`relative inline-block w-full ${className}`.trim()}
      {...props}
    >
      <Input
        ref={triggerRef}
        id={id}
        name={name}
        type="text"
        readOnly
        value={displayValue}
        placeholder={placeholder}
        disabled={disabled}
        isInvalid={isInvalid}
        onClick={handleTriggerClick}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-invalid={isInvalid}
        leftElement={<CalendarDays className="w-4 h-4" />}
        rightElement={
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        }
        className={disabled ? "" : "cursor-pointer"}
      />

      {isOpen && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-label="Pilih tanggal"
          className="fixed z-50 w-80 bg-card border border-border rounded-xl shadow-lg p-3"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          {/* Header: month/year navigation */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Sebelumnya"
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleHeaderClick}
              className="px-2 py-1 rounded-lg text-sm font-semibold text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {headerLabel}
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Berikutnya"
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Days view */}
          {view === "days" && (
            <div className="grid grid-cols-7 gap-1">
              {WEEKDAY_LABELS.map((label) => (
                <span
                  key={label}
                  className="flex h-8 items-center justify-center text-xs font-medium text-muted-foreground"
                >
                  {label}
                </span>
              ))}

              {dayCells.map((day, index) =>
                day === null ? (
                  <span key={`empty-${index}`} className="h-9" />
                ) : (
                  <button
                    key={`${viewYear}-${viewMonth}-${day}`}
                    type="button"
                    onClick={() => handleDaySelect(day)}
                    aria-current={isSelectedDay(day) ? "date" : undefined}
                    className={`flex h-9 w-full items-center justify-center rounded-lg text-sm transition-colors ${
                      isSelectedDay(day)
                        ? "bg-primary text-primary-foreground font-semibold hover:bg-primary-hover"
                        : isToday(day)
                          ? "border border-primary text-primary hover:bg-accent"
                          : "text-foreground hover:bg-accent"
                    }`}
                  >
                    {day}
                  </button>
                ),
              )}
            </div>
          )}

          {/* Months view */}
          {view === "months" && (
            <div className="grid grid-cols-3 gap-2">
              {MONTH_SHORT_LABELS.map((label, index) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleMonthSelect(index)}
                  aria-pressed={index === viewMonth}
                  className={`h-10 rounded-lg text-sm transition-colors ${
                    index === viewMonth
                      ? "bg-primary text-primary-foreground font-semibold hover:bg-primary-hover"
                      : "text-foreground hover:bg-accent"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Years view */}
          {view === "years" && (
            <div className="grid grid-cols-3 gap-2">
              {years.map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => handleYearSelect(year)}
                  aria-pressed={year === viewYear}
                  className={`h-10 rounded-lg text-sm transition-colors ${
                    year === viewYear
                      ? "bg-primary text-primary-foreground font-semibold hover:bg-primary-hover"
                      : "text-foreground hover:bg-accent"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DatePicker;
