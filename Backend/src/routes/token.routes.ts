import express from "express";
import { refreshToken, logout } from "controllers/tokenController";

const router = express.Router();

router.post("/auth/refresh", refreshToken);
router.post("/auth/logout", logout);

export default router;