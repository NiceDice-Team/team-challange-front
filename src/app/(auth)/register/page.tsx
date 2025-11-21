"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signup } from "@/app/actions/auth";
import { CustomInput } from "@/components/shared/CustomInput";
import CustomCheckbox from "@/components/shared/CustomCheckbox";
import Image from "next/image";
import ArrowNext from "../../../../public/icons/ArrowNext.svg";
import { FormState, signupFrontSchema } from "@/lib/definitions";
import { CustomButton } from "@/components/shared/CustomButton";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { PublicRoute } from "@/components/auth/RouteGuards";

function RegisterPageContent() {
  const [isChecked, setIsChecked] = useState(true);
  const [state, action, pending] = useActionState<FormState, FormData>(signup, {
    errors: {},
  });

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    watch,
  } = useForm({
    resolver: zodResolver(signupFrontSchema),
    mode: "onChange",
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: any) => {
    const formData = new FormData();
    formData.append("firstname", data.firstname);
    formData.append("lastname", data.lastname);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);
    action(formData);
  };

  return (
    <div className="mx-auto mt-20">
      <h1 className="mb-9 font-normal md:text-title text-2xl text-center uppercase">
        Create account
      </h1>
      <div className="mb-12 text-base text-center">
        <p>Join our community of board game enthusiasts! 🎲</p>
        <p>Fill in the details below to get started</p>
      </div>

      <div className="flex flex-col justify-center items-center mb-28">
        <form
          className="flex flex-col gap-4 mb-12 md:w-[500px] w-xs"
          onSubmit={handleSubmit(onSubmit)}
        >
          <CustomInput
            placeholder="Enter your name"
            id="firstname"
            label="First name"
            {...register("firstname")}
            error={
              [
                ...(formErrors.firstname?.message
                  ? [formErrors.firstname.message]
                  : []),
                ...(state?.errors?.firstname ? [state?.errors?.firstname] : []),
              ].filter(Boolean) as string[]
            }
          />
          <CustomInput
            placeholder="Enter your last name"
            id="lastname"
            label="Last name"
            {...register("lastname")}
            error={
              [
                ...(formErrors.lastname?.message
                  ? [formErrors.lastname.message]
                  : []),
                ...(state?.errors?.lastname ? [state?.errors?.lastname] : []),
              ].filter(Boolean) as string[]
            }
          />
          <CustomInput
            placeholder="Enter email address"
            id="email"
            label="Email"
            {...register("email")}
            error={
              [
                ...(formErrors.email?.message
                  ? [formErrors.email.message]
                  : []),
                ...(state?.errors?.email ? [state?.errors?.email] : []),
              ].filter(Boolean) as string[]
            }
          />
          <PasswordInput
            placeholder="Enter password"
            id="password"
            label="password"
            {...register("password")}
            error={
              [
                ...(formErrors.password?.message
                  ? [formErrors.password.message]
                  : []),
                ...(state?.errors?.password ? [state?.errors?.password] : []),
              ].filter(Boolean) as string[]
            }
          />
          <PasswordInput
            placeholder="Enter password"
            id="confirmPassword"
            label="Confirm Password"
            {...register("confirmPassword")}
            error={
              [
                ...(formErrors.confirmPassword?.message
                  ? [formErrors.confirmPassword.message]
                  : []),
                ...(state?.errors?.confirmPassword
                  ? [state?.errors?.confirmPassword]
                  : []),
              ].filter(Boolean) as string[]
            }
          />
          {state?.errors?.serverError && (
            <p className="text-error">{state.errors.serverError}</p>
          )}
          <div className="flex flex-col gap-2">
            <CustomCheckbox
              id="privacy"
              checked={isChecked}
              onCheckedChange={() => setIsChecked((prev) => !prev)}
              label={
                <p>
                  I agree to the{" "}
                  <Link href="/" className="underline">
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link href="/" className="underline">
                    Terms of Service
                  </Link>
                </p>
              }
            />
            <CustomCheckbox
              id="subscribe"
              label="Subscribe to news, updates & special offers"
            />
          </div>

          <CustomButton type="submit" disabled={pending || !isChecked}>
            REGISTER
          </CustomButton>
        </form>

        <Link href="/login" className="flex flex-col items-center">
          <p className="text-purple">Already have an account?</p>
          <div className="flex gap-1">
            <span className="text-purple underline">Log in here</span>
            <Image src={ArrowNext} alt="arrow" />
          </div>
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <PublicRoute>
      <RegisterPageContent />
    </PublicRoute>
  );
}
