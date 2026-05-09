import z from "zod";

export type CheckoutValidationMessages = {
  chooseCountry: string;
  firstNameMin: string;
  firstNameMax: string;
  firstNameRegex: string;
  lastNameMin: string;
  lastNameMax: string;
  lastNameRegex: string;
  addressMin: string;
  addressMax: string;
  addressRegex: string;
  apartmentMax: string;
  zipMin: string;
  zipMax: string;
  zipRegex: string;
  cityMin: string;
  cityMax: string;
  cityRegex: string;
  invalidEmail: string;
  phoneMin: string;
  billingCountryRequired: string;
  billingFirstNameRequired: string;
  billingLastNameRequired: string;
  billingAddressRequired: string;
  billingCityRequired: string;
  billingZipRequired: string;
  billingEmailRequired: string;
  billingPhoneRequired: string;
};

export function createCombinedFormSchema(msgs: CheckoutValidationMessages) {
  const addressFields = {
    country: z.string().min(1, msgs.chooseCountry),
    firstName: z
      .string()
      .trim()
      .min(2, msgs.firstNameMin)
      .max(50, msgs.firstNameMax)
      .regex(/^[\p{L}' ]+$/u, {
        message: msgs.firstNameRegex,
      }),
    lastName: z
      .string()
      .trim()
      .min(2, msgs.lastNameMin)
      .max(50, msgs.lastNameMax)
      .regex(/^[\p{L}' ]+$/u, {
        message: msgs.lastNameRegex,
      }),
    address: z
      .string()
      .trim()
      .min(5, msgs.addressMin)
      .max(100, msgs.addressMax)
      .regex(/^[a-zA-Z0-9\s,-]+$/, {
        message: msgs.addressRegex,
      }),
    apartment: z.string().trim().max(50, msgs.apartmentMax),
    zipCode: z
      .string()
      .min(3, msgs.zipMin)
      .max(12, msgs.zipMax)
      .regex(/^\d{5}(-\d{4})?$/, {
        message: msgs.zipRegex,
      }),
    city: z
      .string()
      .trim()
      .min(2, msgs.cityMin)
      .max(50, msgs.cityMax)
      .regex(/^[a-zA-Z\s,-]+$/, {
        message: msgs.cityRegex,
      }),
    email: z.string().email(msgs.invalidEmail),
    phone: z.string().min(8, msgs.phoneMin),
  };

  return z
    .object({
      shippingCountry: addressFields.country,
      shippingFirstName: addressFields.firstName,
      shippingLastName: addressFields.lastName,
      shippingAddress: addressFields.address,
      shippingApartment: addressFields.apartment,
      shippingZipCode: addressFields.zipCode,
      shippingCity: addressFields.city,
      shippingEmail: addressFields.email,
      shippingPhone: addressFields.phone,

      billingCountry: addressFields.country.optional(),
      billingFirstName: addressFields.firstName.optional(),
      billingLastName: addressFields.lastName.optional(),
      billingAddress: addressFields.address.optional(),
      billingApartment: addressFields.apartment.optional(),
      billingZipCode: addressFields.zipCode.optional(),
      billingCity: addressFields.city.optional(),
      billingEmail: addressFields.email.optional(),
      billingPhone: addressFields.phone.optional(),

      copyBilling: z.boolean().default(false),
    })
    .superRefine((data, ctx) => {
      if (!data.copyBilling) {
        if (!data.billingCountry) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: msgs.billingCountryRequired,
            path: ["billingCountry"],
          });
        }
        if (!data.billingFirstName) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: msgs.billingFirstNameRequired,
            path: ["billingFirstName"],
          });
        }
        if (!data.billingLastName) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: msgs.billingLastNameRequired,
            path: ["billingLastName"],
          });
        }
        if (!data.billingAddress) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: msgs.billingAddressRequired,
            path: ["billingAddress"],
          });
        }
        if (!data.billingCity) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: msgs.billingCityRequired,
            path: ["billingCity"],
          });
        }
        if (!data.billingZipCode) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: msgs.billingZipRequired,
            path: ["billingZipCode"],
          });
        }
        if (!data.billingEmail) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: msgs.billingEmailRequired,
            path: ["billingEmail"],
          });
        }
        if (!data.billingPhone) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: msgs.billingPhoneRequired,
            path: ["billingPhone"],
          });
        }
      }
    });
}

export type CombinedFormData = z.infer<
  ReturnType<typeof createCombinedFormSchema>
>;
