import type { Request } from "express";
import multer from "multer";
import { AppError } from "../utils/app-error";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB per file

const ALLOWED_MIME_TYPES: readonly string[] = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
): void => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
    return;
  }
  cb(
    new AppError(
      "Hanya file gambar (jpeg, png, gif, webp) yang diperbolehkan.",
      400,
    ),
  );
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter,
});

const uploadCandidatePhotos = upload.fields([
  { name: "candidatePhoto", maxCount: 1 },
  { name: "vicePhoto", maxCount: 1 },
  { name: "pairPhoto", maxCount: 1 },
]);

const EXCEL_MIME_TYPES: readonly string[] = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "text/csv",
  "application/csv",
];

const excelFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
): void => {
  if (EXCEL_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
    return;
  }
  cb(
    new AppError(
      "Hanya file Excel (.xlsx, .xls) atau CSV (.csv) yang diperbolehkan.",
      400,
    ),
  );
};

const uploadExcel = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: excelFileFilter,
});

const uploadExcelFile = uploadExcel.single("file");

export { uploadCandidatePhotos, uploadExcelFile };
