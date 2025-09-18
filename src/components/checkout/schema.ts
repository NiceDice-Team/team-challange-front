import z from "zod";

export const billingSchema = z.object({
  country: z.string().min(1, "Choose country"),
  firstName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .regex(/^[\p{L}' ]+$/u, {
      message: "Only letters, spaces and apostrophes are allowed",
    }),
  lastName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .regex(/^[\p{L}' ]+$/u, {
      message: "Only letters, spaces and apostrophes are allowed",
    }),
  address: z
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters")
    .max(100, "Address must be at most 100 characters")
    .regex(/^[a-zA-Z0-9\s,-]+$/, {
      message: "Only letters, numbers and spaces are allowed",
    }),
  apartment: z
    .string()
    .trim()
    .max(50, "Apartment must be at most 50 characters")
    .optional(),
  zipCode: z
    .string()
    .min(3, "Zip code must be at least 3 characters")
    .max(12, "Zip code must be at most 12 characters")
    .regex(/^\d{5}(-\d{4})?$/, {
      message: "Only numbers and letters are allowed",
    }),
  city: z
    .string()
    .trim()
    .min(2, "City must be at least 2 characters")
    .max(50, "City must be at most 50 characters")
    .regex(/^[a-zA-Z\s,-]+$/, {
      message: "Only letters and spaces are allowed",
    }),
  email: z.string().email("Invalid email"),
  phone: z.string().min(8, "Phone must be at least 8 characters"),
});
