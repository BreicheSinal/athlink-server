import { AppDataSource } from "../../db/connection";
import { User } from "../../db/entities/User";
import { Club } from "../../db/entities/Club";
import { Coach } from "../../db/entities/Coach";
import { TryOut } from "../../db/entities/TryOut";
import { Federation } from "../../db/entities/Federation";
import {
  EditProfileInput,
  EditBioInput,
  AddTryoutInput,
} from "../../utils/schemas/generalSchema";

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const clubRepository = AppDataSource.getRepository(Club);
const userRepository = AppDataSource.getRepository(User);
const coachRepository = AppDataSource.getRepository(Coach);
const federationRepository = AppDataSource.getRepository(Federation);

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

  if (data.federation_id !== null && data.federation_id !== undefined) {
    const federation = await federationRepository.findOne({
      where: { id: data.federation_id },
    });
    if (!federation) {
      throw new Error(`Federation with id ${data.federation_id} not found`);
    }
    club.federation = federation;
  } else {
    club.federation = null;
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
    relations: ["user"],
    order: {
      user: {
        name: "ASC",
      },
    },
    select: {
      id: true,
      specialty: true,
      created_at: false,
      updated_at: false,
      user: {
        id: false,
        name: true,
        email: false,
        created_at: false,
        updated_at: false,
      },
    },
  });

  return staff;
};

export const getClubService = async (id: number) => {
  const club = await clubRepository.find({
    where: { id },
    relations: ["user", "federation", "federation.user"],
    select: {
      id: true,
      location: true,
      founded_year: true,
      user: {
        id: true,
        name: true,
        bio: true,
      },
      federation: {
        id: true,
        user: {
          id: true,
          name: true,
        },
      },
    },
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
      meetingUrl: true,
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

export const createMeeting = async (tryoutName: string, startDate: Date) => {
  try {

    // Removed spaces/underscores - Converted to lowercase
    const sanitizedName = tryoutName
      .replace(/\s+/g, "_") 
      .replace(/[^a-zA-Z0-9-_]/g, "") 
      .toLowerCase(); 

    const roomName = `tryout-${sanitizedName}-${Date.now()}`;

    const response = await axios.post(
      "https://api.daily.co/v1/rooms",
      {
        name: roomName,
        properties: {
          exp: Math.floor(startDate.getTime() / 1000),
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      room: response.data.name,
      url: response.data.url,
    };
  } catch (error) {
    console.error("Error creating Daily meeting:", error);
    throw new Error("Failed to create meeting room");
  }
};

export const addTryOutService = async (
  clubId: number,
  data: AddTryoutInput
) => {
  const tryOutRepository = AppDataSource.getRepository(TryOut);

  const meetingDate = new Date(data.date);
  const { room, url } = await createMeeting(data.name, meetingDate);

  const newTryOut = tryOutRepository.create({
    name: data.name,
    date: data.date,
    description: data.description,
    club: { id: clubId } as Club,
    meetingRoom: room,
    meetingUrl: url,
  });

  const savedTryOut = await tryOutRepository.save(newTryOut);

  return tryOutRepository.findOne({
    where: { id: savedTryOut.id },
    relations: ["club"],
  });
};

export const deleteTryOutService = async (trId: number) => {
  const tryOutRepository = AppDataSource.getRepository(TryOut);

  const tryOut = await tryOutRepository.findOne({
    where: { id: trId },
  });

  if (!tryOut) {
    throw new Error(`TryOut with id ${trId} not found`);
  }

  await tryOutRepository.remove(tryOut);
  return true;
};
