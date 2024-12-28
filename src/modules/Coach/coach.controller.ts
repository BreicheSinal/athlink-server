import { Request, Response } from "express";
import { throwError, throwNotFound } from "../../utils/error";
import {
  editProfileSchema,
  editBioSchema,
} from "../../utils/schemas/generalSchema";
import {
  editProfileService,
  editBioService,
  getCoachService,
} from "./coach.service";

export const editProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return throwError({
        message: "ID required",
        res,
        status: 400,
      });
    }

    const parsedId = parseInt(id);
    if (isNaN(parsedId) || parsedId <= 0) {
      return throwError({
        message: "ID must be a positive integer",
        res,
        status: 400,
      });
    }

    const result = editProfileSchema.safeParse(req.body);
    if (!result.success) {
      return throwError({
        message: "Validation error",
        res,
        status: 400,
        details: result.error.format(),
      });
    }

    try {
      const updatedCoach = await editProfileService(parsedId, result.data);
      return res.status(200).json({
        message: "Coach updated successfully",
        athlete: updatedCoach,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        return throwNotFound({
          entity: error.message,
          check: true,
          res,
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

export const editBio = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return throwError({
        message: "ID required",
        res,
        status: 400,
      });
    }

    const result = editBioSchema.safeParse(req.body);
    if (!result.success) {
      return throwError({
        message: "Validation error",
        res,
        status: 400,
        details: result.error.format(),
      });
    }

    try {
      const updatedBio = await editBioService(parseInt(id), result.data);
      return res.status(200).json({
        message: "Coach bio updated successfully",
        bio: updatedBio,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        return throwNotFound({
          entity: error.message,
          check: true,
          res,
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

export const getCoach = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return throwError({
        message: "ID required",
        res,
        status: 400,
      });
    }

    const parsedId = parseInt(id);
    if (isNaN(parsedId) || parsedId <= 0) {
      return throwError({
        message: "ID must be a positive integer",
        res,
        status: 400,
      });
    }

    try {
      const coach = await getCoachService(parsedId);
      return res.status(200).json({
        message: "Coach fetched successfully",
        coach: coach,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        return throwNotFound({
          entity: error.message,
          check: true,
          res,
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
