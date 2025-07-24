import { Request, Response } from "express";
import { Prisma, PrismaClient } from "../../generated/prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();
const prismaClient = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  const email = req.body.email;
  const enteredPassword = req.body.password;

  try {
    if (!email || !enteredPassword) {
      res.status(400).json({
        message: "Email and password required",
      });
    }

    const existingUser = await prismaClient.user.findUnique({
      where: { email: email },
    });

    if (!existingUser) {
      res.status(404).json({
        message: "User email not found",
      });
    } else {
      const checkPassword = await bcrypt.compare(
        enteredPassword,
        existingUser.password
      );

      if (!checkPassword) {
        res.status(401).json({
          message: "Incorrect password",
        });
      }

      const accessToken = jwt.sign(
        { email: existingUser.email, userId: existingUser.id },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );

      const refreshToken = jwt.sign(
        { userId: existingUser.id },
        process.env.REFRESH_TOKEN_SECRET!,
        { expiresIn: "7d" }
      );

      await prismaClient.userAuth.upsert({
        where: {
          userId: existingUser.id,
        },
        update: {
          refreshToken: refreshToken,
        },
        create: {
          userId: existingUser.id,
          refreshToken: refreshToken,
        },
      });

      const { password, ...loggedUser } = existingUser;
      res.status(200).json({
        message: "user logged in successfully",
        accessToken: accessToken,
        refreshToken: refreshToken,
        user:{
          id:loggedUser.id,
          email:loggedUser.email,
          username:loggedUser.username
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "something went wrong",
    });
  }
};
