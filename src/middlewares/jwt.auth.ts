import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { throwError } from "../utils/error";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        roles: string[];
      };
    }
  }
}

export const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return throwError({
        message: "No token provided",
        res,
        status: 401,
      });
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return throwError({
        message: "Token error",
        res,
        status: 401,
      });
    }

    const token = parts[1];

    if (!JWT_SECRET) {
      return throwError({
        message: "JWT_SECRET is not defined",
        res,
        status: 500,
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      email: string;
      roles: string[];
    };

    req.user = {
      id: decoded.id,
      email: decoded.email,
      roles: decoded.roles,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return throwError({
        message: "Token expired",
        res,
        status: 401,
      });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return throwError({
        message: "Invalid token",
        res,
        status: 401,
      });
    }
    return throwError({
      message: "Internal server error",
      res,
      status: 500,
      details: error,
    });
  }
};
