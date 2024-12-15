import { AppDataSource } from "../../../db/connection";
import { User } from "../../../entities/User";
import { Role } from "../../../entities/Role";
import { UserRole } from "../../../entities/UserRole";

const userRepository = AppDataSource.getRepository(User);
const roleRepository = AppDataSource.getRepository(Role);
const userRoleRepository = AppDataSource.getRepository(UserRole);

export const Regist = async (req: any, res: any) => {};
