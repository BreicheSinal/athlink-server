import { Request, Response } from "express";
import { throwError, throwNotFound } from "../../utils/error";
import {
  editProfileSchema,
  editBioSchema,
  addTryoutSchema,
} from "../../utils/schemas/generalSchema";
import {
  editProfileService,
  editBioService,
  getStaffService,
  getClubService,
  getClubByUserIDService,
  getClubsService,
  addTryOutService,
  deleteTryOutService,
  getApplicationService,
  updateApplicationStatusService,
} from "./club.service";

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

    const updatedClub = await editProfileService(parsedId, result.data);

    return res.status(200).json({
      message: "Club updated successfully",
      athlete: updatedClub,
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
      message: "Club bio updated successfully",
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

export const getStaff = async (req: Request, res: Response) => {
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

    const staff = await getStaffService(parsedId);

    if (staff.length === 0) {
      return res.status(204).send();
    }

    return res.status(200).json({
      message: "Staff fetched successfully",
      coaches: staff,
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

export const getClub = async (req: Request, res: Response) => {
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

    const club = await getClubService(parsedId);

    return res.status(200).json({
      message: "Club fetched successfully",
      club: club.club,
      tryOuts: club.tryOuts,
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

export const getClubUserID = async (req: Request, res: Response) => {
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

    const club = await getClubByUserIDService(parsedId);

    return res.status(200).json({
      message: "Club fetched successfully",
      club: club,
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

export const getClubs = async (req: Request, res: Response) => {
  try {
    const clubs = await getClubsService();

    return res.status(200).json({
      message: "All clubs fetched successfully",
      clubs,
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

export const addTryOut = async (req: Request, res: Response) => {
  try {
    const { clubId } = req.body;

    const parsedClubId = parseInt(clubId, 10);
    if (isNaN(parsedClubId) || parsedClubId <= 0) {
      return throwError({
        message: "Club ID must be a valid positive number",
        res,
        status: 400,
      });
    }

    const result = addTryoutSchema.safeParse(req.body);
    if (!result.success) {
      return throwError({
        message: "Validation error",
        res,
        status: 400,
        details: result.error.format(),
      });
    }

    const createdTryout = await addTryOutService(parsedClubId, result.data);

    return res.status(201).json({
      message: "Tryout created successfully",
      tryout: createdTryout,
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

export const deleteTryOut = async (req: Request, res: Response) => {
  try {
    const { trID } = req.params;

    const parsedTrID = parseInt(trID, 10);
    if (isNaN(parsedTrID) || parsedTrID <= 0) {
      return throwError({
        message: "TryOut ID must be valid positive numbers",
        res,
        status: 400,
      });
    }

    await deleteTryOutService(parsedTrID);

    return res.status(200).json({
      message: "TryOut deleted successfully",
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

export const getApplications = async (req: Request, res: Response) => {
  try {
    const { clubId } = req.params;

    const parsedClubId = parseInt(clubId);
    const applications = await getApplicationService(parsedClubId);

    return res.status(200).json({
      message: "Fetched application successfully",
      applications,
    });
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error(`Error: ${errorMessage}`);
    return throwError({
      message: errorMessage,
      res,
    });
  }
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { action } = req.body;
    const { applicationId } = req.params;

    const parsedApplicationId = parseInt(applicationId);

    const application = await updateApplicationStatusService(
      parsedApplicationId,
      action
    );

    return res.status(200).json({
      message: "Updated application status successfully",
      application,
    });
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error(`Error: ${errorMessage}`);
    return throwError({
      message: errorMessage,
      res,
    });
  }
};
