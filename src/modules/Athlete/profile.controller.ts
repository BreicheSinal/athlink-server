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
    const entity_id = parseInt(req.params.entity_id, 10);
    const { name, description, category, federation_id } = req.body;

    // validating federation id
    if (
      !federation_id ||
      typeof federation_id !== "number" ||
      federation_id <= 0
    )
      return throwError({
        message: "Federation id must be a valid number",
        res,
        status: 400,
      });

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

    // validating entity id
    if (isNaN(entity_id)) {
      return throwNotFound({
        entity: `Invalid entity_id: ${req.params.entity_id}`,
        check: true,
        res,
      });
    }

    // validating name
    if (!name || typeof name !== "string" || name.trim() === "")
      return throwError({
        message: "Name must be non empty text",
        res,
        status: 400,
      });

    // validating description
    if (!description || typeof description !== "string")
      return throwError({
        message: "Description must be non empty text",
        res,
        status: 400,
      });

    // validating category
    const categories = ["athlete", "coach", "club"];
    if (!categories.includes(category))
      return throwError({
        message:
          "Invalid category. It must be one of 'athlete', 'coach', or 'club'.",
        res,
        status: 400,
      });

    // creating trophy object
    const trophy = new Trophy();
    trophy.name = name;
    trophy.description = description;
    trophy.category = category;
    trophy.entity_id = entity_id;
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
    const user_id = parseInt(req.params.user_id, 10);
    const { name, type, date, description } = req.body;

    // validating user id
    if (!user_id || typeof user_id !== "number" || user_id <= 0)
      return throwError({
        message: "User id must be a valid number",
        res,
        status: 400,
      });

    const user = await userRepository.findOne({ where: { id: user_id } });

    if (!user) {
      return throwNotFound({
        entity: `Federation with id ${user}`,
        check: true,
        res,
      });
    }

    // validating name
    if (!name || typeof name !== "string" || name.trim() === "")
      return throwError({
        message: "Name must be non empty text",
        res,
        status: 400,
      });

    // validating type
    const types = ["experience", "certification"];
    if (!types.includes(type))
      return throwError({
        message: "Invalid type. It must be 'experience' or 'certification'.",
        res,
        status: 400,
      });
    /*
    // validating date
    if (!validateDate(date)) {
      return throwError({
        message: "Invalid date format",
        res,
        status: 400,
      });
    }*/

    // validating description
    if (description && typeof description !== "string")
      return throwError({
        message: "Description must be non empty text",
        res,
        status: 400,
      });

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
