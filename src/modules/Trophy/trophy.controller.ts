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

export const verifyTrophy = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { approved } = req.body;

    await trophyService.verifyTrophy(Number(id), approved);

    res.json({ success: true });
  } catch (error) {
    console.error(error);

    throwError({
      message: "Failed to verify trophy",
      res,
    });
  }
};

export const getTrophyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const numericId = Number(id);
    if (isNaN(numericId) || numericId < 0) {
      throwError({
        message: "Invalid trophy ID",
        res,
        status: 400,
      });
      return;
    }

    const trophy = await trophyService.getTrophyById(numericId);

    if (!trophy) {
      throwNotFound({
        entity: "Trophy",
        res,
      });
      return;
    }

    const serializedTrophy = JSON.parse(
      JSON.stringify(trophy, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.json(serializedTrophy);
  } catch (error) {
    console.error(error);

    throwError({
      message: "Failed to get trophy",
      res,
    });
  }
};
