import type { Request, Response } from "express";
import { isAppError } from "../utils/app-error";
import { parsePositiveInt } from "../utils/parser";
import * as resultService from "../services/result.service";

const getElectionResultById = async (
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
        req.params.id ??
        (req.query.electionId as string | string[] | undefined),
    );

    if (!electionId) {
      res.status(400).json({
        message: "ID election tidak valid atau wajib diisi.",
      });
      return;
    }

    const resultData = await resultService.getElectionResultById(
      electionId,
      req.user.role,
    );

    res.status(200).json({
      message: "Hasil pemilihan berhasil diambil.",
      data: resultData,
    });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Error fetching election result:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

const getAllElectionResults = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User belum terautentikasi." });
      return;
    }

    const results = await resultService.getAllElectionResults(req.user.role);

    res.status(200).json({
      message: "Seluruh hasil pemilihan berhasil diambil.",
      data: results,
    });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Error fetching all election results:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

const getResultSummary = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User belum terautentikasi." });
      return;
    }

    const summary = await resultService.getResultSummary(req.user.role);

    res.status(200).json({
      message: "Ringkasan hasil pemilihan berhasil diambil.",
      data: summary,
    });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Error fetching result summary:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

const getElectionResults = getElectionResultById;

export {
  getElectionResultById,
  getElectionResults,
  getAllElectionResults,
  getResultSummary,
};
