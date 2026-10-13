import type { Request, Response } from "express";
import { isAppError } from "../utils/app-error";
import { parsePositiveInt } from "../utils/parser";
import * as userService from "../services/user.service";

const getAllAdmins = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User belum terautentikasi." });
      return;
    }

    const admins = await userService.getAllAdmins(req.user.role);

    res.status(200).json({ admins });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Error fetching admins:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

const createAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User belum terautentikasi." });
      return;
    }

    const { username, password, name } = req.body;

    if (!username || typeof username !== "string") {
      res.status(400).json({ message: "Username admin wajib diisi." });
      return;
    }

    if (!password || typeof password !== "string") {
      res.status(400).json({ message: "Password admin wajib diisi." });
      return;
    }

    if (!name || typeof name !== "string") {
      res.status(400).json({ message: "Nama admin wajib diisi." });
      return;
    }

    const admin = await userService.createAdmin(
      { username, password, name },
      req.user.userId,
      req.user.role,
    );

    res.status(201).json({
      message: "Admin berhasil dibuat.",
      admin,
    });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Error creating admin:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

const getAdminById = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User belum terautentikasi." });
      return;
    }

    const adminId = parsePositiveInt(req.params.id);
    if (!adminId) {
      res.status(400).json({ message: "ID admin tidak valid." });
      return;
    }

    const admin = await userService.getAdminById(adminId, req.user.role);

    res.status(200).json({ admin });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Error fetching admin by ID:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

const updateAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User belum terautentikasi." });
      return;
    }

    const adminId = parsePositiveInt(req.params.id);
    if (!adminId) {
      res.status(400).json({ message: "ID admin tidak valid." });
      return;
    }

    const { name, username, password } = req.body;

    if (
      name === undefined &&
      username === undefined &&
      password === undefined
    ) {
      res.status(400).json({
        message:
          "Setidaknya name, username, atau password harus disediakan untuk diperbarui.",
      });
      return;
    }

    const admin = await userService.updateAdmin(
      adminId,
      { name, username, password },
      req.user.role,
    );

    res.status(200).json({
      message: "Admin berhasil diperbarui.",
      admin,
    });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Error updating admin:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

const deleteAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User belum terautentikasi." });
      return;
    }

    const adminId = parsePositiveInt(req.params.id);
    if (!adminId) {
      res.status(400).json({ message: "ID admin tidak valid." });
      return;
    }

    await userService.deleteAdmin(adminId, req.user.role);

    res.status(200).json({
      message: "Admin berhasil dihapus.",
    });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Error deleting admin:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

export { getAllAdmins, createAdmin, getAdminById, updateAdmin, deleteAdmin };
