import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma/client";
import { createOTP } from "../utils/otp";
import { sendOTPEmail } from "../utils/mailer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const sendOTP = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { auth: true },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({ message: "User already verified" });
      return;
    }

    const { otp, hashedOtp, expiresAt } = await createOTP();

    await prisma.userAuth.upsert({
      where: { userId: user.id },
      update: {
        otp: hashedOtp,
        otpExpiresAt: expiresAt,
      },
      create: {
        userId: user.id,
        otp: hashedOtp,
        otpExpiresAt: expiresAt,
      },
    });

    await sendOTPEmail(email, otp);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    res.status(400).json({ message: "Email and OTP are required" });
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

    if (user.isVerified) {
      res.status(400).json({ message: "User already verified" });
      return;
    }

    if (!user.auth.otp || !user.auth.otpExpiresAt) {
      res
        .status(400)
        .json({ message: "No OTP found, please request a new one" });
      return;
    }

    if (new Date() > user.auth.otpExpiresAt) {
      res
        .status(400)
        .json({ message: "OTP has expired, please request a new one" });
      return;
    }

    // compare plain OTP against hashed OTP in DB
    const isMatch = await bcrypt.compare(otp, user.auth.otp);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid OTP" });
      return;
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true },
      }),
      prisma.userAuth.update({
        where: { userId: user.id },
        data: { otp: null, otpExpiresAt: null },
      }),
    ]);

    const accessToken = jwt.sign(
      { email: user.email, userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: "10s" },
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "1h" },
    );

    await prisma.userAuth.update({
      where: { userId: user.id },
      data: { refreshToken: refreshToken },
    });

    res.status(200).json({
      message: "Email verified successfully",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
