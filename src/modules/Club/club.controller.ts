import { Request, Response } from "express";

import { AppDataSource } from "../../db/connection";
import { User } from "../../db/entities/User";
import { Club } from "../../db/entities/Club";

import { throwError, throwNotFound } from "../../utils/error";

import {
  editProfileSchema,
  EditProfileInput,
} from "../../schemas/generalSchema";

const clubRepository = AppDataSource.getRepository(Club);

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
