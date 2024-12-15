import { AppDataSource } from "../../../db/connection";
import { User } from "../../../entities/User";
import { Role } from "../../../entities/Role";
import { UserRole } from "../../../entities/UserRole";
import { throwError, throwNotFound } from "../../../utils/error";
import bcrypt from "bcryptjs";

const userRepository = AppDataSource.getRepository(User);
const roleRepository = AppDataSource.getRepository(Role);
const userRoleRepository = AppDataSource.getRepository(UserRole);

// only alphabetic characters in name
const isValidName = (name: string) => {
  const nameRegex = /^[a-zA-Z\s]+$/;
  return nameRegex.test(name);
};

// email form validation
const isValidEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
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

    // additional validation for email
    if (!isValidEmail(email)) {
      return throwError({
        message: "Invalid email format",
        res,
        status: 400,
      });
    }

    // checking if user already exists
    const existingUser = await userRepository.findOne({
      where: [{ email }, { name }],
    });

    if (existingUser) {
      return throwError({
        message: "User already exists",
        res,
        status: 409,
      });
    }

    // hashing password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // creating user
    const user = new User();
    user.name = name;
    user.email = email;
    user.password = hashed;
    user.bio = bio;

    // saved user
    const savedUser = await userRepository.save(user);

    // handling roles
    if (roles && roles.length > 0) {
      await Promise.all(
        roles.map(async (roleId: number) => {
          const role = await roleRepository.findOne({
            where: { id: roleId },
          });

          if (!role) {
            return throwNotFound({
              entity: `Role with id ${roleId}`,
              check: true,
              res,
            });
          }

          const userRole = new UserRole();
          userRole.user = savedUser;
          userRole.role = role;

          return userRoleRepository.save(userRole);
        })
      );
    }
  } catch {}
};
