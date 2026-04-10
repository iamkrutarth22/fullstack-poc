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


export const updateDocument = async (req: Request, res: Response) => {
  const userId = req.userId;
  const { id } = req.params;
  const { title, content, version } = req.body;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (!version) {
    res.status(400).json({ message: "Version is required" });
    return;
  }

  try {
    // find document and verify ownership
    const existing = await prisma.document.findUnique({
      where: { id },
    });

    if (!existing) {
      res.status(404).json({ message: "Document not found" });
      return;
    }

    if (existing.userId !== userId) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    if (existing.version !== version) {
      res.status(409).json({
        message: "Version conflict — document was modified elsewhere",
        currentVersion: existing.version,
      });
      return;
    }

    const newVersion = version + 1;

    // save new version snapshot + update document atomically
    const [_, updatedDocument] = await prisma.$transaction([
      // create version snapshot
      prisma.documentVersion.create({
        data: {
          documentId: id,
          content: existing.content!,
          version: existing.version,
        },
      }),
      // update document with new content
      prisma.document.update({
        where: { id },
        data: {
          ...(title && { title }),
          ...(content && { content }),
          version: newVersion,
        },
      }),
    ]);

    // prune versions beyond 10
    const versions = await prisma.documentVersion.findMany({
      where: { documentId: id },
      orderBy: { savedAt: "desc" },
    });

    if (versions.length > 10) {
      const toDelete = versions.slice(10).map((v) => v.id);
      await prisma.documentVersion.deleteMany({
        where: { id: { in: toDelete } },
      });
    }

    res.status(200).json({
      message: "Document updated",
      document: updatedDocument,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};