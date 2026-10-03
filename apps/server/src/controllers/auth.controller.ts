import type { Request, Response } from "express";
import { isAppError } from "../utils/app-error";
import * as authService from "../services/auth.service";

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: "Username dan password wajib diisi." });
      return;
    }

    const { token, user } = await authService.loginUser({
      username,
      password,
    });

    res.status(200).json({
      message: "Login berhasil",
      token,
      user,
    });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("Login error:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Tidak terautentikasi" });
      return;
    }

    const user = await authService.getCurrentUser(req.user.userId);

    res.status(200).json({ user });
  } catch (error) {
    if (isAppError(error)) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    console.error("GetMe error:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

export { login, getMe };
