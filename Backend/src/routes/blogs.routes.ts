import { createBlog, getUserBlog } from "controllers/blogsController";
import express from "express";
import { authenticateUser } from "middlewares/authMiddleware";
const router = express.Router();

router.get('/getblogs',getUserBlog)
router.post('/addblog', createBlog)


export default router

