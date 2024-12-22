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

export const editProfile = async (req: Request, res: Response) => {};

export const editBio = async (req: Request, res: Response) => {};

export const getClubs = async (req: Request, res: Response) => {};
