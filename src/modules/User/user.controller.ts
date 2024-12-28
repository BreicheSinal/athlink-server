import { Request, Response } from "express";
import * as connectionService from "./user.service";
import { throwError, throwNotFound } from "../../utils/error";

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
    });
  }
};

export const updateConnectionStatus = async (req: Request, res: Response) => {
  try {
    const { userId, status } = req.body;
    const connectedUserId = parseInt(req.params.connectedUserId);

    if (!userId || isNaN(userId)) {
      return throwError({
        message: "Invalid user ID provided",
        res,
        status: 400,
      });
    }

    if (!["accepted", "rejected"].includes(status)) {
      return throwError({
        message: 'Invalid status. Must be either "accepted" or "rejected"',
        res,
        status: 400,
        details: { providedStatus: status },
      });
    }

    const connection = await connectionService.updateConnectionStatusService(
      userId,
      connectedUserId,
      status as "accepted" | "rejected"
    );

    if (!connection) {
      return throwNotFound({
        entity: "Connection request",
        res,
      });
    }

    return res.status(200).json({
      message: "Connection status updated successfully",
      connection,
    });
  } catch (error: any) {
    throwError({
      message: error.message,
      res,
      status: 404,
    });
  }
};
