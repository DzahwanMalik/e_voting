import type { Request, Response } from "express";
import { isAppError } from "../utils/app-error";
import { parsePositiveInt } from "../utils/parser";
import * as candidatePairService from "../services/candidatePair.service";
import { uploadToCloudinary } from "../services/upload.service";

const processPhotoUploads = async (
  req: Request,
): Promise<{
  candidatePhotoUrl?: string | null;
  vicePhotoUrl?: string | null;
  pairPhotoUrl?: string | null;
}> => {
  const result: {
    candidatePhotoUrl?: string | null;
    vicePhotoUrl?: string | null;
    pairPhotoUrl?: string | null;
  } = {};

  const files = req.files;
  if (files && !Array.isArray(files)) {
    if (files.candidatePhoto?.[0]) {
      result.candidatePhotoUrl = await uploadToCloudinary(
        files.candidatePhoto[0].buffer,
      );
    } else if (req.body.candidatePhoto === "null") {
      result.candidatePhotoUrl = null;
    }

    if (files.vicePhoto?.[0]) {
      result.vicePhotoUrl = await uploadToCloudinary(
        files.vicePhoto[0].buffer,
      );
    } else if (req.body.vicePhoto === "null") {
      result.vicePhotoUrl = null;
    }

    if (files.pairPhoto?.[0]) {
      result.pairPhotoUrl = await uploadToCloudinary(
        files.pairPhoto[0].buffer,
      );
    } else if (req.body.pairPhoto === "null") {
      result.pairPhotoUrl = null;
    }
  }

  return result;
};

const createCandidatePair = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User belum terautentikasi." });
      return;
    }

    const electionId = parsePositiveInt(
      req.params.electionId ?? req.body.electionId,
    );

    if (!electionId) {
      res
        .status(400)
        .json({ message: "ID election tidak valid atau wajib diisi." });
      return;
    }

    const {
      candidateName,
      candidateDescription,
      candidateBirthday,
      viceName,
      viceDescription,
      viceBirthday,
      vision,
      mission,
    } = req.body;

    // Validate calon (main candidate)
    if (!candidateName || typeof candidateName !== "string") {
      res.status(400).json({ message: "Nama calon utama wajib diisi." });
      return;
    }

    if (
      !candidateBirthday ||
      typeof candidateBirthday !== "string" ||
      isNaN(Date.parse(candidateBirthday))
    ) {
      res.status(400).json({
        message:
          "Tanggal lahir calon utama wajib diisi dengan format tanggal yang valid.",
      });
      return;
    }

    // Validate wakil (vice candidate)
    if (!viceName || typeof viceName !== "string") {
      res.status(400).json({ message: "Nama wakil calon wajib diisi." });
      return;
    }

    if (
      !viceBirthday ||
      typeof viceBirthday !== "string" ||
      isNaN(Date.parse(viceBirthday))
    ) {
      res.status(400).json({
        message:
          "Tanggal lahir wakil calon wajib diisi dengan format tanggal yang valid.",
      });
      return;
    }

    // Validate shared vision/mission
    if (!vision || typeof vision !== "string") {
      res.status(400).json({ message: "Visi paslon wajib diisi." });
      return;
    }

    if (!mission || typeof mission !== "string") {
      res.status(400).json({ message: "Misi paslon wajib diisi." });
      return;
    }

    // Optional fields
    if (
      candidateDescription !== undefined &&
      candidateDescription !== null &&
      typeof candidateDescription !== "string"
    ) {
      res.status(400).json({
        message: "candidateDescription harus berupa string atau null.",
      });
      return;
    }

    if (
      viceDescription !== undefined &&
      viceDescription !== null &&
      typeof viceDescription !== "string"
    ) {
      res.status(400).json({
        message: "viceDescription harus berupa string atau null.",
      });
      return;
    }

    // Handle photo uploads via Multer + Cloudinary
    const photoUrls = await processPhotoUploads(req);

    const candidatePair = await candidatePairService.createCandidatePair(
      {
        electionId,
        candidateName,
        candidatePhotoUrl: photoUrls.candidatePhotoUrl,
        candidateDescription,
        candidateBirthday: new Date(candidateBirthday),
        viceName,
        vicePhotoUrl: photoUrls.vicePhotoUrl,
        viceDescription,
        viceBirthday: new Date(viceBirthday),
        pairPhotoUrl: photoUrls.pairPhotoUrl,
        vision,
        mission,
      },
      req.user.userId,
      req.user.role,
    );

    res.status(201).json({
      message: "Paslon kandidat berhasil dibuat.",
      candidatePair,
    });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Error creating candidate pair:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

const getCandidatePairs = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User belum terautentikasi." });
      return;
    }

    const electionId = parsePositiveInt(
      req.params.electionId ??
        (req.query.electionId as string | string[] | undefined),
    );

    if (electionId) {
      const candidatePairs =
        await candidatePairService.getCandidatePairsByElection(
          electionId,
          req.user.userId,
          req.user.role,
        );
      res.status(200).json({ candidatePairs });
      return;
    }

    const candidatePairs = await candidatePairService.getAllCandidatePairs(
      req.user.userId,
      req.user.role,
    );

    res.status(200).json({ candidatePairs });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Error fetching candidate pairs:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

const getCandidatePairById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User belum terautentikasi." });
      return;
    }

    const pairId = parsePositiveInt(req.params.id);
    if (!pairId) {
      res.status(400).json({ message: "ID paslon kandidat tidak valid." });
      return;
    }

    const electionId = parsePositiveInt(req.params.electionId);

    const candidatePair = await candidatePairService.getCandidatePairById(
      pairId,
      req.user.userId,
      req.user.role,
      electionId ?? undefined,
    );

    res.status(200).json({ candidatePair });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Error fetching candidate pair by ID:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

const updateCandidatePair = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User belum terautentikasi." });
      return;
    }

    const pairId = parsePositiveInt(req.params.id);
    if (!pairId) {
      res.status(400).json({ message: "ID paslon kandidat tidak valid." });
      return;
    }

    const electionId = parsePositiveInt(req.params.electionId);

    const {
      candidateName,
      candidateDescription,
      candidateBirthday,
      viceName,
      viceDescription,
      viceBirthday,
      vision,
      mission,
    } = req.body;

    // Handle photo uploads via Multer + Cloudinary
    const photoUrls = await processPhotoUploads(req);
    const { candidatePhotoUrl, vicePhotoUrl, pairPhotoUrl } = photoUrls;

    const hasAnyField =
      candidateName !== undefined ||
      candidatePhotoUrl !== undefined ||
      candidateDescription !== undefined ||
      candidateBirthday !== undefined ||
      viceName !== undefined ||
      vicePhotoUrl !== undefined ||
      viceDescription !== undefined ||
      viceBirthday !== undefined ||
      pairPhotoUrl !== undefined ||
      vision !== undefined ||
      mission !== undefined;

    if (!hasAnyField) {
      res.status(400).json({
        message:
          "Setidakatan satu field atau file foto harus disediakan untuk diperbarui.",
      });
      return;
    }

    if (
      candidateName !== undefined &&
      (typeof candidateName !== "string" || candidateName === "")
    ) {
      res.status(400).json({ message: "Nama calon utama tidak boleh kosong." });
      return;
    }

    if (
      viceName !== undefined &&
      (typeof viceName !== "string" || viceName === "")
    ) {
      res.status(400).json({ message: "Nama wakil calon tidak boleh kosong." });
      return;
    }

    if (
      candidateBirthday !== undefined &&
      (typeof candidateBirthday !== "string" ||
        isNaN(Date.parse(candidateBirthday)))
    ) {
      res.status(400).json({
        message:
          "Tanggal lahir calon utama harus berupa format tanggal yang valid.",
      });
      return;
    }

    if (
      viceBirthday !== undefined &&
      (typeof viceBirthday !== "string" || isNaN(Date.parse(viceBirthday)))
    ) {
      res.status(400).json({
        message:
          "Tanggal lahir wakil calon harus berupa format tanggal yang valid.",
      });
      return;
    }

    if (vision !== undefined && (typeof vision !== "string" || vision === "")) {
      res.status(400).json({ message: "Visi paslon tidak boleh kosong." });
      return;
    }

    if (
      mission !== undefined &&
      (typeof mission !== "string" || mission === "")
    ) {
      res.status(400).json({ message: "Misi paslon tidak boleh kosong." });
      return;
    }

    if (
      candidateDescription !== undefined &&
      candidateDescription !== null &&
      typeof candidateDescription !== "string"
    ) {
      res.status(400).json({
        message: "candidateDescription harus berupa string atau null.",
      });
      return;
    }

    if (
      viceDescription !== undefined &&
      viceDescription !== null &&
      typeof viceDescription !== "string"
    ) {
      res.status(400).json({
        message: "viceDescription harus berupa string atau null.",
      });
      return;
    }

    const candidatePair = await candidatePairService.updateCandidatePair(
      pairId,
      req.user.userId,
      req.user.role,
      {
        candidateName,
        candidatePhotoUrl: photoUrls.candidatePhotoUrl,
        candidateDescription,
        candidateBirthday: candidateBirthday
          ? new Date(candidateBirthday)
          : undefined,
        viceName,
        vicePhotoUrl: photoUrls.vicePhotoUrl,
        viceDescription,
        viceBirthday: viceBirthday ? new Date(viceBirthday) : undefined,
        pairPhotoUrl: photoUrls.pairPhotoUrl,
        vision,
        mission,
      },
      electionId ?? undefined,
    );

    res.status(200).json({
      message: "Paslon kandidat berhasil diperbarui.",
      candidatePair,
    });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Error updating candidate pair:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

const deleteCandidatePair = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User belum terautentikasi." });
      return;
    }

    const pairId = parsePositiveInt(req.params.id);
    if (!pairId) {
      res.status(400).json({ message: "ID paslon kandidat tidak valid." });
      return;
    }

    const electionId = parsePositiveInt(req.params.electionId);

    await candidatePairService.deleteCandidatePair(
      pairId,
      req.user.userId,
      req.user.role,
      electionId ?? undefined,
    );

    res.status(200).json({
      message: "Paslon kandidat berhasil dihapus.",
    });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Error deleting candidate pair:", error);
    res.status(500).json({ message: "Terjadi kesahalan pada server." });
  }
};

const getCandidateById = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User belum terautentikasi." });
      return;
    }

    const candidateId = parsePositiveInt(req.params.id);
    if (!candidateId) {
      res.status(400).json({ message: "ID candidate tidak valid." });
      return;
    }

    const candidate = await candidatePairService.getCandidateById(
      candidateId,
      req.user.userId,
      req.user.role,
    );

    res.status(200).json({ candidate });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Error fetching candidate by ID:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

export {
  createCandidatePair,
  getCandidatePairs,
  getCandidatePairById,
  updateCandidatePair,
  deleteCandidatePair,
  getCandidateById,
};
