import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({ message: "Refresh token required" });
    return;
  }

  try {
    console.log("Received refresh token:", refreshToken);

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
    ) as JwtPayload;

    const userAuth = await prisma.userAuth.findFirst({
      where: {
        userId: decoded.userId,
        refreshToken: refreshToken,
      },
      include: { user: true },
    });

    if (!userAuth) {
      res.status(401).json({ message: "Invalid refresh token" });
      return;
    }

    const newAccessToken = jwt.sign(
      { email: userAuth.user.email, userId: userAuth.user.id },
      process.env.JWT_SECRET!,
      { expiresIn: "10s" },
    );

    res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(401).json({ message: "Refresh token expired or invalid" });
  }
};

export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  console.log("Received logout request with refresh token:", refreshToken);

  if (!refreshToken) {
    res.status(400).json({ message: "Refresh token required" });
    return;
  }

  try {
    await prisma.userAuth.updateMany({
      where: { refreshToken: refreshToken },
      data: { refreshToken: null },
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
