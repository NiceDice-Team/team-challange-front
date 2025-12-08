"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CustomInput } from "../shared/CustomInput";
import CountrySelectWithSearch from "./CountrySelectWithSearch";
import PhoneNumberInput from "./PhoneNumberInput";
import { combinedFormSchema } from "./schema";
import CustomCheckbox from "../shared/CustomCheckbox";
import { ChevronLeft } from "lucide-react";
import { CustomButton } from "../shared/CustomButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DeliveryOption, useCheckoutStore } from "@/store/checkout";

export type CombinedFormData = z.infer<typeof combinedFormSchema>;

export default function ShippingForm({
  paymentMethod,
}: {
  paymentMethod: DeliveryOption;
}) {
  const router = useRouter();
  const {
    register,
    watch,
    setValue,
    handleSubmit,

    trigger,
    formState: { errors, isSubmitting },
  } = useForm<CombinedFormData>({
    resolver: zodResolver(combinedFormSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      shippingCountry: "United States",
      shippingFirstName: "John",
      shippingLastName: "Doe",
      shippingAddress: "123 Main Street",
      shippingApartment: "Apt 4B",
      shippingZipCode: "12345",
      shippingCity: "New York",
      shippingEmail: "john.doe@example.com",
      shippingPhone: "+1234567890",
      billingCountry: "",
      billingFirstName: "",
      billingLastName: "",
      billingAddress: "",
      billingApartment: "",
      billingZipCode: "",
      billingCity: "",
      billingEmail: "",
      billingPhone: "",
      copyBilling: true,
    },
  });
  const { setFormData, setPaymentMethod } = useCheckoutStore();

  const copyBilling = watch("copyBilling");

  useEffect(() => {
    if (copyBilling === true) {
      setValue("billingCountry", watch("shippingCountry"));
      setValue("billingFirstName", watch("shippingFirstName"));
      setValue("billingLastName", watch("shippingLastName"));
      setValue("billingAddress", watch("shippingAddress"));
      setValue("billingApartment", watch("shippingApartment"));
      setValue("billingZipCode", watch("shippingZipCode"));
      setValue("billingCity", watch("shippingCity"));
      setValue("billingEmail", watch("shippingEmail"));
      setValue("billingPhone", watch("shippingPhone"));

      trigger("billingAddress");
      trigger("billingCountry");
      trigger("billingFirstName");
      trigger("billingLastName");
      trigger("billingApartment");
      trigger("billingZipCode");
      trigger("billingCity");
      trigger("billingEmail");
      trigger("billingPhone");
    }
  }, [copyBilling, trigger, setValue, watch]);

  const onSubmit = (data: CombinedFormData) => {
    console.log("Form submitted successfully:", data);
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
          <div className="pb-6 text-xl uppercase">Shipping</div>

          <CountrySelectWithSearch
            value={watch("shippingCountry")}
            onChange={(value) => setValue("shippingCountry", value)}
            name="shippingCountry"
            error={
              errors.shippingCountry?.message && [
                errors.shippingCountry?.message,
              ]
            }
          />
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <CustomInput
              label="First Name"
              id="shippingFirstName"
              name="shippingFirstName"
              placeholder="Enter your first name"
              {...register("shippingFirstName")}
              error={
                errors.shippingFirstName?.message
                  ? [errors.shippingFirstName?.message]
                  : undefined
              }
            />
            <CustomInput
              label="Last Name"
              id="shippingLastName"
              name="shippingLastName"
              placeholder="Enter your last name"
              {...register("shippingLastName")}
              error={
                errors.shippingLastName?.message
                  ? [errors.shippingLastName?.message]
                  : undefined
              }
            />
          </div>
          <CustomInput
            label="Address"
            id="shippingAddress"
            name="shippingAddress"
            placeholder="Enter your address"
            {...register("shippingAddress")}
            error={
              errors.shippingAddress?.message
                ? [errors.shippingAddress?.message]
                : undefined
            }
          />
          <CustomInput
            label="Apartment, suite, etc"
            id="shippingApartment"
            name="shippingApartment"
            placeholder="Enter your apartment, suite, etc"
            {...register("shippingApartment")}
            error={
              errors.shippingApartment?.message
                ? [errors.shippingApartment?.message]
                : undefined
            }
          />
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <CustomInput
              label="Zip Code"
              id="shippingZipCode"
              name="shippingZipCode"
              placeholder="Enter your zip code"
              {...register("shippingZipCode")}
              error={
                errors.shippingZipCode?.message
                  ? [errors.shippingZipCode?.message]
                  : undefined
              }
            />
            <CustomInput
              label="Town / City"
              id="shippingCity"
              name="shippingCity"
              placeholder="Enter your city"
              {...register("shippingCity")}
              error={
                errors.shippingCity?.message
                  ? [errors.shippingCity?.message]
                  : undefined
              }
            />
          </div>
          <CustomInput
            label="Email"
            id="shippingEmail"
            name="shippingEmail"
            placeholder="Enter your email"
            {...register("shippingEmail")}
            error={
              errors.shippingEmail?.message
                ? [errors.shippingEmail?.message]
                : undefined
            }
          />
          <PhoneNumberInput
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
          label="Use shipping address as billing address"
          id="copyBilling"
          checked={copyBilling}
          onCheckedChange={(checked) => setValue("copyBilling", checked)}
        />
        {!copyBilling && (
          <div className="flex flex-col gap-4 mt-6">
            <div className="pb-6 text-xl uppercase">Billing adress</div>

            <CountrySelectWithSearch
              value={watch("billingCountry")}
              onChange={(value) => setValue("billingCountry", value)}
              name="billingCountry"
              error={
                errors.billingCountry?.message
                  ? [errors.billingCountry?.message]
                  : undefined
              }
            />
            <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
              <CustomInput
                label="First Name"
                id="billingFirstName"
                name="billingFirstName"
                placeholder="Enter your first name"
                {...register("billingFirstName")}
                error={
                  errors.billingFirstName?.message
                    ? [errors.billingFirstName?.message]
                    : undefined
                }
              />
              <CustomInput
                label="Last Name"
                id="billingLastName"
                name="billingLastName"
                placeholder="Enter your last name"
                {...register("billingLastName")}
                error={
                  errors.billingLastName?.message
                    ? [errors.billingLastName?.message]
                    : undefined
                }
              />
            </div>
            <CustomInput
              label="Address"
              id="billingAddress"
              name="billingAddress"
              placeholder="Enter your address"
              {...register("billingAddress")}
              error={
                errors.billingAddress?.message
                  ? [errors.billingAddress?.message]
                  : undefined
              }
            />
            <CustomInput
              label="Apartment, suite, etc"
              id="billingApartment"
              name="billingApartment"
              placeholder="Enter your apartment, suite, etc"
              {...register("billingApartment")}
              error={
                errors.billingApartment?.message
                  ? [errors.billingApartment?.message]
                  : undefined
              }
            />
            <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
              <CustomInput
                label="Zip Code"
                id="billingZipCode"
                name="billingZipCode"
                placeholder="Enter your zip code"
                {...register("billingZipCode")}
                error={
                  errors.billingZipCode?.message
                    ? [errors.billingZipCode?.message]
                    : undefined
                }
              />
              <CustomInput
                label="Town / City"
                id="billingCity"
                name="billingCity"
                placeholder="Enter your city"
                {...register("billingCity")}
                error={
                  errors.billingCity?.message
                    ? [errors.billingCity?.message]
                    : undefined
                }
              />
            </div>
            <CustomInput
              label="Email"
              id="billingEmail"
              name="billingEmail"
              placeholder="Enter your email"
              {...register("billingEmail")}
              error={
                errors.billingEmail?.message
                  ? [errors.billingEmail?.message]
                  : undefined
              }
            />
            <PhoneNumberInput
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

        <div className="flex justify-between items-center mt-12">
          <Link
            href="/cart"
            className="flex items-center gap-2 hover:opacity-80 text-foreground text-base"
          >
            <ChevronLeft className="w-6 h-6 text-purple" />
            Return to cart
          </Link>
          <CustomButton
            type="submit"
            disabled={isSubmitting}
            className="bg-purple hover:bg-purple/90 border border-purple w-50 md:w-72 h-12 text-white"
          >
            Order review
          </CustomButton>
        </div>
      </form>
    </>
  );
}
