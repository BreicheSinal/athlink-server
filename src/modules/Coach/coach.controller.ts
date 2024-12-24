import { Request, Response } from "express";

import { AppDataSource } from "../../db/connection";
import { Coach } from "../../db/entities/Coach";
import { User } from "../../db/entities/User";
import { Club } from "../../db/entities/Club";

import { throwError, throwNotFound } from "../../utils/error";
import {
  editProfileSchema,
  EditProfileInput,
  editBioSchema,
  EditBioInput,
} from "../../schemas/generalSchema";

const coachRepository = AppDataSource.getRepository(Coach);
const userRepository = AppDataSource.getRepository(User);
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

    const { club_id, specialty }: EditProfileInput = result.data;

    // finding coach by id
    const coach = await coachRepository.findOne({
      where: { id: parsedId },
    });

    if (!coach) {
      return throwNotFound({
        entity: `Coach with id ${id}`,
        check: true,
        res,
      });
    }

    // validating club
    if (club_id !== null && club_id !== undefined) {
      const club = await clubRepository.findOne({ where: { id: club_id } });

      if (!club) {
        return throwNotFound({
          entity: `Club with id ${club_id}`,
          check: true,
          res,
        });
      }
      coach.club = club;
    } else {
      coach.club = null;
    }

    // updating fields
    coach.specialty = specialty == null ? null : specialty;

    // saved updated club
    const updatedCoach = await coachRepository.save(coach);

    return res.status(200).json({
      message: "Coach updated successfully",
      athlete: updatedCoach,
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

export const editBio = async (req: Request, res: Response) => {};

export const getCoach = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // coach id

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

    // fetching coach by ID
    const coach = await coachRepository.find({
      where: { id: parsedId },
      relations: ["user", "club"],
    });

    if (coach.length === 0) {
      return throwNotFound({
        entity: `Coach with id ${id}`,
        check: true,
        res,
      });
    }

    return res.status(200).json({
      message: "Coach fetched successfully",
      Coach: coach,
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
