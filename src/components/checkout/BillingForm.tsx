"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CustomInput } from "../shared/CustomInput";
import CountrySelectWithSearch from "./CountrySelectWithSearch";
import PhoneNumberInput from "./PhoneNumberInput";

const billingFormSchema = z.object({
  country: z.string().min(1, "Выберите страну"),
  firstName: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  lastName: z.string().min(2, "Фамилия должна содержать минимум 2 символа"),
  address: z.string().min(5, "Адрес должен содержать минимум 5 символов"),
  apartment: z.string().optional(),
  zipCode: z
    .string()
    .min(3, "Почтовый индекс должен содержать минимум 3 символа"),
  city: z.string().min(2, "Город должен содержать минимум 2 символа"),
  email: z.string().email("Введите корректный email адрес"),
  phone: z.string().min(10, "Телефон должен содержать минимум 10 цифр"),
});

type BillingFormData = z.infer<typeof billingFormSchema>;

interface BillingFormProps {
  onDataChange?: (data: BillingFormData) => void;
  initialData?: Partial<BillingFormData>;
}

export default function BillingForm({
  onDataChange,
  initialData,
}: BillingFormProps) {
  const {
    register,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<BillingFormData>({
    resolver: zodResolver(billingFormSchema),
    defaultValues: {
      country: initialData?.country || "",
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      address: initialData?.address || "",
      apartment: initialData?.apartment || "",
      zipCode: initialData?.zipCode || "",
      city: initialData?.city || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
    },
  });

  const selectedCountry = watch("country");
  const formData = watch();

  useEffect(() => {
    if (onDataChange) {
      onDataChange(formData);
    }
  }, [formData, onDataChange]);

  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        if (value !== undefined) {
          setValue(key as keyof BillingFormData, value);
        }
      });
    }
  }, [initialData, setValue]);

  return (
    <>
      <div className="pb-10 text-xl uppercase">Billing adress</div>
      <form className="flex flex-col gap-4">
        <CountrySelectWithSearch
          value={watch("country")}
          onChange={(value) => setValue("country", value)}
          onBlur={() => trigger("country")}
          name="country"
          error={
            errors.country?.message ? [errors.country?.message] : undefined
          }
        />
        <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
          <CustomInput
            label="First Name"
            id="billingFirstName"
            name="firstName"
            placeholder="Enter your first name"
            {...register("firstName")}
            error={
              errors.firstName?.message
                ? [errors.firstName?.message]
                : undefined
            }
          />
          <CustomInput
            label="Last Name"
            id="billingLastName"
            name="lastName"
            placeholder="Enter your last name"
            {...register("lastName")}
            error={
              errors.lastName?.message ? [errors.lastName?.message] : undefined
            }
          />
        </div>
        <CustomInput
          label="Address"
          id="billingAddress"
          name="address"
          placeholder="Enter your address"
          {...register("address")}
          error={
            errors.address?.message ? [errors.address?.message] : undefined
          }
        />
        <CustomInput
          label="Apartment, suite, etc"
          id="billingApartment"
          name="apartment"
          placeholder="Enter your apartment, suite, etc"
          {...register("apartment")}
          error={
            errors.apartment?.message ? [errors.apartment?.message] : undefined
          }
        />
        <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
          <CustomInput
            label="Zip Code"
            id="billingZipCode"
            name="zipCode"
            placeholder="Enter your zip code"
            {...register("zipCode")}
            error={
              errors.zipCode?.message ? [errors.zipCode?.message] : undefined
            }
          />
          <CustomInput
            label="Town / City"
            id="billingCity"
            name="city"
            placeholder="Enter your city"
            {...register("city")}
            error={errors.city?.message ? [errors.city?.message] : undefined}
          />
        </div>
        <CustomInput
          label="Email"
          id="billingEmail"
          name="email"
          placeholder="Enter your email"
          {...register("email")}
          error={errors.email?.message ? [errors.email?.message] : undefined}
        />
        <PhoneNumberInput
          value={watch("phone")}
          onChange={(value) => setValue("phone", value)}
          onBlur={() => trigger("phone")}
          name="phone"
          error={errors.phone?.message ? [errors.phone?.message] : undefined}
        />
      </form>
    </>
  );
}
