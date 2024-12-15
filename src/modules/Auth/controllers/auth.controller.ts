import { AppDataSource } from "../../../db/connection";
import { User } from "../../../entities/User";
import { Role } from "../../../entities/Role";
import { UserRole } from "../../../entities/UserRole";
import { throwError, throwNotFound } from "../../../utils/error";

const userRepository = AppDataSource.getRepository(User);
const roleRepository = AppDataSource.getRepository(Role);
const userRoleRepository = AppDataSource.getRepository(UserRole);

export const Regist = async (req: any, res: any) => {
  try {
    const { name, email, password, bio, roles } = req.body;

    // validating input
    if (!name || !email || !password || !roles) {
      return throwError({
        message: "Missing required fields",
        res,
        status: 400,
      });
    }
  } catch {}
};
