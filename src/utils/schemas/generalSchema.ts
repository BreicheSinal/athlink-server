import { z } from "zod";

export const editProfileSchema = z.object({
  // athlete
  position: z.string().nullable().optional(),
  age: z
    .number()
    .min(1, "Age must be greater than 0")
    .max(120, "Age must be less than or equal to 120")
    .nullable()
    .optional(),
  height: z
    .number()
    .min(1, "Height must be greater than 0")
    .max(300, "Height must be less than or equal to 300")
    .nullable()
    .optional(),
  weight: z
    .number()
    .min(1, "Weight must be greater than 0")
    .max(500, "Weight must be less than or equal to 500")
    .nullable()
    .optional(),
  club_id: z
    .number()
    .positive("Club ID must be a positive number")
    .nullable()
    .optional(),

  // club | federation
  federation_id: z
    .number()
    .int()
    .positive("Federation ID must be a positive number")
    .nullable()
    .optional(),
  location: z.string().max(255).optional(),
  founded_year: z.number().int().positive().optional(),

  // federation
  country: z.string().max(100).optional(),

  // coach
  specialty: z.string().max(255).optional(),
});

export type EditProfileInput = z.infer<typeof editProfileSchema>;

export const editBioSchema = z.object({
  bio: z
    .string()
    .min(1, "Bio must be at least 1 character long")
    .max(500, "Bio must be at most 500 characters"),
});

export type EditBioInput = z.infer<typeof editBioSchema>;

export const addTrophySchema = z.object({
  name: z.string().min(1, "Name must be non empty text"),
  description: z.string().min(1, "Description must be non empty text"),
  category: z.enum(["athlete", "coach", "club"], {
    errorMap: () => ({
      message: "Category must be 'athlete', 'coach', or 'club'",
    }),
  }),
  federation_id: z
    .number()
    .positive("Federation id must be a valid number")
    .min(1, "Federation id must be greater than 0"),
});

export type AddTrophyInput = z.infer<typeof addTrophySchema>;

export const addExperienceCertificationSchema = z.object({
  name: z.string().min(1, "Name must be non empty text"),
  type: z.enum(["experience", "certification"], {
    errorMap: () => ({
      message: "Type must be 'experience' or 'certification'",
    }),
  }),
  date: z
    .string()
    .min(1, "Date must be at least 1 character long")
    .max(100, "Date must be at most 100 characters"),
  description: z.string().optional(),
});

export type AddExperienceCertificationInput = z.infer<
  typeof addExperienceCertificationSchema
>;

export const addTryoutSchema = z.object({
  name: z
    .string()
    .min(1, "Name must be non empty text")
    .max(255, "Name must be at most 255 characters"),
  date: z
    .string()
    .min(1, "Date must be non empty")
    .max(100, "Date must be at most 100 characters"),
  description: z
    .string()
    .max(1000, "Description must be at most 1000 characters")
    .optional(),
});

export type AddTryoutInput = z.infer<typeof addTryoutSchema>;

export const ApplicationStatus = z.enum(["accepted", "rejected", "pending"], {
  errorMap: () => ({
    message: "Status must be 'accepted', 'rejected', or 'pending'",
  }),
});

export type ApplicationStatus = z.infer<typeof ApplicationStatus>;

const MediaFileSchema = z.object({
  type: z.enum(["image", "video"]),
  url: z.string().url("Invalid media URL"),
});

export const createPostSchema = z.object({
  description: z
    .string()
    .min(1, "Post description cannot be empty")
    .max(2000, "Post description cannot exceed 2000 characters")
    .optional(),
  mediaFiles: z
    .array(MediaFileSchema)
    .min(0)
    .max(5, "Cannot upload more than 5 media files")
    .optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
