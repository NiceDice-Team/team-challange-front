"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { signup } from "@/app/actions/auth";
import { CustomInput } from "@/components/shared/CustomInput";
import CustomCheckbox from "@/components/shared/CustomCheckbox";
import Image from "next/image";
import ArrowNext from "../../../../public/icons/ArrowNext.svg";
import { FormState } from "@/lib/definitions";
import { CustomButton } from "@/components/shared/CustomButton";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { PublicRoute } from "@/components/auth/RouteGuards";

function RegisterPageContent() {
  const [isChecked, setIsChecked] = useState(true);
  const [state, action, pending] = useActionState<FormState, FormData>(signup, {
    errors: {},
  });
  const [formState, setFormState] = useState<FormState>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (state) {
      setFormState((prev) => ({
        firstname: state.firstname || prev.firstname,
        lastname: state.lastname || prev.lastname,
        email: state.email || prev.email,
        password: state.password || prev.password,
        confirmPassword: state.confirmPassword || prev.confirmPassword,
      }));
    }
  }, [state]);

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
            value={formState.firstname}
            onChange={(e) => handleChange("firstname", e.target.value)}
          />
          <CustomInput
            placeholder="Enter your last name"
            id="lastname"
            label="Last name"
            name="lastname"
            error={state?.errors?.lastname}
            value={formState.lastname}
            onChange={(e) => handleChange("lastname", e.target.value)}
          />
          <CustomInput
            placeholder="Enter email address"
            id="email"
            label="Email"
            name="email"
            error={state?.errors?.email}
            value={formState.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          <PasswordInput
            placeholder="Enter password"
            id="password"
            label="password"
            name="password"
            error={state?.errors?.password}
            value={formState.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
          <PasswordInput
            placeholder="Enter password"
            id="confirmPassword"
            label="Confirm Password"
            name="confirmPassword"
            error={state?.errors?.confirmPassword}
            value={formState.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
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
