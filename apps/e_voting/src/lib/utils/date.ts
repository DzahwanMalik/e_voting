const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})/;

/**
 * Normalizes an API date value (ISO datetime or `YYYY-MM-DD`) into the
 * `YYYY-MM-DD` format required by date inputs. Returns an empty string for
 * missing or invalid values.
 */
const toDateInputValue = (value?: string | null): string => {
  if (!value) return "";

  const match = DATE_ONLY_PATTERN.exec(value);
  if (!match) return "";

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    return "";
  }

  return `${year}-${month}-${day}`;
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
};

export { formatDate, toDateInputValue };
