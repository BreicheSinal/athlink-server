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

export const editProfile = async (req: Request, res: Response) => {};

export const editBio = async (req: Request, res: Response) => {};
