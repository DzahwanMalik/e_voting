import type { Request, Response } from "express";
import { isAppError } from "../utils/app-error";
import { parsePositiveInt } from "../utils/parser";
import type { PaginationMeta } from "../types/pagination";
import * as voterService from "../services/voter.service";

const createVoter = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User belum terautentikasi." });
      return;
    }

    const { username, password, name, electionIds, electionId } = req.body;

    if (!username || typeof username !== "string") {
      res.status(400).json({ message: "Username voter wajib diisi." });
      return;
    }

    if (!password || typeof password !== "string") {
      res.status(400).json({ message: "Password voter wajib diisi." });
      return;
    }

    if (!name || typeof name !== "string") {
      res.status(400).json({ message: "Name voter wajib diisi." });
      return;
    }

    let parsedElectionIds: number[] | undefined;
    if (electionIds !== undefined) {
      if (
        !Array.isArray(electionIds) ||
        electionIds.some(
          (id) => typeof id !== "number" || !Number.isInteger(id) || id <= 0,
        )
      ) {
        res.status(400).json({
          message:
            "electionIds harus berupa array berisi ID integer positif.",
        });
        return;
      }
      parsedElectionIds = electionIds;
    } else if (electionId !== undefined) {
      const parsedId = parsePositiveInt(electionId);
      if (!parsedId) {
        res.status(400).json({ message: "electionId tidak valid." });
        return;
      }
      parsedElectionIds = [parsedId];
    }

    const voter = await voterService.createVoter(
      {
        username,
        password,
        name,
        electionIds: parsedElectionIds,
      },
      req.user.userId,
      req.user.role,
    );

    res.status(201).json({
      message: "Voter berhasil dibuat.",
      voter,
    });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Error creating voter:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

const getVoters = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User belum terautentikasi." });
      return;
    }

    const electionId = parsePositiveInt(
      req.query.electionId as string | string[] | undefined,
    );
    const page = parsePositiveInt(
      req.query.page as string | string[] | undefined,
    );
    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;

    const { voters, meta } = (await voterService.getVoters(
      req.user.userId,
      req.user.role,
      {
        electionId: electionId ?? undefined,
        search,
        page: page ?? undefined,
      },
    )) as { voters: unknown[]; meta: PaginationMeta };

    res.status(200).json({ voters, meta });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Error fetching voters:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

const getVoterById = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User belum terautentikasi." });
      return;
    }

    const voterId = parsePositiveInt(req.params.id);
    if (!voterId) {
      res.status(400).json({ message: "ID voter tidak valid." });
      return;
    }

    const voter = await voterService.getVoterById(
      voterId,
      req.user.userId,
      req.user.role,
    );

    res.status(200).json({ voter });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Error fetching voter by ID:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

const updateVoter = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User belum terautentikasi." });
      return;
    }

    const voterId = parsePositiveInt(req.params.id);
    if (!voterId) {
      res.status(400).json({ message: "ID voter tidak valid." });
      return;
    }

    const { name, username, password } = req.body;

    if (name === undefined && username === undefined && password === undefined) {
      res.status(400).json({
        message:
          "Setidaknya name, username, atau password harus disediakan untuk diperbarui.",
      });
      return;
    }

    if (name !== undefined && (typeof name !== "string" || name === "")) {
      res.status(400).json({ message: "Name voter tidak boleh kosong." });
      return;
    }

    if (
      username !== undefined &&
      (typeof username !== "string" || username === "")
    ) {
      res.status(400).json({ message: "Username voter tidak boleh kosong." });
      return;
    }

    if (
      password !== undefined &&
      (typeof password !== "string" || password === "")
    ) {
      res.status(400).json({ message: "Password voter tidak boleh kosong." });
      return;
    }

    const voter = await voterService.updateVoter(
      voterId,
      {
        name,
        username,
        password,
      },
      req.user.userId,
      req.user.role,
    );

    res.status(200).json({
      message: "Voter berhasil diperbarui.",
      voter,
    });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Error updating voter:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

const deleteVoter = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User belum terautentikasi." });
      return;
    }

    const voterId = parsePositiveInt(req.params.id);
    if (!voterId) {
      res.status(400).json({ message: "ID voter tidak valid." });
      return;
    }

    await voterService.deleteVoter(voterId, req.user.userId, req.user.role);

    res.status(200).json({
      message: "Voter berhasil dihapus.",
    });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Error deleting voter:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

const enrollVoters = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User belum terautentikasi." });
      return;
    }

    const electionId = parsePositiveInt(
      req.params.id ?? req.params.electionId ?? req.body.electionId,
    );
    if (!electionId) {
      res.status(400).json({ message: "ID election tidak valid." });
      return;
    }

    const rawVoterIds =
      req.body.voterIds ??
      (req.body.voterId !== undefined ? [req.body.voterId] : undefined);

    if (
      !Array.isArray(rawVoterIds) ||
      rawVoterIds.length === 0 ||
      rawVoterIds.some(
        (id) => typeof id !== "number" || !Number.isInteger(id) || id <= 0,
      )
    ) {
      res.status(400).json({
        message:
          "voterIds harus berupa array berisi setidaknya satu ID voter integer positif.",
      });
      return;
    }

    const electionVoters = await voterService.enrollVotersToElection(
      electionId,
      rawVoterIds,
      req.user.userId,
      req.user.role,
    );

    res.status(201).json({
      message: "Voter berhasil didaftarkan ke election.",
      electionVoters,
    });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Error enrolling voters to election:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

const removeVoterFromElection = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User belum terautentikasi." });
      return;
    }

    let electionId: number | null = null;
    let voterId: number | null = null;

    if (req.params.voterId) {
      voterId = parsePositiveInt(req.params.voterId);
      electionId = parsePositiveInt(req.params.electionId ?? req.params.id);
    } else if (req.params.electionId) {
      electionId = parsePositiveInt(req.params.electionId);
      voterId = parsePositiveInt(req.params.id);
    }

    if (!electionId || !voterId) {
      res.status(400).json({
        message: "ID election atau ID voter tidak valid.",
      });
      return;
    }

    await voterService.removeVoterFromElection(
      electionId,
      voterId,
      req.user.userId,
      req.user.role,
    );

    res.status(200).json({
      message: "Voter berhasil dihapus dari election.",
    });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Error removing voter from election:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

const getElectionVoters = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User belum terautentikasi." });
      return;
    }

    const electionId = parsePositiveInt(
      req.params.id ?? req.params.electionId,
    );
    if (!electionId) {
      res.status(400).json({ message: "ID election tidak valid." });
      return;
    }

    const electionVoters = await voterService.getElectionVoters(
      electionId,
      req.user.userId,
      req.user.role,
    );

    res.status(200).json({ electionVoters });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Error fetching election voters:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

const enrollVoterToElections = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User belum terautentikasi." });
      return;
    }

    const voterId = parsePositiveInt(req.params.id);
    if (!voterId) {
      res.status(400).json({ message: "ID voter tidak valid." });
      return;
    }

    const rawElectionIds =
      req.body.electionIds ??
      (req.body.electionId !== undefined ? [req.body.electionId] : undefined);

    if (
      !Array.isArray(rawElectionIds) ||
      rawElectionIds.length === 0 ||
      rawElectionIds.some(
        (id) => typeof id !== "number" || !Number.isInteger(id) || id <= 0,
      )
    ) {
      res.status(400).json({
        message:
          "electionIds harus berupa array berisi setidaknya satu ID election integer positif.",
      });
      return;
    }

    const electionVoters = await voterService.enrollVoterToElections(
      voterId,
      rawElectionIds,
      req.user.userId,
      req.user.role,
    );

    res.status(201).json({
      message: "Voter berhasil didaftarkan ke election.",
      electionVoters,
    });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Error enrolling voter to elections:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

export {
  createVoter,
  getVoters,
  getVoterById,
  updateVoter,
  deleteVoter,
  enrollVoters,
  removeVoterFromElection,
  getElectionVoters,
  enrollVoterToElections,
};
