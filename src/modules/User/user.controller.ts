import { Request, Response } from "express";
import * as connectionService from "./user.service";
import { throwError, throwNotFound } from "../../utils/error";
import { addExperienceCertificationSchema } from "../../utils/schemas/generalSchema";

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
    const userId = parseInt(req.params.userId);

    if (isNaN(userId) || userId <= 0) {
      return throwError({
        message: `Invalid user ID: ${userId}`,
        res,
        status: 400,
      });
    }

    const connections = await connectionService.getPendingConnectionsService(
      userId
    );

    if (connections.length === 0) {
      return res.status(204).send();
    }

    return res.status(200).json({
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

export const getAcceptedConnections = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId) || userId <= 0) {
      return throwError({
        message: `Invalid user ID: ${userId}`,
        res,
        status: 400,
      });
    }

    const connections = await connectionService.getAcceptedConnectionsService(
      userId
    );

    if (connections.length === 0) {
      return res.status(204).send();
    }

    return res.status(200).json({
      message: "Fetched accepted connections successfully",
      connections,
    });
  } catch (error) {
    throwError({
      message: "Failed to fetch accepted connections",
      res,
      status: 500,
      details: error,
    });
  }
};

export const getStatusConnection = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    const connectedUserId = parseInt(req.params.connectedUserId);

    const parsedUserID = parseInt(userId as string);

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

    const connection = await connectionService.getStatusConnectionService(
      parsedUserID,
      connectedUserId
    );

    return res.status(200).json({
      message: "Connection status fetched successfully",
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

export const createChat = async (req: Request, res: Response) => {
  try {
    const { user1Id, user2Id } = req.body;

    if (!user1Id || !user2Id) {
      return throwError({
        message: "Both user IDs are required",
        res,
        status: 400,
      });
    }

    const chat = await connectionService.createChatService(user1Id, user2Id);

    if (!chat) {
      return throwNotFound({
        entity: "Chat",
        res,
      });
    }

    res.status(201).json({
      message: "Chat created successfully",
      chat,
    });
  } catch (error: any) {
    throwError({
      message: error.message || "An unexpected error occurred",
      res,
      status: 400,
    });
  }
};

export const getUserChats = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
      return throwError({
        message: "Invalid user ID",
        res,
        status: 400,
      });
    }

    const chats = await connectionService.getUserChatsService(userId);

    if (chats.length === 0) {
      return res.status(200).json({
        message: "No chats found for this user.",
        chats: [],
      });
    }

    res.status(200).json({
      message: "Chats retrieved successfully",
      chats,
    });
  } catch (error: any) {
    throwError({
      message: error.message || "An unexpected error occurred",
      res,
      status: 400,
    });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { chatId, senderId, message } = req.body;

    if (!chatId || !senderId || !message) {
      return throwError({
        message: "chatId, senderId, and message are required fields",
        res,
        status: 400,
      });
    }

    const chatMessage = await connectionService.sendMessageService(
      chatId,
      senderId,
      message
    );

    if (!chatMessage) {
      return throwNotFound({
        entity: "Chat or Sender",
        res,
      });
    }

    res.status(201).json({
      message: "Message sent successfully",
      chatMessage,
    });
  } catch (error: any) {
    throwError({
      message: error.message || "An unexpected error occurred",
      res,
      status: 400,
    });
  }
};

export const getChatMessages = async (req: Request, res: Response) => {
  try {
    const chatID = parseInt(req.query.chatID as string, 10);
    const userId = parseInt(req.query.userId as string, 10);

    console.log(userId, chatID);
    if (isNaN(chatID) || isNaN(userId)) {
      return throwError({
        message: "Invalid chatID provided",
        res,
        status: 400,
      });
    }

    const messages = await connectionService.getChatMessagesService(
      chatID,
      userId
    );

    // Single response with conditional message
    res.status(200).json({
      message: messages?.length
        ? "Chat messages retrieved successfully"
        : "No messages found",
      messages: messages || [],
    });
  } catch (error: any) {
    throwError({
      message: error.message || "An unexpected error occurred",
      res,
      status: 400,
    });
  }
};

export const addExperienceCertification = async (
  req: Request,
  res: Response
) => {
  try {
    const { user_id } = req.params;

    const parsedUserId = parseInt(user_id, 10);
    if (isNaN(parsedUserId) || parsedUserId <= 0) {
      return throwError({
        message: "User ID must be a valid positive number",
        res,
        status: 400,
      });
    }

    const result = addExperienceCertificationSchema.safeParse(req.body);
    if (!result.success) {
      return throwError({
        message: "Validation error",
        res,
        status: 400,
        details: result.error.format(),
      });
    }

    const createdExperienceCertification =
      await connectionService.addExperienceCertificationService(
        parsedUserId,
        result.data
      );

    return res.status(201).json({
      message: `${result.data.type} created successfully`,
      athlete: createdExperienceCertification,
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

export const editExperienceCertification = async (
  req: Request,
  res: Response
) => {
  try {
    const { exp_id } = req.params;

    const parsedExpId = parseInt(exp_id, 10);
    if (isNaN(parsedExpId) || parsedExpId <= 0) {
      return throwError({
        message: "Experience ID must be valid positive numbers",
        res,
        status: 400,
      });
    }

    const result = addExperienceCertificationSchema.safeParse(req.body);
    if (!result.success) {
      return throwError({
        message: "Validation error",
        res,
        status: 400,
        details: result.error.format(),
      });
    }

    const updatedExperience =
      await connectionService.editExperienceCertificationService(
        parsedExpId,
        result.data
      );

    return res.status(200).json({
      message: `${result.data.type} updated successfully`,
      athlete: updatedExperience,
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

export const deleteExperienceCertification = async (
  req: Request,
  res: Response
) => {
  try {
    const { exp_id } = req.params;

    const parsedExpId = parseInt(exp_id, 10);
    if (isNaN(parsedExpId) || parsedExpId <= 0) {
      return throwError({
        message: "Experience ID must be valid positive numbers",
        res,
        status: 400,
      });
    }

    await connectionService.deleteExperienceCertificationService(parsedExpId);

    return res.status(200).json({
      message: "Experience deleted successfully",
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

export const getTryOuts = async (req: Request, res: Response) => {
  try {
    const tryOuts = await connectionService.getTryOutsService();

    if (tryOuts.length === 0) {
      return res.status(204).send();
    }

    res.status(200).json({
      message: "Fetched TryOuts Successfully",
      tryOuts,
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
