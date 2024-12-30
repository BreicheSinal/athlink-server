import { AppDataSource } from "../../db/connection";
import { Connection } from "../../db/entities/Connection";
import { User } from "../../db/entities/User";
import { Chat } from "../../db/entities/Chat";

const connectionRepository = AppDataSource.getRepository(Connection);
const userRepository = AppDataSource.getRepository(User);
const chatRepository = AppDataSource.getRepository(Chat);

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

  connection.status = status;
  return connectionRepository.save(connection);
};

export const getConnectionsService = async (userId: number) => {
  return connectionRepository.find({
    where: [{ user_id: userId }, { connected_user_id: userId }],
    relations: ["user", "connectedUser"],
  });
};

export const getPendingConnectionsService = async (userId: number) => {
  return connectionRepository.find({
    where: {
      connected_user_id: userId,
      status: "pending",
    },
    relations: ["user", "connectedUser"],
  });
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
    return existingChat;
  }

  const chat = new Chat();
  chat.user1 = user1;
  chat.user2 = user2;

  return await chatRepository.save(chat);
};

export const getUserChatsService = async (userId: number) => {
  return await chatRepository.find({
    where: [{ user1: { id: userId } }, { user2: { id: userId } }],
    relations: ["user1", "user2"],
  });
};
