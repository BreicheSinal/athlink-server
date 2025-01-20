import multer from "multer";
import { Request, Response, NextFunction } from "express";
import { throwError } from "../utils/error";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
}).array("files");

export const multerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return throwError({
        message: "File upload error",
        res,
        status: 400,
        details: err.message,
      });
    } else if (err) {
      return throwError({
        message: "Unknown error",
        res,
        status: 500,
        details: err.message,
      });
    }
    next();
  });
};
