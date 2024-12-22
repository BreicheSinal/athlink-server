import { Request, Response } from "express";

import { AppDataSource } from "../../db/connection";

import { User } from "../../db/entities/User";
import { Federation } from "../../db/entities/Federation";
import { Club } from "../../db/entities/Club";

import { throwError, throwNotFound } from "../../utils/error";
import {
  editProfileSchema,
  EditProfileInput,
  editBioSchema,
  EditBioInput,
} from "../../schemas/generalSchema";

const userRepository = AppDataSource.getRepository(User);
const federationRepository = AppDataSource.getRepository(Federation);
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

    const { location, founded_year, country }: EditProfileInput = result.data;

    // finding federation by id
    const federation = await federationRepository.findOne({
      where: { id: parsedId },
    });

    if (!federation) {
      return throwNotFound({
        entity: `Federation with id ${id}`,
        check: true,
        res,
      });
    }

    // updating fields
    federation.location = location == null ? null : location;
    federation.country = country == null ? null : country;
    federation.founded_year = founded_year == null ? null : founded_year;

    // saved updated federation
    const updatedFederation = await federationRepository.save(federation);

    return res.status(200).json({
      message: "Federation updated successfully",
      athlete: updatedFederation,
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
    const { id } = req.params; //federation id

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

    // finding federation by id
    const federation = await federationRepository.findOne({
      where: { id: parseInt(id) },
      relations: ["user"],
    });

    if (!federation) {
      return throwNotFound({
        entity: `Federation with id ${id}`,
        check: true,
        res,
      });
    }

    // updating user bio
    const user = federation.user;

    if (!user)
      return throwNotFound({
        entity: `User associated with federation of id ${id} not found`,
        check: true,
        res,
      });

    user.bio = bio;

    const updatedUserBio = await userRepository.save(user);

    return res.status(200).json({
      message: "Federation bio updated successfully",
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

export const getClubs = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // federation id

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

    // fetching clubs having same federation id
    const clubs = await clubRepository.find({
      where: { federation: { id: parsedId } },
    });

    if (clubs.length === 0) {
      return throwNotFound({
        entity: `Clubs with federation id ${id}`,
        check: true,
        res,
      });
    }

    return res.status(200).json({
      message: "Clubs fetched successfully",
      clubs: clubs,
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
