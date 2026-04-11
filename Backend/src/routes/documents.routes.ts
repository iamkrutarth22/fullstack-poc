import express from "express";
import { createDocument, getDocumentById, getUserDocuments, updateDocument } from "controllers/documentsController";
import { authenticateUser } from "middlewares/authMiddleware";

const router = express.Router();

router.get("/documents", authenticateUser, getUserDocuments);
router.post("/add-document", authenticateUser, createDocument);
router.patch("/documents/:id", authenticateUser, updateDocument);
router.get("/documents/:id", authenticateUser, getDocumentById);

export default router;