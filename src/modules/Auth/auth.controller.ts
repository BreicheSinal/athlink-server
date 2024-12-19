import { Request, Response } from "express";

import { AppDataSource } from "../../db/connection";
import { User } from "../../db/entities/User";
import { Role } from "../../db/entities/Role";
import { UserRole } from "../../db/entities/UserRole";
import { Athlete } from "../../db/entities/Athlete";
import { Club } from "../../db/entities/Club";
import { throwError, throwNotFound } from "../../utils/error";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const userRepository = AppDataSource.getRepository(User);
const roleRepository = AppDataSource.getRepository(Role);
const userRoleRepository = AppDataSource.getRepository(UserRole);
const athleteRepository = AppDataSource.getRepository(Athlete);
const clubRepository = AppDataSource.getRepository(Club);

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

dotenv.config();

// jwt_secret from env
const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, roles } = req.body;

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

          await userRoleRepository.save(userRole);

          // role is athlete - create an athlete record
          if (role.role_name.toLocaleLowerCase() === "athlete") {
            const athlete = new Athlete();
            athlete.user = savedUser;

            await athleteRepository.save(athlete);
          }
          // role is club - create a club record
          else if (role.role_name.toLowerCase() === "club") {
            const club = new Club();
            club.user = savedUser;

            await clubRepository.save(club);
          }
        })
      );
    }

    // generating JWT
    const token = jwt.sign(
      { id: savedUser.id, email: savedUser.email, roles },
      JWT_SECRET!,
      { expiresIn: "1h" }
    );

    // removing password before sending response
    const { password: _, ...userWithoutPass } = savedUser;

    return res.status(201).json({
      user: userWithoutPass,
      token,
      message: "User registered successfully",
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

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // validating input
    if (!email || !password) {
      return throwError({
        message: "Email and password are required",
        res,
        status: 400,
      });
    }

    // finding user with roles
    const user = await userRepository.findOne({
      where: { email },
      select: ["id", "name", "email", "password"],
      relations: ["userRoles", "userRoles.role"],
    });

    if (!user) {
      return throwError({
        message: "Invalid email or password",
        res,
        status: 401,
      });
    }

    // verifying password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return throwError({
        message: "Invalid email or password",
        res,
        status: 401,
      });
    }

    // extracting (explicitly to include them in res)user roles
    const roles = user.userRoles.map((userRole) => userRole.role.role_name);

    // generating JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, roles },
      JWT_SECRET!,
      { expiresIn: "1h" }
    );

    // removing password before sending response
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      message: "Login successful",
      user: { ...userWithoutPassword, roles },
      token,
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
