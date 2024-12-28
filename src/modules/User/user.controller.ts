import { Request, Response } from "express";
import * as connectionService from "./user.service";
import { throwError } from "../../utils/error";

export const createConnection = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const connectedUserId = parseInt(req.params.connectedUserId);

    if (!userId) {
      return throwError({
        message: "User not authenticated",
        res,
        status: 401,
      });
    }

    if (isNaN(connectedUserId)) {
      return throwError({
        message: "Invalid user ID provided",
        res,
        status: 400,
      });
    }

    const connection = await connectionService.createConnectionService(
      userId,
      connectedUserId
    );

    return res.status(200).json({
      message: "Connection made successfully",
      connection,
    });
  } catch (error: any) {
    throwError({
      message: error.message,
      res,
      status: 400,
      details: error,
    });
  }
};
