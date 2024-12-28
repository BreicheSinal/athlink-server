import { Request, Response } from "express";
import { throwError, throwNotFound } from "../../utils/error";
import {
  editProfileSchema,
  editBioSchema,
} from "../../utils/schemas/generalSchema";
import {
  editProfileService,
  editBioService,
  getClubsService,
  getFederationsService,
  getFederationService,
} from "./federation.service";

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
      const updatedFederation = await editProfileService(parsedId, result.data);
      return res.status(200).json({
        message: "Federation updated successfully",
        athlete: updatedFederation,
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
        message: "Federation bio updated successfully",
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

export const getClubs = async (req: Request, res: Response) => {
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
      const clubs = await getClubsService(parsedId);
      return res.status(200).json({
        message: "Clubs fetched successfully",
        clubs: clubs,
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

export const getFederations = async (req: Request, res: Response) => {
  try {
    try {
      const federations = await getFederationsService();
      return res.status(200).json({
        message: "Federations fetched successfully",
        clubs: federations,
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

export const getFederation = async (req: Request, res: Response) => {
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
      const federation = await getFederationService(parsedId);
      return res.status(200).json({
        message: "Federation fetched successfully",
        federation: federation,
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
