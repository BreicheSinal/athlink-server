import { AppDataSource } from "../../db/connection";
import { Connection } from "../../db/entities/Connection";
import { User } from "../../db/entities/User";
import { Chat } from "../../db/entities/Chat";
import { ChatMessage } from "../../db/entities/ChatMessage";
import { ExperienceCertification } from "../../db/entities/ExperienceCertification";
import { TryOut } from "../../db/entities/TryOut";
import { AddExperienceCertificationInput } from "../../utils/schemas/generalSchema";

const tryOutRepository = AppDataSource.getRepository(TryOut);
const connectionRepository = AppDataSource.getRepository(Connection);
const userRepository = AppDataSource.getRepository(User);
const chatRepository = AppDataSource.getRepository(Chat);
const messageRepository = AppDataSource.getRepository(ChatMessage);
const experienceCertificationRepository = AppDataSource.getRepository(
  ExperienceCertification
);

export const createConnectionService = async (
  userId: number,
  connectedUserId: number
) => {
  if (userId === connectedUserId) {
    throw new Error("Cannot connect with yourself");
  }

  const existingConnection = await connectionRepository.findOne({
    where: [
      { user_id: userId, connected_user_id: connectedUserId },
      { user_id: connectedUserId, connected_user_id: userId },
    ],
  });

  if (existingConnection) {
    throw new Error("Connection already exists");
  }

  const connection = connectionRepository.create({
    user_id: userId,
    connected_user_id: connectedUserId,
    status: "pending",
  });

  return connectionRepository.save(connection);
};

export const updateConnectionStatusService = async (
  userId: number,
  connectedUserId: number,
  status: "accepted" | "rejected"
) => {
  const connection = await connectionRepository.findOne({
    where: {
      user_id: userId,
      connected_user_id: connectedUserId,
      status: "pending",
    },
  });

  if (!connection) {
    throw new Error("Connection request not found");
  }

  if (status === "rejected") {
    return connectionRepository.remove(connection);
  } else {
    connection.status = status;
    return connectionRepository.save(connection);
  }
};

export const getConnectionsService = async (userId: number) => {
  return connectionRepository.find({
    where: [{ user_id: userId }, { connected_user_id: userId }],
    relations: ["user", "connectedUser"],
  });
};

export const getPendingConnectionsService = async (userId: number) => {
  const connections = await connectionRepository.find({
    where: {
      connected_user_id: userId,
      status: "pending",
    },
    relations: ["user", "connectedUser"],
  });

  return connections.map(({ user }) => ({
    user: { id: user.id, name: user.name },
  }));
};

export const getAcceptedConnectionsService = async (userId: number) => {
  const connections = await connectionRepository.find({
    where: [
      { user_id: userId, status: "accepted" },
      { connected_user_id: userId, status: "accepted" },
    ],
    relations: {
      user: {
        userRoles: {
          role: true,
        },
      },
      connectedUser: {
        userRoles: {
          role: true,
        },
      },
    },
    order: {
      created_at: "DESC",
    },
  });

  return connections.map((connection) => ({
    status: connection.status,
    user: {
      id: connection.user.id,
      name: connection.user.name,
      role: connection.user.userRoles[0]?.role?.role_name || "",
    },
    connectedUser: {
      id: connection.connectedUser.id,
      name: connection.connectedUser.name,
      role: connection.connectedUser.userRoles[0]?.role?.role_name || "",
    },
  }));
};

export const getStatusConnectionService = async (
  userId: number,
  connectedUserId: number
) => {
  if (userId === connectedUserId) {
    throw new Error("Cannot check connection status with yourself");
  }

  const existingConnection = await connectionRepository.findOne({
    where: [
      { user_id: userId, connected_user_id: connectedUserId },
      { user_id: connectedUserId, connected_user_id: userId },
    ],
  });

  if (!existingConnection) {
    return {
      message: "No connection found between the users",
    };
  }

  return { status: existingConnection.status };
};

export const searchUsersService = async (
  search: string,
  currentUserId: number
) => {
  if (!search) {
    return [];
  }

  const users = await userRepository
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.userRoles", "userRoles")
    .leftJoinAndSelect("userRoles.role", "role")
    .select(["user.id", "user.name", "userRoles.id", "role.role_name"])
    .where("LOWER(user.name) LIKE LOWER(:search)", { search: `%${search}%` })
    .andWhere("user.id != :currentUserId", { currentUserId })
    .take(10)
    .getMany();

  return users.map((user: User) => ({
    id: user.id,
    name: user.name,
    role: user.userRoles[0]?.role?.role_name || "",
  }));
};

export const createChatService = async (user1Id: number, user2Id: number) => {
  const user1 = await userRepository.findOneBy({ id: user1Id });
  const user2 = await userRepository.findOneBy({ id: user2Id });

  if (!user1 || !user2) {
    throw new Error("One or both users not found");
  }

  const existingChat = await chatRepository.findOne({
    where: [
      { user1: { id: user1Id }, user2: { id: user2Id } },
      { user1: { id: user2Id }, user2: { id: user1Id } },
    ],
  });

  if (existingChat) {
    return { AlreadyExists: existingChat };
  }

  const chat = new Chat();
  chat.user1 = user1;
  chat.user2 = user2;

  return await chatRepository.save(chat);
};

export const getUserChatsService = async (userId: number) => {
  const chats = await chatRepository.find({
    where: [{ user1: { id: userId } }, { user2: { id: userId } }],
    relations: ["user1", "user2"],
  });

  const otherUsers = chats.map((chat) => {
    if (chat.user1.id == userId) {
      return { chatID: chat.id, id: chat.user2.id, name: chat.user2.name };
    } else {
      return { chatID: chat.id, id: chat.user1.id, name: chat.user1.name };
    }
  });

  return otherUsers;
};

export const sendMessageService = async (
  chatId: number,
  senderId: number,
  message: string
) => {
  const chat = await chatRepository.findOneBy({ id: chatId });
  const sender = await userRepository.findOneBy({ id: senderId });

  if (!chat || !sender) {
    throw new Error("Chat or sender not found");
  }

  const chatMessage = new ChatMessage();
  chatMessage.chat = chat;
  chatMessage.sender = sender;
  chatMessage.message = message;

  return await messageRepository.save(chatMessage);
};

export const getChatMessagesService = async (
  chatId: number,
  userId: number
) => {
  const messages = await messageRepository.find({
    where: { chat: { id: chatId } },
    relations: ["sender", "chat", "chat.user1", "chat.user2"],
    order: { created_at: "ASC" },
  });

  const formattedMessages = messages.map((message) => {
    const receiverId =
      message.sender.id === message.chat.user1.id
        ? message.chat.user2.id
        : message.chat.user1.id;

    return {
      id: message.id,
      senderId: message.sender.id,
      receiverId: receiverId,
      content: message.message,
      chatID: chatId,
      timestamp: message.created_at.toISOString(),
    };
  });

  return formattedMessages;
};

export const addExperienceCertificationService = async (
  userId: number,
  data: AddExperienceCertificationInput
) => {
  const user = await userRepository.findOne({ where: { id: userId } });

  if (!user) {
    throw new Error(`User with id ${userId} not found`);
  }

  const experienceCertification = new ExperienceCertification();
  experienceCertification.user = user;
  experienceCertification.name = data.name;
  experienceCertification.type = data.type;
  experienceCertification.date = data.date;
  experienceCertification.description = data.description ?? null;

  return experienceCertificationRepository.save(experienceCertification);
};

export const editExperienceCertificationService = async (
  expId: number,
  data: AddExperienceCertificationInput
) => {
  const experienceCertification =
    await experienceCertificationRepository.findOne({
      where: { id: expId },
    });

  if (!experienceCertification) {
    throw new Error(`Experience with id ${expId} not found`);
  }

  experienceCertification.name = data.name;
  experienceCertification.type = data.type;
  experienceCertification.date = data.date;
  experienceCertification.description = data.description ?? null;

  return experienceCertificationRepository.save(experienceCertification);
};

export const deleteExperienceCertificationService = async (expId: number) => {
  const experienceCertification =
    await experienceCertificationRepository.findOne({
      where: { id: expId },
    });

  if (!experienceCertification) {
    throw new Error(`Experience with id ${expId} not found`);
  }

  await experienceCertificationRepository.remove(experienceCertification);
  return true;
};

export const getTryOutsService = async () => {
  const tryOuts = await tryOutRepository.find({
    relations: ["club", "club.user"],
    select: {
      id: true,
      name: true,
      date: true,
      description: true,
      meetingUrl: true,
      club: {
        id: true,
        user: {
          id: true,
          name: true,
        },
      },
    },
  });

  const formattedTryOuts = tryOuts.map((tryout) => ({
    id: tryout.id,
    name: tryout.name,
    date: tryout.date,
    description: tryout.description,
    meetingUrl: tryout.meetingUrl,
    club_id: tryout.club.id,
    club_user_id: tryout.club.user.id,
    club_name: tryout.club.user.name,
  }));

  return formattedTryOuts;
};
