import { Request, Response } from "express";

import { AppDataSource } from "../../db/connection";
import { Athlete } from "../../db/entities/Athlete";

import { throwError, throwNotFound } from "../../utils/error";

const athleteRepository = AppDataSource.getRepository(Athlete);

export const editProfile = async (req: Request, res: Response) => {
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
