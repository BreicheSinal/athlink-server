import { z } from "zod";

export const editProfileSchema = z.object({
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
});

export type EditProfileInput = z.infer<typeof editProfileSchema>;
