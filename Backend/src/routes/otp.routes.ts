import express from "express";
import { sendOTP, verifyOTP } from "controllers/otpController";

const router = express.Router();

router.post("/auth/send-otp", sendOTP);
router.post("/auth/verify-otp", verifyOTP);

export default router;