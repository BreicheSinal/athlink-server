import { AppDataSource } from "../../db/connection";
import { Connection } from "../../db/entities/Connection";
import { User } from "../../db/entities/User";

const connectionRepository = AppDataSource.getRepository(Connection);
const userRepository = AppDataSource.getRepository(User);

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
    throw new Error("No connection found between the users");
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
