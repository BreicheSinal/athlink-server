import { AppDataSource } from "../../db/connection";
import { Connection } from "../../db/entities/Connection";

const connectionRepository = AppDataSource.getRepository(Connection);

export const createConnection = async (
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
