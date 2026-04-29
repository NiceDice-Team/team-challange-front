"use client";

import React, { useEffect, useMemo } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomInput } from "../shared/CustomInput";
import CountrySelectWithSearch from "./CountrySelectWithSearch";
import PhoneNumberInput from "./PhoneNumberInput";
import { createCombinedFormSchema, type CombinedFormData } from "./schema";
import CustomCheckbox from "../shared/CustomCheckbox";
import { ChevronLeft } from "lucide-react";
import { CustomButton } from "../shared/CustomButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DeliveryOption,
  useCheckoutFormData,
  useCheckoutStore,
} from "@/store/checkout";
import { useTranslation } from "react-i18next";

export type { CombinedFormData } from "./schema";

export default function ShippingForm({
  paymentMethod,
  children,
}: {
  paymentMethod: DeliveryOption | null;
  children?: React.ReactNode;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const checkoutUserData = useCheckoutFormData();

  const validationMessages = useMemo(
    () => ({
      chooseCountry: t("checkoutOrder.shippingForm.validation.chooseCountry"),
      firstNameMin: t("checkoutOrder.shippingForm.validation.firstNameMin"),
      firstNameMax: t("checkoutOrder.shippingForm.validation.firstNameMax"),
      firstNameRegex: t("checkoutOrder.shippingForm.validation.firstNameRegex"),
      lastNameMin: t("checkoutOrder.shippingForm.validation.lastNameMin"),
      lastNameMax: t("checkoutOrder.shippingForm.validation.lastNameMax"),
      lastNameRegex: t("checkoutOrder.shippingForm.validation.lastNameRegex"),
      addressMin: t("checkoutOrder.shippingForm.validation.addressMin"),
      addressMax: t("checkoutOrder.shippingForm.validation.addressMax"),
      addressRegex: t("checkoutOrder.shippingForm.validation.addressRegex"),
      apartmentMax: t("checkoutOrder.shippingForm.validation.apartmentMax"),
      zipMin: t("checkoutOrder.shippingForm.validation.zipMin"),
      zipMax: t("checkoutOrder.shippingForm.validation.zipMax"),
      zipRegex: t("checkoutOrder.shippingForm.validation.zipRegex"),
      cityMin: t("checkoutOrder.shippingForm.validation.cityMin"),
      cityMax: t("checkoutOrder.shippingForm.validation.cityMax"),
      cityRegex: t("checkoutOrder.shippingForm.validation.cityRegex"),
      invalidEmail: t("checkoutOrder.shippingForm.validation.invalidEmail"),
      phoneMin: t("checkoutOrder.shippingForm.validation.phoneMin"),
      billingCountryRequired: t(
        "checkoutOrder.shippingForm.validation.billingCountryRequired",
      ),
      billingFirstNameRequired: t(
        "checkoutOrder.shippingForm.validation.billingFirstNameRequired",
      ),
      billingLastNameRequired: t(
        "checkoutOrder.shippingForm.validation.billingLastNameRequired",
      ),
      billingAddressRequired: t(
        "checkoutOrder.shippingForm.validation.billingAddressRequired",
      ),
      billingCityRequired: t("checkoutOrder.shippingForm.validation.billingCityRequired"),
      billingZipRequired: t("checkoutOrder.shippingForm.validation.billingZipRequired"),
      billingEmailRequired: t("checkoutOrder.shippingForm.validation.billingEmailRequired"),
      billingPhoneRequired: t("checkoutOrder.shippingForm.validation.billingPhoneRequired"),
    }),
    [t],
  );

  const combinedFormSchema = useMemo(
    () => createCombinedFormSchema(validationMessages),
    [validationMessages],
  );

  const shouldUseStoredDefaults = useMemo(
    () =>
      Boolean(
        checkoutUserData.shippingCountry ||
        checkoutUserData.shippingFirstName ||
        checkoutUserData.shippingLastName ||
        checkoutUserData.shippingAddress ||
        checkoutUserData.shippingApartment ||
        checkoutUserData.shippingZipCode ||
        checkoutUserData.shippingCity ||
        checkoutUserData.shippingEmail ||
        checkoutUserData.shippingPhone,
      ),
    [checkoutUserData],
  );

  const defaultValues: CombinedFormData = useMemo(
    () => ({
      shippingCountry: shouldUseStoredDefaults
        ? checkoutUserData.shippingCountry
        : "",
      shippingFirstName: shouldUseStoredDefaults
        ? checkoutUserData.shippingFirstName
        : "",
      shippingLastName: shouldUseStoredDefaults
        ? checkoutUserData.shippingLastName
        : "",
      shippingAddress: shouldUseStoredDefaults
        ? checkoutUserData.shippingAddress
        : "",
      shippingApartment: shouldUseStoredDefaults
        ? (checkoutUserData.shippingApartment ?? "")
        : "",
      shippingZipCode: shouldUseStoredDefaults
        ? checkoutUserData.shippingZipCode
        : "",
      shippingCity: shouldUseStoredDefaults
        ? checkoutUserData.shippingCity
        : "",
      shippingEmail: shouldUseStoredDefaults
        ? checkoutUserData.shippingEmail
        : "",
      shippingPhone: shouldUseStoredDefaults
        ? checkoutUserData.shippingPhone
        : "",

      billingCountry: shouldUseStoredDefaults
        ? (checkoutUserData.billingCountry ?? "")
        : "",
      billingFirstName: shouldUseStoredDefaults
        ? (checkoutUserData.billingFirstName ?? "")
        : "",
      billingLastName: shouldUseStoredDefaults
        ? (checkoutUserData.billingLastName ?? "")
        : "",
      billingAddress: shouldUseStoredDefaults
        ? (checkoutUserData.billingAddress ?? "")
        : "",
      billingApartment: shouldUseStoredDefaults
        ? (checkoutUserData.billingApartment ?? "")
        : "",
      billingZipCode: shouldUseStoredDefaults
        ? (checkoutUserData.billingZipCode ?? "")
        : "",
      billingCity: shouldUseStoredDefaults
        ? (checkoutUserData.billingCity ?? "")
        : "",
      billingEmail: shouldUseStoredDefaults
        ? (checkoutUserData.billingEmail ?? "")
        : "",
      billingPhone: shouldUseStoredDefaults
        ? (checkoutUserData.billingPhone ?? "")
        : "",

      copyBilling: shouldUseStoredDefaults
        ? checkoutUserData.copyBilling
        : true,
    }),
    [checkoutUserData, shouldUseStoredDefaults],
  );
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<CombinedFormData>({
    resolver: zodResolver(combinedFormSchema) as Resolver<CombinedFormData>,
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues,
  });
  const { setFormData, setPaymentMethod } = useCheckoutStore();

  const copyBilling = watch("copyBilling");
  const shippingCountry = watch("shippingCountry");
  const shippingFirstName = watch("shippingFirstName");
  const shippingLastName = watch("shippingLastName");
  const shippingAddress = watch("shippingAddress");
  const shippingApartment = watch("shippingApartment");
  const shippingZipCode = watch("shippingZipCode");
  const shippingCity = watch("shippingCity");
  const shippingEmail = watch("shippingEmail");
  const shippingPhone = watch("shippingPhone");

  useEffect(() => {
    if (!copyBilling) return;

    // Keep billing in sync with shipping while checkbox is enabled.
    // This prevents submit-time validation errors caused by empty billing values.
    setValue("billingCountry", shippingCountry, { shouldValidate: false });
    setValue("billingFirstName", shippingFirstName, { shouldValidate: false });
    setValue("billingLastName", shippingLastName, { shouldValidate: false });
    setValue("billingAddress", shippingAddress, { shouldValidate: false });
    setValue("billingApartment", shippingApartment, { shouldValidate: false });
    setValue("billingZipCode", shippingZipCode, { shouldValidate: false });
    setValue("billingCity", shippingCity, { shouldValidate: false });
    setValue("billingEmail", shippingEmail, { shouldValidate: false });
    setValue("billingPhone", shippingPhone, { shouldValidate: false });
  }, [
    copyBilling,
    setValue,
    shippingCountry,
    shippingFirstName,
    shippingLastName,
    shippingAddress,
    shippingApartment,
    shippingZipCode,
    shippingCity,
    shippingEmail,
    shippingPhone,
  ]);

  const onSubmit = (data: CombinedFormData) => {
    setFormData(data as any);
    setPaymentMethod(paymentMethod);

    router.push("/checkout-order/order-review");
  };

  const onError = (errors: any) => {
    console.log("Form validation errors:", errors);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div className="flex flex-col gap-4 mb-12">
          <div className="pb-6 text-xl uppercase">{t("checkoutOrder.shippingForm.sectionShipping")}</div>

          <CountrySelectWithSearch
            label={t("checkoutOrder.shippingForm.labels.countryRegion")}
            value={watch("shippingCountry")}
            onChange={(value) => setValue("shippingCountry", value)}
            name="shippingCountry"
            error={
              errors.shippingCountry?.message && [
                errors.shippingCountry?.message,
              ]
            }
          />
          <div className="gap-4 grid grid-cols-2">
            <CustomInput
              label={t("checkoutOrder.shippingForm.labels.firstName")}
              id="shippingFirstName"
              name="shippingFirstName"
              placeholder={t("checkoutOrder.shippingForm.placeholders.firstName")}
              {...register("shippingFirstName")}
              error={
                errors.shippingFirstName?.message
                  ? [errors.shippingFirstName?.message]
                  : undefined
              }
            />
            <CustomInput
              label={t("checkoutOrder.shippingForm.labels.lastName")}
              id="shippingLastName"
              name="shippingLastName"
              placeholder={t("checkoutOrder.shippingForm.placeholders.lastName")}
              {...register("shippingLastName")}
              error={
                errors.shippingLastName?.message
                  ? [errors.shippingLastName?.message]
                  : undefined
              }
            />
          </div>
          <CustomInput
            label={t("checkoutOrder.shippingForm.labels.address")}
            id="shippingAddress"
            name="shippingAddress"
            placeholder={t("checkoutOrder.shippingForm.placeholders.address")}
            {...register("shippingAddress")}
            error={
              errors.shippingAddress?.message
                ? [errors.shippingAddress?.message]
                : undefined
            }
          />
          <CustomInput
            label={t("checkoutOrder.shippingForm.labels.apartment")}
            id="shippingApartment"
            name="shippingApartment"
            placeholder={t("checkoutOrder.shippingForm.placeholders.apartment")}
            {...register("shippingApartment")}
            error={
              errors.shippingApartment?.message
                ? [errors.shippingApartment?.message]
                : undefined
            }
          />
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <CustomInput
              label={t("checkoutOrder.shippingForm.labels.zipCode")}
              id="shippingZipCode"
              name="shippingZipCode"
              placeholder={t("checkoutOrder.shippingForm.placeholders.zipCode")}
              {...register("shippingZipCode")}
              error={
                errors.shippingZipCode?.message
                  ? [errors.shippingZipCode?.message]
                  : undefined
              }
            />
            <CustomInput
              label={t("checkoutOrder.shippingForm.labels.city")}
              id="shippingCity"
              name="shippingCity"
              placeholder={t("checkoutOrder.shippingForm.placeholders.city")}
              {...register("shippingCity")}
              error={
                errors.shippingCity?.message
                  ? [errors.shippingCity?.message]
                  : undefined
              }
            />
          </div>
          <CustomInput
            label={t("checkoutOrder.shippingForm.labels.email")}
            id="shippingEmail"
            name="shippingEmail"
            placeholder={t("checkoutOrder.shippingForm.placeholders.email")}
            {...register("shippingEmail")}
            error={
              errors.shippingEmail?.message
                ? [errors.shippingEmail?.message]
                : undefined
            }
          />
          <PhoneNumberInput
            label={t("checkoutOrder.shippingForm.labels.phoneNumber")}
            value={watch("shippingPhone")}
            onChange={(value) => setValue("shippingPhone", value)}
            name="shippingPhone"
            error={
              errors.shippingPhone?.message
                ? [errors.shippingPhone?.message]
                : undefined
            }
          />
        </div>

        <CustomCheckbox
          label={t("checkoutOrder.shippingForm.copyBilling")}
          id="copyBilling"
          checked={copyBilling}
          onCheckedChange={(checked) => {
            setValue("copyBilling", checked);
            // When switching to "enter billing separately", reset billing fields
            // so user input doesn't append to previously-copied values.
            if (!checked) {
              setValue("billingCountry", "", { shouldValidate: false });
              setValue("billingFirstName", "", { shouldValidate: false });
              setValue("billingLastName", "", { shouldValidate: false });
              setValue("billingAddress", "", { shouldValidate: false });
              setValue("billingApartment", "", { shouldValidate: false });
              setValue("billingZipCode", "", { shouldValidate: false });
              setValue("billingCity", "", { shouldValidate: false });
              setValue("billingEmail", "", { shouldValidate: false });
              setValue("billingPhone", "", { shouldValidate: false });
            }
          }}
        />
        {!copyBilling && (
          <div className="flex flex-col gap-4 mt-6">
            <div className="pb-6 text-xl uppercase">{t("checkoutOrder.shippingForm.sectionBilling")}</div>

            <CountrySelectWithSearch
              label={t("checkoutOrder.shippingForm.labels.countryRegion")}
              value={watch("billingCountry")}
              onChange={(value) => setValue("billingCountry", value)}
              name="billingCountry"
              error={
                errors.billingCountry?.message
                  ? [errors.billingCountry?.message]
                  : undefined
              }
            />
            <div className="gap-4 grid grid-cols-2">
              <CustomInput
                label={t("checkoutOrder.shippingForm.labels.firstName")}
                id="billingFirstName"
                name="billingFirstName"
                placeholder={t("checkoutOrder.shippingForm.placeholders.firstName")}
                {...register("billingFirstName")}
                error={
                  errors.billingFirstName?.message
                    ? [errors.billingFirstName?.message]
                    : undefined
                }
              />
              <CustomInput
                label={t("checkoutOrder.shippingForm.labels.lastName")}
                id="billingLastName"
                name="billingLastName"
                placeholder={t("checkoutOrder.shippingForm.placeholders.lastName")}
                {...register("billingLastName")}
                error={
                  errors.billingLastName?.message
                    ? [errors.billingLastName?.message]
                    : undefined
                }
              />
            </div>
            <CustomInput
              label={t("checkoutOrder.shippingForm.labels.address")}
              id="billingAddress"
              name="billingAddress"
              placeholder={t("checkoutOrder.shippingForm.placeholders.address")}
              {...register("billingAddress")}
              error={
                errors.billingAddress?.message
                  ? [errors.billingAddress?.message]
                  : undefined
              }
            />
            <CustomInput
              label={t("checkoutOrder.shippingForm.labels.apartment")}
              id="billingApartment"
              name="billingApartment"
              placeholder={t("checkoutOrder.shippingForm.placeholders.apartment")}
              {...register("billingApartment")}
              error={
                errors.billingApartment?.message
                  ? [errors.billingApartment?.message]
                  : undefined
              }
            />
            <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
              <CustomInput
                label={t("checkoutOrder.shippingForm.labels.zipCode")}
                id="billingZipCode"
                name="billingZipCode"
                placeholder={t("checkoutOrder.shippingForm.placeholders.zipCode")}
                {...register("billingZipCode")}
                error={
                  errors.billingZipCode?.message
                    ? [errors.billingZipCode?.message]
                    : undefined
                }
              />
              <CustomInput
                label={t("checkoutOrder.shippingForm.labels.city")}
                id="billingCity"
                name="billingCity"
                placeholder={t("checkoutOrder.shippingForm.placeholders.city")}
                {...register("billingCity")}
                error={
                  errors.billingCity?.message
                    ? [errors.billingCity?.message]
                    : undefined
                }
              />
            </div>
            <CustomInput
              label={t("checkoutOrder.shippingForm.labels.email")}
              id="billingEmail"
              name="billingEmail"
              placeholder={t("checkoutOrder.shippingForm.placeholders.email")}
              {...register("billingEmail")}
              error={
                errors.billingEmail?.message
                  ? [errors.billingEmail?.message]
                  : undefined
              }
            />
            <PhoneNumberInput
              label={t("checkoutOrder.shippingForm.labels.phoneNumber")}
              value={watch("billingPhone")}
              onChange={(value) => setValue("billingPhone", value)}
              name="billingPhone"
              error={
                errors.billingPhone?.message
                  ? [errors.billingPhone?.message]
                  : undefined
              }
            />
          </div>
        )}

        {children}

        <div className="flex sm:flex-row flex-col-reverse justify-between items-center gap-6 mt-12">
          <Link
            href="/cart"
            className="flex items-center gap-2 hover:opacity-80 text-foreground text-base"
          >
            <ChevronLeft className="w-6 h-6 text-purple" />
            {t("checkoutOrder.shippingForm.returnToCart")}
          </Link>
          <CustomButton
            type="submit"
            disabled={isSubmitting}
            className="bg-purple hover:bg-purple/90 border border-purple w-full sm:w-72 h-12 font-normal text-white text-base uppercase"
          >
            {t("checkoutOrder.shippingForm.orderReview")}
          </CustomButton>
        </div>
      </form>
    </>
  );
}
