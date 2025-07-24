import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import jwt, { JwtPayload } from "jsonwebtoken";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

dotenv.config();
export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    console.log("authHeaders=>" ,authHeader)
    if (!authHeader) {
      res.status(401).json({
        message: "Authorization header missing",
      });

    }
    const token = authHeader;
    console.log('......................................')
    console.log("decoded token=>>>>",token);
    const decodedToken = jwt.verify(token!, process.env.JWT_SECRET!);

    if (!decodedToken) {
      res.status(401).json({
        message: "unauthenticated",
      });
    }
    
    req.userId = (decodedToken as JwtPayload).userId ;
    console.log(req.userId);
    next();
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
