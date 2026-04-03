import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import jwt, {
  JwtPayload,
  TokenExpiredError,
  JsonWebTokenError,
} from "jsonwebtoken";

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
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    res.status(401).json({ message: "Authorization header missing" });
    return;
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
    req.userId = (decodedToken as JwtPayload).userId;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "Token expired" });
      return;
    }
    if (err instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

//

// then in the catch block:
