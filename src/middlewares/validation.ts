import { body, ValidationChain, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateNotes: (
  | ValidationChain
  | ((req: Request, res: Response, next: NextFunction) => void)
)[] = [
  body("notes").notEmpty().trim().withMessage("Notes are required"),
  body("systemPrompt")
    .notEmpty()
    .trim()
    .withMessage("System prompt is required"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
];
