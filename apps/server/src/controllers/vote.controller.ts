import type { Request, Response } from "express";
import { isAppError } from "../utils/app-error";
import { parsePositiveInt } from "../utils/parser";
import * as voteService from "../services/vote.service";
import { getElectionResultById } from "../services/result.service";

const castVote = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User belum terautentikasi." });
      return;
    }

    const electionId = parsePositiveInt(
      req.params.electionId ?? req.params.id ?? req.body.electionId,
    );

    if (!electionId) {
      res.status(400).json({
        message: "ID election tidak valid atau wajib diisi.",
      });
      return;
    }

    const candidatePairId = parsePositiveInt(req.body.candidatePairId);

    if (!candidatePairId) {
      res.status(400).json({
        message: "ID paslon kandidat tidak valid atau wajib diisi.",
      });
      return;
    }

    const result = await voteService.castVote({
      electionId,
      candidatePairId,
      userId: req.user.userId,
      role: req.user.role,
    });

    res.status(201).json(result);
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Error casting vote:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

const getVotingStatus = async (req: Request, res: Response): Promise<void> => {
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

    const targetVoterId = parsePositiveInt(
      req.query.voterId as string | string[] | undefined,
    );

    const status = await voteService.getVotingStatus(
      electionId,
      req.user.userId,
      req.user.role,
      targetVoterId ?? undefined,
    );

    res.status(200).json({
      message: "Status voting berhasil diambil.",
      status,
    });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Error fetching voting status:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

const getElectionResults = async (
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

    const resultData = await getElectionResultById(electionId, req.user.role);

    res.status(200).json({
      message: "Hasil pemilihan berhasil diambil.",
      data: resultData,
    });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Error fetching election results:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

export { castVote, getVotingStatus, getElectionResults };