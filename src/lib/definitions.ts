import { z } from "zod";

export const SignupFormSchema = z
  .object({
    firstname: z
      .string({ required_error: "Please enter your name" })
      .min(2, { message: "Please enter your name" })
      .trim(),
    lastname: z
      .string({ required_error: "Please enter your last name" })
      .min(2, { message: "Please enter your last name" })
      .trim(),
    email: z
      .string({ required_error: "Please enter your email address" })
      .email({ message: "Please enter a valid email." })
      .trim(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
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

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type LoginFormState = {
  email?: string;
  password?: string;
  accessToken?: string;
  refreshToken?: string;
  errors?: {
    email?: string[];
    password?: string[];
    serverError?: string;
  };
};

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Invalid email")
    .min(1, "Email required")
    .max(50, "Email too long"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(50, { message: "Password must be less than 50 characters" })
      .trim(),
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const editProfileSchema = z.object({
  firstname: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" })
    .max(50, { message: "First name must be less than 50 characters" }),
  lastname: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" })
    .max(50, { message: "Last name must be less than 50 characters" }),
  email: z.string().email("Invalid email").max(255, "Email too long"),
});
