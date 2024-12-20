import { Request, Response } from "express";

import { AppDataSource } from "../../db/connection";
import { Athlete } from "../../db/entities/Athlete";
import { Club } from "../../db/entities/Club";

import { throwError, throwNotFound } from "../../utils/error";

const athleteRepository = AppDataSource.getRepository(Athlete);
const clubRepository = AppDataSource.getRepository(Club);

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
        height <= 0 ||
        height > 500)
    ) {
      return throwError({
        message: "Weight must be a number ( > 0 || < 500)",
        res,
        status: 400,
      });
    }

    if (club_id && club_id !== null) {
      const club = await clubRepository.findOne({ where: { id: club_id } });

      if (!club) {
        return throwNotFound({
          entity: `Club with id ${club_id}`,
          check: true,
          res,
        });
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
    if (position) athlete.position = position;
    if (age) athlete.age = age;
    if (height) athlete.height = height;
    if (weight) athlete.weight = weight;

    if (club_id === null) {
      athlete.club = null;
    } else {
      const club = await clubRepository.findOne({ where: { id: club_id } });
      athlete.club = club;
    }

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

export const editTrophies = async (req: Request, res: Response) => {
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
