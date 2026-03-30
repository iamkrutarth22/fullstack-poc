import express from "express";
import { createDocument, getUserDocuments } from "controllers/documentsController";
import { authenticateUser } from "middlewares/authMiddleware";

const router = express.Router();

router.get("/documents", authenticateUser, getUserDocuments);
router.post("/add-document", authenticateUser, createDocument);

export default router;