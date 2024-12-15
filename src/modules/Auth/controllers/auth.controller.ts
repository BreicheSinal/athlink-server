import { AppDataSource } from "../../../db/connection";
import { User } from "../../../entities/User";
import { Role } from "../../../entities/Role";
import { UserRole } from "../../../entities/UserRole";
import { throwError, throwNotFound } from "../../../utils/error";

const userRepository = AppDataSource.getRepository(User);
const roleRepository = AppDataSource.getRepository(Role);
const userRoleRepository = AppDataSource.getRepository(UserRole);

// only alphabetic characters in name
const isValidName = (name: string) => {
  const nameRegex = /^[a-zA-Z\s]+$/;
  return nameRegex.test(name);
};

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

    // additional validation for name
    if (!isValidName(name)) {
      return throwError({
        message: "Name must only contain alphabetic characters",
        res,
        status: 400,
      });
    }
  } catch {}
};
