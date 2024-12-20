import { Request, Response } from "express";

import { AppDataSource } from "../../db/connection";
import { Athlete } from "../../db/entities/Athlete";
import { Club } from "../../db/entities/Club";
import { User } from "../../db/entities/User";
import { Trophy } from "../../db/entities/Trophy";
import { Federation } from "../../db/entities/Federation";

import { throwError, throwNotFound } from "../../utils/error";

const athleteRepository = AppDataSource.getRepository(Athlete);
const clubRepository = AppDataSource.getRepository(Club);
const userRepository = AppDataSource.getRepository(User);
const trophyRepository = AppDataSource.getRepository(Trophy);
const federationRepository = AppDataSource.getRepository(Federation);

export const editProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { position, age, height, weight, club_id } = req.body;

    // validating ID
    if (!id) {
      return throwError({
        message: "ID required",
        res,
        status: 400,
      });
    }

    if (position == 0 || age == 0 || height == 0 || club_id == 0)
      return throwError({
        message: "Fields cannot be equal to 0",
        res,
        status: 400,
      });

    // validating position
    if (position && typeof position !== "string") {
      return throwError({
        message: "Position must be a string",
        res,
        status: 400,
      });
    }

    // validating age
    if (
      age &&
      (typeof age !== "number" || isNaN(age) || age <= 0 || age > 120)
    ) {
      return throwError({
        message: "Age must be a number ( > 0 || < 300)",
        res,
        status: 400,
      });
    }

    // validating height
    if (
      height &&
      (typeof height !== "number" ||
        isNaN(height) ||
        height <= 0 ||
        height > 300)
    ) {
      return throwError({
        message: "Height must be a number ( > 0 || < 300)",
        res,
        status: 400,
      });
    }

    // validating weight
    if (
      weight &&
      (typeof weight !== "number" ||
        isNaN(weight) ||
        weight <= 0 ||
        weight > 500)
    ) {
      return throwError({
        message: "Weight must be a number ( > 0 || < 500)",
        res,
        status: 400,
      });
    }

    // validating club
    if (club_id) {
      if (typeof club_id !== "number" || isNaN(club_id) || club_id <= 0) {
        return throwError({
          message: "Club id must be a number",
          res,
          status: 400,
        });
      } else if (club_id !== null) {
        const club = await clubRepository.findOne({ where: { id: club_id } });

        if (!club) {
          return throwNotFound({
            entity: `Club with id ${club_id}`,
            check: true,
            res,
          });
        }
      }
    }

    // finding athlete by id
    const athlete = await athleteRepository.findOne({
      where: { id: parseInt(id) },
    });

    if (!athlete) {
      return throwNotFound({
        entity: `Athlete with id ${id}`,
        check: true,
        res,
      });
    }

    // updating fields
    athlete.position = position == null ? null : position;
    athlete.age = age == null ? null : age;
    athlete.height = height == null ? null : height;
    athlete.weight = weight === null ? null : weight;

    athlete.club =
      club_id === null
        ? null
        : await clubRepository.findOne({ where: { id: club_id } });

    const updatedAthlete = await athleteRepository.save(athlete);

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
    const { id } = req.params; //athlete id
    const { bio } = req.body;

    // validating ID
    if (!id)
      return throwError({
        message: "ID required",
        res,
        status: 400,
      });

    // validated bio input
    if (!bio || typeof bio !== "string")
      return throwError({
        message: "Bio must be non empty text",
        res,
        status: 400,
      });

    // finding athlete by id
    const athlete = await athleteRepository.findOne({
      where: { id: parseInt(id) },
      relations: ["user"],
    });

    if (!athlete) {
      return throwNotFound({
        entity: `Athlete with id ${id}`,
        check: true,
        res,
      });
    }

    // updating user bio
    const user = athlete.user;

    if (!user)
      return throwNotFound({
        entity: `User associated with athlete of id ${id} not found`,
        check: true,
        res,
      });

    user.bio = bio;

    const updatedUserBio = await userRepository.save(user);

    return res.status(200).json({
      message: "User bio updated successfully",
      athlete: updatedUserBio,
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
    // taken on user id (case: athlete-coach user | when project is scaled)
    const entity_id = parseInt(req.params.entity_id, 10);
    const { name, description, category, federation_id } = req.body;

    // finding federation by id
    const federation = await federationRepository.findOne({
      where: { id: parseInt(federation_id, 10) },
    });

    if (!federation) {
      return throwNotFound({
        entity: `Federation with id ${federation_id} not found`,
        check: true,
        res,
      });
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

export const editExperience = async (req: Request, res: Response) => {
  try {
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
