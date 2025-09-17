import z from "zod";


const addressFields = {
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
};

// Схема для отдельного адреса (для обратной совместимости)
export const billingSchema = z.object(addressFields);

// Схема для объединенной формы с shipping и billing адресами
export const combinedFormSchema = z
  .object({
    // Shipping адрес
    shippingCountry: addressFields.country,
    shippingFirstName: addressFields.firstName,
    shippingLastName: addressFields.lastName,
    shippingAddress: addressFields.address,
    shippingApartment: addressFields.apartment,
    shippingZipCode: addressFields.zipCode,
    shippingCity: addressFields.city,
    shippingEmail: addressFields.email,
    shippingPhone: addressFields.phone,

    // Billing адрес (опциональный, если copyBilling = true)
    billingCountry: addressFields.country.optional(),
    billingFirstName: addressFields.firstName.optional(),
    billingLastName: addressFields.lastName.optional(),
    billingAddress: addressFields.address.optional(),
    billingApartment: addressFields.apartment.optional(),
    billingZipCode: addressFields.zipCode.optional(),
    billingCity: addressFields.city.optional(),
    billingEmail: addressFields.email.optional(),
    billingPhone: addressFields.phone.optional(),

    // Флаг копирования
    copyBilling: z.boolean().default(false),
  })
  .refine(
    (data) => {
      // Если copyBilling = false, то billing поля обязательны
      if (!data.copyBilling) {
        return (
          data.billingCountry &&
          data.billingFirstName &&
          data.billingLastName &&
          data.billingAddress &&
          data.billingZipCode &&
          data.billingCity &&
          data.billingEmail &&
          data.billingPhone
        );
      }
      return true;
    },
    {
      message:
        "Billing address fields are required when not copying from shipping",
      path: ["billingCountry"], // Указываем на первое поле billing для отображения ошибки
    }
  );
