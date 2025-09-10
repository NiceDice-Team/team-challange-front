"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CustomInput } from "../shared/CustomInput";
import CountrySelectWithSearch from "./CountrySelectWithSearch";

const shippingFormSchema = z.object({
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

type ShippingFormData = z.infer<typeof shippingFormSchema>;

export default function ShippingForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: {
      country: "",
      firstName: "",
      lastName: "",
      address: "",
      apartment: "",
      zipCode: "",
      city: "",
      email: "",
      phone: "",
    },
  });

  const selectedCountry = watch("country");

  const onSubmit = async (data: ShippingFormData) => {
    try {
      console.log("Данные формы:", data);
      // Здесь будет логика отправки данных
      alert("Форма успешно отправлена!");
    } catch (error) {
      console.error("Ошибка при отправке формы:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <CountrySelectWithSearch
        {...register("country")}
        error={errors.country?.message ? [errors.country?.message] : undefined}
      />
      <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
        <CustomInput
          label="First Name"
          id="firstName"
          name="firstName"
          placeholder="Enter your first name"
          {...register("firstName")}
          error={
            errors.firstName?.message ? [errors.firstName?.message] : undefined
          }
        />
        <CustomInput
          label="Last Name"
          id="lastName"
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
        id="address"
        name="address"
        placeholder="Enter your address"
        {...register("address")}
        error={errors.address?.message ? [errors.address?.message] : undefined}
      />
      <CustomInput
        label="Apartment, suite, etc"
        id="apartment"
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
          id="zipCode"
          name="zipCode"
          placeholder="Enter your zip code"
          {...register("zipCode")}
          error={
            errors.zipCode?.message ? [errors.zipCode?.message] : undefined
          }
        />
        <CustomInput
          label="Town / City"
          id="city"
          name="city"
          placeholder="Enter your city"
          {...register("city")}
          error={errors.city?.message ? [errors.city?.message] : undefined}
        />
      </div>
      <CustomInput
        label="Email"
        id="email"
        name="email"
        placeholder="Enter your email"
        {...register("email")}
        error={errors.email?.message ? [errors.email?.message] : undefined}
      />
      <CustomInput
        label="Phone"
        id="phone"
        name="phone"
        placeholder="Enter your phone"
        {...register("phone")}
        error={errors.phone?.message ? [errors.phone?.message] : undefined}
      />
    </form>
  );
}
