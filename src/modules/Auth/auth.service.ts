import { AppDataSource } from "../../db/connection";
import { User } from "../../db/entities/User";
import { Role } from "../../db/entities/Role";
import { UserRole } from "../../db/entities/UserRole";
import { Athlete } from "../../db/entities/Athlete";
import { Club } from "../../db/entities/Club";
import { Federation } from "../../db/entities/Federation";
import { Coach } from "../../db/entities/Coach";
import { RegisterInput, LoginInput } from "../../utils/schemas/authSchema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const userRepository = AppDataSource.getRepository(User);
const roleRepository = AppDataSource.getRepository(Role);
const userRoleRepository = AppDataSource.getRepository(UserRole);
const athleteRepository = AppDataSource.getRepository(Athlete);
const clubRepository = AppDataSource.getRepository(Club);
const federationRepository = AppDataSource.getRepository(Federation);
const coachRepository = AppDataSource.getRepository(Coach);

export const registerService = async ({
  name,
  email,
  password,
  roles,
}: RegisterInput) => {
  // Check if user exists
  const existingUser = await userRepository.findOne({
    where: [{ email }, { name }],
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  // Create user
  const user = new User();
  user.name = name;
  user.email = email;
  user.password = hashed;

  const savedUser = await userRepository.save(user);

  // Handle roles
  if (roles && roles.length > 0) {
    await Promise.all(
      roles.map(async (roleId: number) => {
        const role = await roleRepository.findOne({
          where: { id: roleId },
        });

        if (!role) {
          throw new Error(`Role with id ${roleId} not found`);
        }

        const userRole = new UserRole();
        userRole.user = savedUser;
        userRole.role = role;

        await userRoleRepository.save(userRole);

        // Create specific role records
        switch (role.role_name.toLowerCase()) {
          case "athlete":
            const athlete = new Athlete();
            athlete.user = savedUser;
            await athleteRepository.save(athlete);
            break;
          case "coach":
            const coach = new Coach();
            coach.user = savedUser;
            await coachRepository.save(coach);
            break;
          case "club":
            const club = new Club();
            club.user = savedUser;
            await clubRepository.save(club);
            break;
          case "federation":
            const federation = new Federation();
            federation.user = savedUser;
            await federationRepository.save(federation);
            break;
        }
      })
    );
  }

  // Generate JWT
  const token = jwt.sign(
    { id: savedUser.id, email: savedUser.email, roles },
    JWT_SECRET!,
    { expiresIn: "1h" }
  );

  const { password: _, ...userWithoutPass } = savedUser;
  return { user: userWithoutPass, token };
};

export const loginService = async ({ email, password }: LoginInput) => {
  const user = await userRepository.findOne({
    where: { email },
    select: ["id", "name", "email", "password"],
    relations: ["userRoles.role"],
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const roles = user.userRoles.map((userRole) => userRole.role.role_name);

  // Get specific role ID
  const roleRepoMap: Record<
    string,
    | typeof athleteRepository
    | typeof coachRepository
    | typeof clubRepository
    | typeof federationRepository
  > = {
    Athlete: athleteRepository,
    Coach: coachRepository,
    Club: clubRepository,
    Federation: federationRepository,
  };

  let specificRoleId: number | null = null;

  for (const role of roles) {
    const repository = roleRepoMap[role];
    if (repository) {
      const record = await repository.findOne({
        where: { user: { id: user.id } },
      });
      specificRoleId = record?.id || null;
      break;
    }
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, email: user.email, roles },
    JWT_SECRET!,
    {
      expiresIn: "1h",
    }
  );

  const { password: _, ...userWithoutPassword } = user;
  return { user: { ...userWithoutPassword, specificRoleId }, token };
};
