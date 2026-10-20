const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Validates a file against `accept` MIME patterns / extensions and optional `maxSize`.
 * Returns an error message string if invalid, or `null` if valid.
 */
const validateFile = (
  file: File,
  accept?: string,
  maxSize?: number,
): string | null => {
  if (maxSize && file.size > maxSize) {
    return `File terlalu besar. Ukuran maksimum: ${formatBytes(maxSize)}.`;
  }

  if (accept) {
    const accepts = accept
      .split(",")
      .map((pattern) => pattern.trim())
      .filter(Boolean);
    let isValid = false;

    for (const pattern of accepts) {
      if (pattern.includes("/*")) {
        // Wildcard MIME, e.g. "image/*"
        const prefix = pattern.replace("/*", "");
        if (file.type.startsWith(prefix)) {
          isValid = true;
          break;
        }
      } else if (pattern.startsWith(".")) {
        // Extension, e.g. ".pdf"
        if (file.name.toLowerCase().endsWith(pattern.toLowerCase())) {
          isValid = true;
          break;
        }
      } else if (file.type === pattern) {
        // Exact MIME match, e.g. "image/jpeg"
        isValid = true;
        break;
      }
    }

    if (!isValid && accepts.length > 0) {
      return "Tipe file tidak didukung.";
    }
  }

  return null;
};

export { formatBytes, validateFile };
