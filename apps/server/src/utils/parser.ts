const parsePositiveInt = (
  value: string | string[] | undefined,
): number | null => {
  if (!value) return null;
  const str = Array.isArray(value) ? value[0] : value;
  if (!str) return null;
  const parsed = Number(str);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
};

export { parsePositiveInt };
