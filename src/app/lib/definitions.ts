import { z } from "zod";

export const SignupFormSchema = z
  .object({
    firstname: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long." })
      .trim(),
    lastname: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long." })
      .trim(),
    email: z.string().email({ message: "Please enter a valid email." }).trim(),
    password: z
      .string()
      .min(8, { message: "Be at least 8 characters" })
      // .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
      // .regex(/[0-9]/, { message: "Contain at least one number." })
      // .regex(/[^a-zA-Z0-9]/, {
      //   message: "Contain at least one special character.",
      // })
      .trim(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type FormState =
  | {
      firstname?: string;
      lastname?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      errors?: {
        firstname?: string[];
        lastname?: string[];
        username?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
        serverError?: string;
      };
    }
  | undefined;
