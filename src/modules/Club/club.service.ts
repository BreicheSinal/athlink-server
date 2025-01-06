import { AppDataSource } from "../../db/connection";
import { User } from "../../db/entities/User";
import { Club } from "../../db/entities/Club";
import { Coach } from "../../db/entities/Coach";
import { TryOut } from "../../db/entities/TryOut";
import {
  EditProfileInput,
  EditBioInput,
  AddTryoutInput,
} from "../../utils/schemas/generalSchema";
import { Trophy } from "../../db/entities/Trophy";
import { describe } from "node:test";

const clubRepository = AppDataSource.getRepository(Club);
const userRepository = AppDataSource.getRepository(User);
const coachRepository = AppDataSource.getRepository(Coach);

export const editProfileService = async (
  id: number,
  data: EditProfileInput
) => {
  const club = await clubRepository.findOne({
    where: { id },
  });

  if (!club) {
    throw new Error(`Club with id ${id} not found`);
  }

  club.location = data.location ?? null;
  club.founded_year = data.founded_year ?? null;

  return clubRepository.save(club);
};

export const editBioService = async (id: number, data: EditBioInput) => {
  const club = await clubRepository.findOne({
    where: { id },
    relations: ["user"],
  });

  if (!club) {
    throw new Error(`Club with id ${id} not found`);
  }

  if (!club.user) {
    throw new Error(`User associated with club of id ${id} not found`);
  }

  club.user.bio = data.bio;
  return userRepository.save(club.user);
};

export const getStaffService = async (id: number) => {
  const staff = await coachRepository.find({
    where: { club: { id } },
  });

  if (staff.length === 0) {
    throw new Error(`Staff with club id ${id} not found`);
  }

  return staff;
};

export const getClubService = async (id: number) => {
  const club = await clubRepository.find({
    where: { id },
    relations: ["user", "federation", "federation.user"],
  });

  if (club.length === 0) {
    throw new Error(`Club with id ${id} not found`);
  }

  const tryOutRepository = AppDataSource.getRepository(TryOut);

  const clubTr = await tryOutRepository.find({
    where: {
      club: { id },
    },
    order: {
      name: "ASC",
    },
    select: {
      id: true,
      name: true,
      date: true,
      description: true,
    },
  });

  return {
    club,
    tryOuts: clubTr,
  };
};

export const getClubByUserIDService = async (id: number) => {
  const club = await clubRepository.find({
    where: { user: { id } },
    relations: ["user", "federation", "federation.user"],
  });

  if (club.length === 0) {
    throw new Error(`Club with id ${id} not found`);
  }

  return club;
};

export const getClubsService = async () => {
  const clubs = await clubRepository.find({
    relations: ["user"],
  });

  if (clubs.length === 0) {
    throw new Error("No clubs found");
  }

  return clubs;
};

export const addTryOutService = async (
  clubId: number,
  data: AddTryoutInput
) => {
  const tryOutRepository = AppDataSource.getRepository(TryOut);

  const newTryOut = tryOutRepository.create({
    name: data.name,
    date: data.date,
    description: data.description,
    club: { id: clubId } as Club,
  });

  const savedTryOut = await tryOutRepository.save(newTryOut);

  return tryOutRepository.findOne({
    where: { id: savedTryOut.id },
    relations: ["club"],
  });
};
