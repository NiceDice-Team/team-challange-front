"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { signup } from "@/app/actions/auth";
import { CustomInput } from "@/components/shared/CustomInput";
import CustomCheckbox from "@/components/shared/CustomCheckbox";
import Image from "next/image";
import ArrowNext from "../../../../public/icons/ArrowNext.svg";
import { FormState } from "@/app/lib/definitions";
import { CustomButton } from "@/components/shared/CustomButton";
import { API_URL } from "@/services/api";
import { PasswordInput } from "@/components/shared/PasswordInput";

export default function RegisterPage() {
  const [isChecked, setIsChecked] = useState(true);
  const [state, action, pending] = useActionState<FormState, FormData>(signup, {
    errors: {},
  });

  return (
    <div className="mx-auto mt-20">
      <h1 className="mb-9 font-normal text-title text-center uppercase">
        Create account
      </h1>
      <div className="mb-12 text-base text-center">
        <p>Join our community of board game enthusiasts! 🎲</p>
        <p>Fill in the details below to get started</p>
      </div>

      <div className="flex flex-col justify-center items-center mb-28">
        <form className="flex flex-col gap-4 mb-12 w-[500px]" action={action}>
          <CustomInput
            placeholder="Enter your name"
            id="firstname"
            label="First name"
            name="firstname"
            error={state?.errors?.firstname}
          />
          <CustomInput
            placeholder="Enter your last name"
            id="lastname"
            label="Last name"
            name="lastname"
            error={state?.errors?.lastname}
          />
          <CustomInput
            placeholder="Enter email address"
            id="email"
            label="Email"
            name="email"
            error={state?.errors?.email}
          />
          <PasswordInput
            placeholder="Enter password"
            id="password"
            label="password"
            name="password"
            error={state?.errors?.password}
          />
          <PasswordInput
            placeholder="Enter password"
            id="confirmPassword"
            label="Confirm Password"
            name="confirmPassword"
            error={state?.errors?.confirmPassword}
          />
          {state.errors.serverError && (
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

        <p className="text-purple">Already have an account?</p>
        <Link href="/login" className="flex gap-1">
          <span className="text-purple underline">Log in here</span>
          <Image src={ArrowNext} alt="arrow" />
        </Link>
      </div>
    </div>
  );
}
