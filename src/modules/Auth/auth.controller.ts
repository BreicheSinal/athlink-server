import { Request, Response } from "express";
import { throwError } from "../../utils/error";
import {
  registerService,
  loginService,
  isValidName,
  isValidEmail,
} from "./auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, roles } = req.body;

    // Validate input
    if (!name || !email || !password || !roles) {
      return throwError({
        message: "Missing required fields",
        res,
        status: 400,
      });
    }

    if (!isValidName(name)) {
      return throwError({
        message: "Name must only contain alphabetic characters",
        res,
        status: 400,
      });
    }

    if (!isValidEmail(email)) {
      return throwError({
        message: "Invalid email format",
        res,
        status: 400,
      });
    }

    try {
      const result = await registerService(name, email, password, roles);
      return res.status(201).json({
        ...result,
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
    const { email, password } = req.body;

    if (!email || !password) {
      return throwError({
        message: "Email and password are required",
        res,
        status: 400,
      });
    }

    try {
      const result = await loginService(email, password);
      return res.status(200).json({
        message: "Login successful",
        ...result,
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
