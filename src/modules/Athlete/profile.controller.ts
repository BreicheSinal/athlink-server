import { Request, Response } from "express";

import { AppDataSource } from "../../db/connection";
import { Athlete } from "../../db/entities/Athlete";
import { Club } from "../../db/entities/Club";
import { User } from "../../db/entities/User";
import { Trophy } from "../../db/entities/Trophy";
import { Federation } from "../../db/entities/Federation";
import { ExperienceCertification } from "../../db/entities/ExperienceCertification";

import { throwError, throwNotFound } from "../../utils/error";
import {
  editProfileSchema,
  EditProfileInput,
  editBioSchema,
  EditBioInput,
  addTrophySchema,
  AddTrophyInput,
  addExperienceCertificationSchema,
  AddExperienceCertificationInput,
} from "../../schemas/athleteSchema";

const athleteRepository = AppDataSource.getRepository(Athlete);
const clubRepository = AppDataSource.getRepository(Club);
const userRepository = AppDataSource.getRepository(User);
const trophyRepository = AppDataSource.getRepository(Trophy);
const federationRepository = AppDataSource.getRepository(Federation);
const experienceCertificationRepository = AppDataSource.getRepository(
  ExperienceCertification
);

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

    const { position, age, height, weight, club_id }: EditProfileInput =
      result.data;

    // finding athlete by id
    const athlete = await athleteRepository.findOne({
      where: { id: parsedId },
    });

    if (!athlete) {
      return throwNotFound({
        entity: `Athlete with id ${id}`,
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
      athlete.club = club;
    } else {
      athlete.club = null;
    }

    // updating fields
    athlete.position = position == null ? null : position;
    athlete.age = age == null ? null : age;
    athlete.height = height == null ? null : height;
    athlete.weight = weight === null ? null : weight;

    // saved updated athlete
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

export const addTrophy = async (req: Request, res: Response) => {
  try {
    // taken on user id (case: athlete-coach user | when project is scaled)
    const { entity_id } = req.params;

    const parsedEntityId = parseInt(entity_id, 10);
    if (isNaN(parsedEntityId) || parsedEntityId <= 0) {
      return throwError({
        message: `Invalid entity_id: ${entity_id}`,
        res,
        status: 400,
      });
    }

    // validating body using zod
    const result = addTrophySchema.safeParse(req.body);

    if (!result.success) {
      return throwError({
        message: "Validation error",
        res,
        status: 400,
        details: result.error.format(),
      });
    }

    const { name, description, category, federation_id }: AddTrophyInput =
      result.data;

    // finding federation by id
    const federation = await federationRepository.findOne({
      where: { id: federation_id },
    });

    if (!federation) {
      return throwNotFound({
        entity: `Federation with id ${federation_id}`,
        check: true,
        res,
      });
    }

    // creating trophy object
    const trophy = new Trophy();
    trophy.name = name;
    trophy.description = description;
    trophy.category = category;
    trophy.entity_id = parsedEntityId;
    trophy.federation = federation;
    trophy.verification_status = "pending";

    // saving trophy in db
    const createdTrophy = await trophyRepository.save(trophy);

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

    // validating user id
    const parsedUserId = parseInt(user_id, 10);
    if (isNaN(parsedUserId) || parsedUserId <= 0) {
      return throwError({
        message: "User ID must be a valid positive number",
        res,
        status: 400,
      });
    }
    // validating body based on zod
    const result = addExperienceCertificationSchema.safeParse(req.body);

    if (!result.success) {
      return throwError({
        message: "Validation error",
        res,
        status: 400,
        details: result.error.format(),
      });
    }
    const { name, type, date, description }: AddExperienceCertificationInput =
      result.data;

    const user = await userRepository.findOne({ where: { id: parsedUserId } });

    if (!user) {
      return throwNotFound({
        entity: `User with id ${user}`,
        check: true,
        res,
      });
    }

    // creating experienceCertification object
    const experienceCertification = new ExperienceCertification();
    experienceCertification.user = user;
    experienceCertification.name = name;
    experienceCertification.type = type;
    experienceCertification.date = date;
    experienceCertification.description = description ? description : null;

    // saving object in db
    const createdExperienceCertification =
      await experienceCertificationRepository.save(experienceCertification);

    return res.status(201).json({
      message: "Trophy created successfully",
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
