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
  addTrophyService,
  addExperienceCertificationService,
  editExperienceCertificationService,
  deleteExperienceCertificationService,
  getAthleteService,
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

export const addTrophy = async (req: Request, res: Response) => {
  try {
    const { entity_id } = req.params;

    const parsedEntityId = parseInt(entity_id, 10);
    if (isNaN(parsedEntityId) || parsedEntityId <= 0) {
      return throwError({
        message: `Invalid entity_id: ${entity_id}`,
        res,
        status: 400,
      });
    }

    const result = addTrophySchema.safeParse(req.body);
    if (!result.success) {
      return throwError({
        message: "Validation error",
        res,
        status: 400,
        details: result.error.format(),
      });
    }

    const createdTrophy = await addTrophyService(parsedEntityId, result.data);

    return res.status(201).json({
      message: "Trophy created successfully",
      trophy: createdTrophy,
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

export const addExperienceCertification = async (
  req: Request,
  res: Response
) => {
  try {
    const { user_id } = req.params;

    const parsedUserId = parseInt(user_id, 10);
    if (isNaN(parsedUserId) || parsedUserId <= 0) {
      return throwError({
        message: "User ID must be a valid positive number",
        res,
        status: 400,
      });
    }

    const result = addExperienceCertificationSchema.safeParse(req.body);
    if (!result.success) {
      return throwError({
        message: "Validation error",
        res,
        status: 400,
        details: result.error.format(),
      });
    }

    const createdExperienceCertification =
      await addExperienceCertificationService(parsedUserId, result.data);

    return res.status(201).json({
      message: `${result.data.type} created successfully`,
      athlete: createdExperienceCertification,
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

export const editExperienceCertification = async (
  req: Request,
  res: Response
) => {
  try {
    const { exp_id } = req.params;

    const parsedExpId = parseInt(exp_id, 10);
    if (isNaN(parsedExpId) || parsedExpId <= 0) {
      return throwError({
        message: "Experience ID must be valid positive numbers",
        res,
        status: 400,
      });
    }

    const result = addExperienceCertificationSchema.safeParse(req.body);
    if (!result.success) {
      return throwError({
        message: "Validation error",
        res,
        status: 400,
        details: result.error.format(),
      });
    }

    const updatedExperience = await editExperienceCertificationService(
      parsedExpId,
      result.data
    );

    return res.status(200).json({
      message: `${result.data.type} updated successfully`,
      athlete: updatedExperience,
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

export const deleteExperienceCertification = async (
  req: Request,
  res: Response
) => {
  try {
    const { exp_id } = req.params;

    const parsedExpId = parseInt(exp_id, 10);
    if (isNaN(parsedExpId) || parsedExpId <= 0) {
      return throwError({
        message: "Experience ID must be valid positive numbers",
        res,
        status: 400,
      });
    }

    await deleteExperienceCertificationService(parsedExpId);

    return res.status(200).json({
      message: "Experience deleted successfully",
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
