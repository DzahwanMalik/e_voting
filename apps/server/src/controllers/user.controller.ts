import type { Request, Response } from "express";
import { isAppError } from "../utils/app-error";
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

export { getAllAdmins };
