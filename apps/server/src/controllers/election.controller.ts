import type { Request, Response } from "express";
import { isAppError } from "../utils/app-error";
import { parsePositiveInt } from "../utils/parser";
import * as electionService from "../services/election.service";

const createElection = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description } = req.body;

    if (!title || typeof title !== "string") {
      res.status(400).json({ message: "Title election wajib diisi." });
      return;
    }

    if (
      description !== undefined &&
      description !== null &&
      typeof description !== "string"
    ) {
      res.status(400).json({
        message: "Description harus berupa string atau null.",
      });
      return;
    }

    const election = await electionService.createElection({
      title,
      description,
    });

    res.status(201).json({
      message: "Election berhasil dibuat.",
      election,
    });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Error creating election:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

const getElections = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User belum terautentikasi." });
      return;
    }

    const elections = await electionService.getAllElections(
      req.user.userId,
      req.user.role,
    );

    res.status(200).json({ elections });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Error fetching elections:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

const getElectionById = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User belum terautentikasi." });
      return;
    }

    const electionId = parsePositiveInt(req.params.id);
    if (!electionId) {
      res.status(400).json({ message: "ID election tidak valid." });
      return;
    }

    const election = await electionService.getElectionById(
      electionId,
      req.user.userId,
      req.user.role,
    );

    res.status(200).json({ election });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Error fetching election by ID:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

const updateElection = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User belum terautentikasi." });
      return;
    }

    const electionId = parsePositiveInt(req.params.id);
    if (!electionId) {
      res.status(400).json({ message: "ID election tidak valid." });
      return;
    }

    const { title, description } = req.body;

    if (title === undefined && description === undefined) {
      res.status(400).json({
        message:
          "Setidaknya title atau description harus disediakan untuk diperbarui.",
      });
      return;
    }

    if (title !== undefined && (typeof title !== "string" || title === "")) {
      res.status(400).json({ message: "Title election tidak boleh kosong." });
      return;
    }

    if (
      description !== undefined &&
      description !== null &&
      typeof description !== "string"
    ) {
      res.status(400).json({
        message: "Description harus berupa string atau null.",
      });
      return;
    }

    const election = await electionService.updateElection(
      electionId,
      req.user.userId,
      req.user.role,
      {
        title,
        description,
      },
    );

    res.status(200).json({
      message: "Election berhasil diperbarui.",
      election,
    });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Error updating election:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

const deleteElection = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User belum terautentikasi." });
      return;
    }

    const electionId = parsePositiveInt(req.params.id);
    if (!electionId) {
      res.status(400).json({ message: "ID election tidak valid." });
      return;
    }

    await electionService.deleteElection(electionId, req.user.role);

    res.status(200).json({
      message: "Election berhasil dihapus.",
    });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Error deleting election:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

const assignAdmins = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User belum terautentikasi." });
      return;
    }

    const electionId = parsePositiveInt(req.params.id);
    if (!electionId) {
      res.status(400).json({ message: "ID election tidak valid." });
      return;
    }

    const { adminIds } = req.body;

    if (
      !Array.isArray(adminIds) ||
      adminIds.length === 0 ||
      adminIds.some(
        (id) => typeof id !== "number" || !Number.isInteger(id) || id <= 0,
      )
    ) {
      res.status(400).json({
        message:
          "adminIds harus berupa array berisi setidaknya satu ID integer positif.",
      });
      return;
    }

    const admins = await electionService.assignAdminsToElection(
      electionId,
      adminIds,
      req.user.role,
    );

    res.status(201).json({
      message: "Admin berhasil ditugaskan ke election.",
      electionAdmins: admins,
    });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Error assigning admins to election:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

const removeAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User belum terautentikasi." });
      return;
    }

    const electionId = parsePositiveInt(req.params.id);
    const adminId = parsePositiveInt(req.params.adminId);

    if (!electionId || !adminId) {
      res.status(400).json({
        message: "ID election atau ID admin tidak valid.",
      });
      return;
    }

    await electionService.removeAdminFromElection(
      electionId,
      adminId,
      req.user.role,
    );

    res.status(200).json({
      message: "Admin berhasil dihapus dari election.",
    });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Error removing admin from election:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

const getElectionAdmins = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User belum terautentikasi." });
      return;
    }

    const electionId = parsePositiveInt(req.params.id);
    if (!electionId) {
      res.status(400).json({ message: "ID election tidak valid." });
      return;
    }

    const admins = await electionService.getElectionAdmins(
      electionId,
      req.user.userId,
      req.user.role,
    );

    res.status(200).json({ admins });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Error fetching election admins:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

export {
  createElection,
  getElections,
  getElectionById,
  updateElection,
  deleteElection,
  assignAdmins,
  removeAdmin,
  getElectionAdmins,
};
