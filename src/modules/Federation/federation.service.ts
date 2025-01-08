import { AppDataSource } from "../../db/connection";
import { User } from "../../db/entities/User";
import { Federation } from "../../db/entities/Federation";
import { Club } from "../../db/entities/Club";
import {
  EditProfileInput,
  EditBioInput,
} from "../../utils/schemas/generalSchema";

const userRepository = AppDataSource.getRepository(User);
const federationRepository = AppDataSource.getRepository(Federation);
const clubRepository = AppDataSource.getRepository(Club);

export const editProfileService = async (
  id: number,
  data: EditProfileInput
) => {
  const federation = await federationRepository.findOne({
    where: { id },
  });

  if (!federation) {
    throw new Error(`Federation with id ${id} not found`);
  }

  federation.location = data.location ?? null;
  federation.country = data.country ?? null;
  federation.founded_year = data.founded_year ?? null;

  return federationRepository.save(federation);
};

export const editBioService = async (id: number, data: EditBioInput) => {
  const federation = await federationRepository.findOne({
    where: { id },
    relations: ["user"],
  });

  if (!federation) {
    throw new Error(`Federation with id ${id} not found`);
  }

  if (!federation.user) {
    throw new Error(`User associated with federation of id ${id} not found`);
  }

  federation.user.bio = data.bio;
  return userRepository.save(federation.user);
};

export const getClubsService = async (federationId: number) => {
  const clubs = await clubRepository.find({
    where: { federation: { id: federationId } },
    relations: ["user"],
    select: {
      id: true,
      user: {
        id: true,
        name: true,
      },
    },
  });

  if (clubs.length === 0) {
    throw new Error(`Clubs with federation id ${federationId} not found`);
  }

  return clubs;
};

export const getFederationsService = async () => {
  const federations = await federationRepository.find({
    relations: ["user"],
    select: {
      id: true,
      user: {
        name: true,
      },
    },
  });

  if (federations.length === 0) {
    throw new Error("Federations not found");
  }

  return federations;
};

export const getFederationService = async (id: number) => {
  const federation = await federationRepository.find({
    where: { id },
    relations: ["user"],
  });

  if (federation.length === 0) {
    throw new Error(`Federation with id ${id} not found`);
  }

  return federation;
};

export const getFederationByUserIDService = async (id: number) => {
  const federation = await federationRepository.find({
    where: { user: { id } },
    relations: ["user"],
  });

  if (federation.length === 0) {
    throw new Error(`Federation with id ${id}`);
  }

  return federation;
};
