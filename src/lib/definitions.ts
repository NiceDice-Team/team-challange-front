import { z } from "zod";

export const SignupFormSchema = z
  .object({
    firstname: z
      .string({ required_error: "Please enter your name" })
      .min(2, { message: "Invalid first name" })
      .max(150, { message: "Invalid first name" })
      .regex(/^[A-Za-z' -]+$/u, {
        message: "Only letters, spaces and apostrophes are allowed",
      })
      .trim(),
    lastname: z
      .string({ required_error: "Please enter your last name" })
      .min(2, { message: "Invalid last name" })
      .max(150, { message: "Invalid last name" })
      .regex(/^[A-Za-z' -]+$/u, {
        message: "Only letters, spaces and apostrophes are allowed",
      })
      .trim(),
    email: z
      .string({ required_error: "Please enter your email address" })
      .email({ message: "Please enter a valid email." })
      .trim(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(128, { message: "Password must be less than 128 characters" })
      .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, {
        message: "Contain at least one letter and one number.",
      })
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
  email: z
    .string({ required_error: "Please enter your email address" })
    .email({ message: "Please enter a valid email." })
    .trim(),
  password: z
    .string()
    .trim()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(128, { message: "Password must be less than 128 characters" })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, {
      message: "Contain at least one letter and one number.",
    })
    .trim(),
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
    .min(8, { message: "Password must be at least 8 characters" })
    .max(128, { message: "Password must be less than 128 characters" }),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(128, { message: "Password must be less than 128 characters" })
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
    .max(150, { message: "First name must be less than 150 characters" }),
  lastname: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" })
    .max(150, { message: "Last name must be less than 150 characters" }),
  email: z
    .string()
    .email("Invalid email")
    .min(8, { message: "Password must be at least 8 characters" })
    .max(128, { message: "Password must be less than 128 characters" }),
});

export const orderStatusSchema = z.enum([
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  image: z.string().optional(),
});
export const orderItemSchema = z.object({
  id: z.string(),
  products: z.array(ProductSchema),
  product_count: z.number().min(1),
  total_amount: z.number(),
  created_at: z.string(),
  status: orderStatusSchema,
});

export const orderSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  order_number: z.string(),
  status: orderStatusSchema,
  total_amount: z.number(),
  shipping_address: z.object({
    first_name: z.string(),
    last_name: z.string(),
    address: z.string(),
    apartment: z.string().optional(),
    city: z.string(),
    zip_code: z.string(),
    country: z.string(),
    email: z.string().email(),
    phone: z.string(),
  }),
  billing_address: z
    .object({
      first_name: z.string(),
      last_name: z.string(),
      address: z.string(),
      apartment: z.string().optional(),
      city: z.string(),
      zip_code: z.string(),
      country: z.string(),
      email: z.string().email(),
      phone: z.string(),
    })
    .optional(),
  items: z.array(orderItemSchema),
  created_at: z.string(),
  updated_at: z.string(),
  payment_method: z.string().optional(),
  tracking_number: z.string().optional(),
});

export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type Order = z.infer<typeof orderItemSchema>;
