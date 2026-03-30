import express  from "express";
import { signup } from "../controllers/userController";

const router=express.Router();



router.post("/signup",signup)
// router.patch("/updateprofile/:userId",updateProfile)

export default router