import { AppDataSource } from "../../db/connection";
import { User } from "../../db/entities/User";
import { Club } from "../../db/entities/Club";
import { Coach } from "../../db/entities/Coach";
import {
  EditProfileInput,
  EditBioInput,
} from "../../utils/schemas/generalSchema";

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
