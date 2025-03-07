import { Request, Response } from "express";
import { throwError, throwNotFound } from "../../utils/error";
import {
  editProfileSchema,
  editBioSchema,
  addTrophySchema,
  addExperienceCertificationSchema,
} from "../../utils/schemas/generalSchema";

import {
  editProfileService,
  editBioService,
  getAthleteService,
  getAthleteByUserIDService,
  applyTryOutService,
} from "./athlete.service";

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

    const updatedAthlete = await editProfileService(parsedId, result.data);

    return res.status(200).json({
      message: "Athlete updated successfully",
      athlete: updatedAthlete,
    });
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

    const updatedBio = await editBioService(parseInt(id), result.data);

    return res.status(200).json({
      message: "Athlete bio updated successfully",
      bio: updatedBio,
    });
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

export const getAthlete = async (req: Request, res: Response) => {
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

    const result = await getAthleteService(parsedId);

    return res.status(200).json({
      message: "Athlete fetched successfully",
      athlete: result.athlete,
      experience: result.experience,
      tryOuts: result.tryOuts,
    });
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

export const getAthleteUserID = async (req: Request, res: Response) => {
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

    const result = await getAthleteByUserIDService(parsedId);

    return res.status(200).json({
      message: "Athlete fetched successfully",
      athlete: result.athlete,
      experience: result.experience,
    });
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

export const applyTryOut = async (req: Request, res: Response) => {
  try {
    const { athlete_id, try_out_id } = req.body;

    const parsedAthleteId = parseInt(athlete_id, 10);
    if (isNaN(parsedAthleteId) || parsedAthleteId <= 0) {
      return throwError({
        message: `Invalid athlete ID: ${parsedAthleteId}`,
        res,
        status: 400,
      });
    }

    const parsedTryOutId = parseInt(try_out_id, 10);
    if (isNaN(parsedTryOutId) || parsedTryOutId <= 0) {
      return throwError({
        message: `Invalid tryout ID: ${parsedTryOutId}`,
        res,
        status: 400,
      });
    }

    const createdTryOut = await applyTryOutService(
      parsedAthleteId,
      parsedTryOutId
    );

    return res.status(201).json({
      message: "TryOut application created successfully",
      createdTryOut: createdTryOut.createdTryOut,
    });
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
