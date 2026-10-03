import type { Request, Response } from "express";
import { isAppError } from "../utils/app-error";
import { parsePositiveInt } from "../utils/parser";
import * as candidateService from "../services/candidate.service";

const createCandidate = async (req: Request, res: Response): Promise<void> => {
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

    const { name, birthday, vision, mission, photoUrl, description } = req.body;

    if (!name || typeof name !== "string") {
      res.status(400).json({ message: "Name candidate wajib diisi." });
      return;
    }

    if (
      !birthday ||
      typeof birthday !== "string" ||
      isNaN(Date.parse(birthday))
    ) {
      res.status(400).json({
        message:
          "Birthday candidate wajib diisi dengan format tanggal yang valid.",
      });
      return;
    }

    if (!vision || typeof vision !== "string") {
      res.status(400).json({ message: "Vision candidate wajib diisi." });
      return;
    }

    if (!mission || typeof mission !== "string") {
      res.status(400).json({ message: "Mission candidate wajib diisi." });
      return;
    }

    if (
      photoUrl !== undefined &&
      photoUrl !== null &&
      typeof photoUrl !== "string"
    ) {
      res.status(400).json({
        message: "PhotoUrl harus berupa string atau null.",
      });
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

    const candidate = await candidateService.createCandidate(
      {
        electionId,
        name,
        birthday: new Date(birthday),
        vision,
        mission,
        photoUrl,
        description,
      },
      req.user.userId,
      req.user.role,
    );

    res.status(201).json({
      message: "Candidate berhasil dibuat.",
      candidate,
    });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Error creating candidate:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

const getCandidates = async (req: Request, res: Response): Promise<void> => {
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
      const candidates = await candidateService.getCandidatesByElection(
        electionId,
        req.user.userId,
        req.user.role,
      );
      res.status(200).json({ candidates });
      return;
    }

    const candidates = await candidateService.getAllCandidates(
      req.user.userId,
      req.user.role,
    );

    res.status(200).json({ candidates });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Error fetching candidates:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
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

    const electionId = parsePositiveInt(req.params.electionId);

    const candidate = await candidateService.getCandidateById(
      candidateId,
      req.user.userId,
      req.user.role,
      electionId ?? undefined,
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

const updateCandidate = async (req: Request, res: Response): Promise<void> => {
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

    const electionId = parsePositiveInt(req.params.electionId);

    const { name, birthday, vision, mission, photoUrl, description } = req.body;

    if (
      name === undefined &&
      birthday === undefined &&
      vision === undefined &&
      mission === undefined &&
      photoUrl === undefined &&
      description === undefined
    ) {
      res.status(400).json({
        message: "Setidaknya satu field harus disediakan untuk diperbarui.",
      });
      return;
    }

    if (name !== undefined && (typeof name !== "string" || name === "")) {
      res.status(400).json({ message: "Name candidate tidak boleh kosong." });
      return;
    }

    if (
      birthday !== undefined &&
      (typeof birthday !== "string" || isNaN(Date.parse(birthday)))
    ) {
      res.status(400).json({
        message:
          "Birthday candidate harus berupa format tanggal yang valid.",
      });
      return;
    }

    if (vision !== undefined && (typeof vision !== "string" || vision === "")) {
      res.status(400).json({ message: "Vision candidate tidak boleh kosong." });
      return;
    }

    if (
      mission !== undefined &&
      (typeof mission !== "string" || mission === "")) {
      res
        .status(400)
        .json({ message: "Mission candidate tidak boleh kosong." });
      return;
    }

    if (
      photoUrl !== undefined &&
      photoUrl !== null &&
      typeof photoUrl !== "string"
    ) {
      res.status(400).json({
        message: "PhotoUrl harus berupa string atau null.",
      });
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

    const updatePayload: {
      name?: string;
      birthday?: Date;
      vision?: string;
      mission?: string;
      photoUrl?: string | null;
      description?: string | null;
    } = {};

    if (name !== undefined) updatePayload.name = name;
    if (birthday !== undefined) updatePayload.birthday = new Date(birthday);
    if (vision !== undefined) updatePayload.vision = vision;
    if (mission !== undefined) updatePayload.mission = mission;
    if (photoUrl !== undefined) updatePayload.photoUrl = photoUrl;
    if (description !== undefined) updatePayload.description = description;

    const candidate = await candidateService.updateCandidate(
      candidateId,
      req.user.userId,
      req.user.role,
      updatePayload,
      electionId ?? undefined,
    );

    res.status(200).json({
      message: "Candidate berhasil diperbarui.",
      candidate,
    });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Error updating candidate:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

const deleteCandidate = async (req: Request, res: Response): Promise<void> => {
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

    const electionId = parsePositiveInt(req.params.electionId);

    await candidateService.deleteCandidate(
      candidateId,
      req.user.userId,
      req.user.role,
      electionId ?? undefined,
    );

    res.status(200).json({
      message: "Candidate berhasil dihapus.",
    });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Error deleting candidate:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

export {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
};
