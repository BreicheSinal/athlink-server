import { Request, Response } from "express";
import { TrophyService } from "./trophy.service";
import { throwError, throwNotFound } from "../../utils/error";

const trophyService = new TrophyService();

export const requestTrophy = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const trophyId = await trophyService.requestTrophy(name, description);

    res.status(201).json({ trophyId });
  } catch (error) {
    console.error(error);

    throwError({
      message: "Failed to request trophy",
      res,
    });
  }
};
