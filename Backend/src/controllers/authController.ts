import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  const { email, password: enteredPassword } = req.body;

  if (!email || !enteredPassword) {
    res.status(400).json({ message: "Email and password required" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { auth: true },
    });

    if (!user || !user.auth) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (!user.isVerified) {
      res.status(403).json({
        message: "Email not verified. Please verify your email first.",
      });
      return;
    }

    const passwordMatch = await bcrypt.compare(
      enteredPassword,
      user.auth.passwordHash,
    );
    if (!passwordMatch) {
      res.status(401).json({ message: "Incorrect password" });
      return;
    }

    const accessToken = jwt.sign(
      { email: user.email, userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" },
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "7d" },
    );

    res.status(200).json({
      message: "Logged in successfully",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
