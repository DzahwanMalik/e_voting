import type { Request, Response, NextFunction } from "express";
import { isAppError } from "../utils/app-error";

const isMulterError = (error: unknown): error is Error & { code?: string } => {
  return (
    error instanceof Error &&
    typeof (error as { code?: string }).code === "string" &&
    (error as { code?: string }).code?.startsWith("LIMIT_") === true
  );
};

const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  if (isMulterError(error)) {
    const code = error.code ?? "";

    if (code === "LIMIT_FILE_SIZE") {
      res.status(400).json({
        message: "Ukuran file melebihi batas maksimum 5 MB.",
      });
      return;
    }

    if (code === "LIMIT_FILE_COUNT") {
      res.status(400).json({
        message: "Jumlah file melebihi batas maksimum yang diperbolehkan.",
      });
      return;
    }

    if (code === "LIMIT_UNEXPECTED_FILE") {
      res.status(400).json({
        message: "File yang dikirimkan tidak valid.",
      });
      return;
    }

    res.status(400).json({
      message: "Terjadi kesalahan saat mengunggah file.",
    });
    return;
  }

  if (isAppError(error)) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  console.error("Unhandled error:", error);
  res.status(500).json({ message: "Terjadi kesalahan pada server." });
};

export { errorHandler };