import { z } from "zod";

export const nameSchema = z
  .string()
  .regex(/^[a-zA-Z\s]+$/, "Name must only contain alphabetic characters");

export const emailSchema = z
  .string()
  .email("Invalid email format")
  .regex(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    "Invalid email format"
  );

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: z.string().min(6, "Password must be at least 6 characters"),
  roles: z.array(z.number()).nonempty("At least one role is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string(),
});

export type LoginInput = z.infer<typeof loginSchema>;
