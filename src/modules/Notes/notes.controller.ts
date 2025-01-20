import { Request, Response } from "express";
import { processNotes as processNotesService } from "./notes.service";
import { throwError, throwNotFound } from "../../utils/error";

export const processNotes = async (req: Request, res: Response) => {
  try {
    const { notes, systemPrompt } = req.body;

    if (!notes) {
      throwNotFound({
        entity: "Notes",
        check: true,
        res,
      });
      return;
    }

    const processedNotes = await processNotesService(notes, systemPrompt);

    return res.status(200).json({
      success: true,
      processedNotes,
    });
  } catch (error) {
    console.error("Controller Error:", error);

    throwError({
      message: "Error processing notes",
      res,
      status: 500,
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
