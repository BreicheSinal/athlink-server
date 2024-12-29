import { AppDataSource } from "../../db/connection";
import { Athlete } from "../../db/entities/Athlete";
import { Club } from "../../db/entities/Club";
import { User } from "../../db/entities/User";
import { Trophy } from "../../db/entities/Trophy";
import { Federation } from "../../db/entities/Federation";
import { ExperienceCertification } from "../../db/entities/ExperienceCertification";
import {
  EditProfileInput,
  EditBioInput,
  AddTrophyInput,
  AddExperienceCertificationInput,
} from "../../utils/schemas/generalSchema";

const athleteRepository = AppDataSource.getRepository(Athlete);
const clubRepository = AppDataSource.getRepository(Club);
const userRepository = AppDataSource.getRepository(User);
const trophyRepository = AppDataSource.getRepository(Trophy);
const federationRepository = AppDataSource.getRepository(Federation);
const experienceCertificationRepository = AppDataSource.getRepository(
  ExperienceCertification
);

export const editProfileService = async (
  id: number,
  data: EditProfileInput
) => {
  const athlete = await athleteRepository.findOne({
    where: { id },
  });

  if (!athlete) {
    throw new Error(`Athlete with id ${id} not found`);
  }

  if (data.club_id !== null && data.club_id !== undefined) {
    const club = await clubRepository.findOne({ where: { id: data.club_id } });
    if (!club) {
      throw new Error(`Club with id ${data.club_id} not found`);
    }
    athlete.club = club;
  } else {
    athlete.club = null;
  }

  athlete.position = data.position ?? null;
  athlete.age = data.age ?? null;
  athlete.height = data.height ?? null;
  athlete.weight = data.weight ?? null;

  return athleteRepository.save(athlete);
};

export const editBioService = async (id: number, data: EditBioInput) => {
  const athlete = await athleteRepository.findOne({
    where: { id },
    relations: ["user"],
  });

  if (!athlete) {
    throw new Error(`Athlete with id ${id} not found`);
  }

  if (!athlete.user) {
    throw new Error(`User associated with athlete of id ${id} not found`);
  }

  athlete.user.bio = data.bio;
  return userRepository.save(athlete.user);
};

export const addTrophyService = async (
  entityId: number,
  data: AddTrophyInput
) => {
  const federation = await federationRepository.findOne({
    where: { id: data.federation_id },
  });

  if (!federation) {
    throw new Error(`Federation with id ${data.federation_id} not found`);
  }

  const trophy = new Trophy();
  trophy.name = data.name;
  trophy.description = data.description;
  trophy.category = data.category;
  trophy.entity_id = entityId;
  trophy.federation = federation;
  trophy.verification_status = "pending";

  return trophyRepository.save(trophy);
};

export const addExperienceCertificationService = async (
  userId: number,
  data: AddExperienceCertificationInput
) => {
  const user = await userRepository.findOne({ where: { id: userId } });

  if (!user) {
    throw new Error(`User with id ${userId} not found`);
  }

  const experienceCertification = new ExperienceCertification();
  experienceCertification.user = user;
  experienceCertification.name = data.name;
  experienceCertification.type = data.type;
  experienceCertification.date = data.date;
  experienceCertification.description = data.description ?? null;

  return experienceCertificationRepository.save(experienceCertification);
};

export const editExperienceCertificationService = async (
  expId: number,
  data: AddExperienceCertificationInput
) => {
  const experienceCertification =
    await experienceCertificationRepository.findOne({
      where: { id: expId },
    });

  if (!experienceCertification) {
    throw new Error(`Experience with id ${expId} not found`);
  }

  experienceCertification.name = data.name;
  experienceCertification.type = data.type;
  experienceCertification.date = data.date;
  experienceCertification.description = data.description ?? null;

  return experienceCertificationRepository.save(experienceCertification);
};

export const deleteExperienceCertificationService = async (expId: number) => {
  const experienceCertification =
    await experienceCertificationRepository.findOne({
      where: { id: expId },
    });

  if (!experienceCertification) {
    throw new Error(`Experience with id ${expId} not found`);
  }

  await experienceCertificationRepository.remove(experienceCertification);
  return true;
};

export const getAthleteService = async (id: number) => {
  const athlete = await athleteRepository.find({
    where: { id },
    relations: ["user", "club", "club.user"],
  });

  if (athlete.length === 0) {
    throw new Error(`Athlete with id ${id} not found`);
  }

  const athleteExp = await experienceCertificationRepository.find({
    where: {
      user: { id: athlete[0].user.id },
      type: "experience",
    },
    order: {
      name: "ASC",
    },
  });

  return {
    athlete,
    experience: athleteExp,
  };
};

export const getAthleteByUserIDService = async (id: number) => {
  const athlete = await athleteRepository.find({
    where: { user: { id } },
    relations: ["user", "club", "club.user"],
  });

  if (athlete.length === 0) {
    throw new Error(`Athlete with id ${id} not found`);
  }

  const athleteExp = await experienceCertificationRepository.find({
    where: {
      user: { id: athlete[0].user.id },
      type: "experience",
    },
    order: {
      name: "ASC",
    },
  });

  return {
    athlete,
    experience: athleteExp,
  };
};