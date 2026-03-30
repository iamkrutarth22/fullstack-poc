import { NextFunction, Request, Response } from "express";
import { Prisma, PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const getUserDocuments = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const documents = await prisma.document.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });
    res.status(200).json({ documents });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch documents", error: err });
  }
};

export const createDocument = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const { title, content } = req.body;
    if (!title) {
      res.status(400).json({ message: "Title is required" });
      return;
    }
    const document = await prisma.document.create({
      data: {
        title,
        content: content ?? {},
        userId,
      },
    });
    res.status(201).json({ document });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      res.status(400).json({ message: (err as any).message });
      return;
    }
    res.status(500).json({ message: "Internal server error" });
  }
};