import { AppDataSource } from "../../db/connection";
import { Athlete } from "../../db/entities/Athlete";
import { Club } from "../../db/entities/Club";
import { User } from "../../db/entities/User";
import { Federation } from "../../db/entities/Federation";
import { ExperienceCertification } from "../../db/entities/ExperienceCertification";
import { AthleteTryOutApplication } from "../../db/entities/AthleteTryOutApplication ";
import {
  EditProfileInput,
  EditBioInput,
  AddTrophyInput,
} from "../../utils/schemas/generalSchema";

const athleteTrRepo = AppDataSource.getRepository(AthleteTryOutApplication);
const athleteRepository = AppDataSource.getRepository(Athlete);
const clubRepository = AppDataSource.getRepository(Club);
const userRepository = AppDataSource.getRepository(User);
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
    select: {
      id: true,
      name: true,
      type: false,
      date: true,
      description: true,
      created_at: false,
      updated_at: false,
    },
  });

  const atheleteTr = await athleteTrRepo.find({
    where: {
      athlete: { id: id },
    },
    relations: {
      tryOut: {
        club: {
          user: true,
        },
      },
    },
    select: {
      id: true,
      status: true,
      tryOut: {
        id: true,
        name: true,
        date: true,
        description: true,
        meetingUrl: true,
      },
    },
  });

  const formattedAthleteTr = atheleteTr.map((tr) => {
    return {
      id: tr.id,
      status: tr.status,
      trId: tr.tryOut.id,
      name: tr.tryOut.name,
      date: tr.tryOut.date,
      description: tr.tryOut.description,
      meetingUrl: tr.tryOut.meetingUrl,
      club_id: tr.tryOut.club.id,
      club_name: tr.tryOut.club.user.name,
      club_user_id: tr.tryOut.club.user.id,
    };
  });

  return {
    athlete,
    experience: athleteExp,
    tryOuts: formattedAthleteTr,
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

export const applyTryOutService = async (
  athleteId: number,
  tryoutId: number
) => {
  const newTryOut = athleteTrRepo.create({
    athlete: { id: athleteId },
    tryOut: { id: tryoutId },
    status: "pending",
  });

  const savedTryOut = await athleteTrRepo.save(newTryOut);

  const completeData = await athleteTrRepo.findOne({
    where: { id: savedTryOut.id },
    relations: {
      tryOut: {
        club: {
          user: true,
        },
      },
    },
  });

  if (!completeData) {
    throw new Error("Failed to load complete tryout data");
  }

  const createdTryOut = {
    id: savedTryOut.id,
    status: completeData.status,
    trId: completeData.tryOut.id.toString(),
    name: completeData.tryOut.name,
    date: completeData.tryOut.date,
    description: completeData.tryOut.description,
    meetingUrl: completeData.tryOut.meetingUrl,
    club_id: completeData.tryOut.club.id,
    club_name: completeData.tryOut.club.user.name,
    club_user_id: completeData.tryOut.club.user.id,
  };

  return {
    createdTryOut,
  };
};
