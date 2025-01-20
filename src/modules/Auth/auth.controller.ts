import { Request, Response } from "express";
import { throwError } from "../../utils/error";
import { registerService, loginService } from "./auth.service";
import { registerSchema, loginSchema } from "../../utils/schemas/authSchema";

export const register = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod schema
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      return throwError({
        message: "Validation error",
        res,
        status: 400,
        details: result.error.format(),
      });
    }

    try {
      const serviceResult = await registerService(result.data);
      return res.status(201).json({
        ...serviceResult,
        message: "User registered successfully",
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("already exists")) {
          return throwError({
            message: error.message,
            res,
            status: 409,
          });
        }
        if (error.message.includes("not found")) {
          return throwError({
            message: error.message,
            res,
            status: 404,
          });
        }
      }
      throw error;
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error(`Error: ${errorMessage}`);
    return throwError({
      message: errorMessage,
      res,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod schema
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return throwError({
        message: "Validation error",
        res,
        status: 400,
        details: result.error.format(),
      });
    }

    try {
      const serviceResult = await loginService(result.data);
      return res.status(200).json({
        message: "Login successful",
        ...serviceResult,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Invalid email or password")
      ) {
        return throwError({
          message: error.message,
          res,
          status: 401,
        });
      }
      throw error;
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error(`Error: ${errorMessage}`);
    return throwError({
      message: errorMessage,
      res,
    });
  }
};
