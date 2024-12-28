import { AppDataSource } from "../../db/connection";
import { Coach } from "../../db/entities/Coach";
import { User } from "../../db/entities/User";
import { Club } from "../../db/entities/Club";
import { EditProfileInput, EditBioInput } from "../../schemas/generalSchema";

const coachRepository = AppDataSource.getRepository(Coach);
const userRepository = AppDataSource.getRepository(User);
const clubRepository = AppDataSource.getRepository(Club);

export const editProfileService = async (
  id: number,
  data: EditProfileInput
) => {
  const coach = await coachRepository.findOne({
    where: { id },
  });

  if (!coach) {
    throw new Error(`Coach with id ${id} not found`);
  }

  if (data.club_id !== null && data.club_id !== undefined) {
    const club = await clubRepository.findOne({ where: { id: data.club_id } });
    if (!club) {
      throw new Error(`Club with id ${data.club_id} not found`);
    }
    coach.club = club;
  } else {
    coach.club = null;
  }

  coach.specialty = data.specialty ?? null;

  return coachRepository.save(coach);
};

export const editBioService = async (id: number, data: EditBioInput) => {
  const coach = await coachRepository.findOne({
    where: { id },
    relations: ["user"],
  });

  if (!coach) {
    throw new Error(`Coach with id ${id} not found`);
  }

  if (!coach.user) {
    throw new Error(`User associated with coach of id ${id} not found`);
  }

  coach.user.bio = data.bio;
  return userRepository.save(coach.user);
};

export const getCoachService = async (id: number) => {
  const coach = await coachRepository.find({
    where: { id },
    relations: ["user", "club", "club.user"],
  });

  if (coach.length === 0) {
    throw new Error(`Coach with id ${id} not found`);
  }

  return coach;
};
