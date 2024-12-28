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

export const getConnections = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    const parsedID = parseInt(userId, 10);
    if (isNaN(parsedID) || parsedID <= 0) {
      return throwError({
        message: `Invalid user ID: ${userId}`,
        res,
        status: 400,
      });
    }

    const connections = await connectionService.getConnectionsService(parsedID);

    if (connections.length === 0) {
      return throwNotFound({
        entity: "Connections",
        res,
      });
    }

    return res.status(201).json({
      message: "Fetched connections successfully",
      connections,
    });
  } catch (error) {
    throwError({
      message: "Failed to fetch connections",
      res,
      status: 500,
      details: error,
    });
  }
};

export const getPendingConnections = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    const parsedID = parseInt(userId, 10);
    if (isNaN(parsedID) || parsedID <= 0) {
      return throwError({
        message: `Invalid user ID: ${userId}`,
        res,
        status: 400,
      });
    }

    const connections = await connectionService.getPendingConnectionsService(
      parsedID
    );

    if (connections.length === 0) {
      return throwNotFound({
        entity: "Pending connections",
        res,
      });
    }

    return res.status(201).json({
      message: "Fetched pending connections successfully",
      connections,
    });
  } catch (error) {
    throwError({
      message: "Failed to fetch pending connections",
      res,
      status: 500,
      details: error,
    });
  }
};

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string;
    const { currentUserId } = req.params;

    const parsedId = parseInt(currentUserId, 10);
    if (isNaN(parsedId) || parsedId <= 0) {
      return throwError({
        message: `Invalid entity_id: ${currentUserId}`,
        res,
        status: 400,
      });
    }

    if (!search) {
      return res.status(400).json({
        status: "error",
        message: "Search query is required",
      });
    }

    const users = await connectionService.searchUsersService(search, parsedId);

    return res.status(200).json({
      status: "success",
      users,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};
