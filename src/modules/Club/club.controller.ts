import { Request, Response } from "express";

import { AppDataSource } from "../../db/connection";
import { User } from "../../db/entities/User";
import { Club } from "../../db/entities/Club";
import { Coach } from "../../db/entities/Coach";

import { throwError, throwNotFound } from "../../utils/error";

import {
  editProfileSchema,
  EditProfileInput,
  editBioSchema,
  EditBioInput,
} from "../../schemas/generalSchema";

const clubRepository = AppDataSource.getRepository(Club);
const userRepository = AppDataSource.getRepository(User);
const coachRepository = AppDataSource.getRepository(Coach);

export const editProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // validating ID
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

    // validating body based on zod
    const result = editProfileSchema.safeParse(req.body);

    if (!result.success) {
      return throwError({
        message: "Validation error",
        res,
        status: 400,
        details: result.error.format(),
      });
    }

    const { location, founded_year }: EditProfileInput = result.data;

    // finding club by id
    const club = await clubRepository.findOne({
      where: { id: parsedId },
    });

    if (!club) {
      return throwNotFound({
        entity: `Club with id ${id}`,
        check: true,
        res,
      });
    }

    // updating fields
    club.location = location == null ? null : location;
    club.founded_year = founded_year == null ? null : founded_year;

    // saved updated club
    const updatedClub = await clubRepository.save(club);

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
    const { id } = req.params; //club id

    // validating ID
    if (!id)
      return throwError({
        message: "ID required",
        res,
        status: 400,
      });

    // validating body using zod
    const result = editBioSchema.safeParse(req.body);

    if (!result.success) {
      return throwError({
        message: "Validation error",
        res,
        status: 400,
        details: result.error.format(),
      });
    }

    const { bio }: EditBioInput = result.data;

    // finding club by id
    const club = await clubRepository.findOne({
      where: { id: parseInt(id) },
      relations: ["user"],
    });

    if (!club) {
      return throwNotFound({
        entity: `Club with id ${id}`,
        check: true,
        res,
      });
    }

    // updating user bio
    const user = club.user;

    if (!user)
      return throwNotFound({
        entity: `User associated with club of id ${id}`,
        check: true,
        res,
      });

    user.bio = bio;

    const updatedUserBio = await userRepository.save(user);

    return res.status(200).json({
      message: "Club bio updated successfully",
      bio: updatedUserBio,
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
    const { id } = req.params; //club id

    // validating ID
    if (!id)
      return throwError({
        message: "ID required",
        res,
        status: 400,
      });

    const parsedId = parseInt(id);
    if (isNaN(parsedId) || parsedId <= 0) {
      return throwError({
        message: "ID must be a positive integer",
        res,
        status: 400,
      });
    }

    // fetching club by ID
    const staff = await coachRepository.find({
      where: { club: { id: parsedId } },
    });

    if (staff.length === 0) {
      return throwNotFound({
        entity: `Staff with club id ${id}`,
        check: true,
        res,
      });
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
    const { id } = req.params; // club id

    // validating ID
    if (!id)
      return throwError({
        message: "ID required",
        res,
        status: 400,
      });

    const parsedId = parseInt(id);
    if (isNaN(parsedId) || parsedId <= 0) {
      return throwError({
        message: "ID must be a positive integer",
        res,
        status: 400,
      });
    }

    // fetching athlete by ID
    const club = await clubRepository.find({
      where: { id: parsedId },
      relations: ["user", "federation", "federation.user"],
    });

    if (club.length === 0) {
      return throwNotFound({
        entity: `Club with id ${id}`,
        check: true,
        res,
      });
    }

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
    // Fetching all clubs with their relations
    const clubs = await clubRepository.find({
      relations: ["user"],
    });

    if (clubs.length === 0) {
      return throwNotFound({
        entity: "Clubs",
        check: true,
        res,
      });
    }

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
