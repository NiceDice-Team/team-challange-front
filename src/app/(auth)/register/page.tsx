"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signup } from "@/app/actions/auth";
import { CustomInput } from "@/components/shared/CustomInput";
import CustomCheckbox from "@/components/shared/CustomCheckbox";

export default function RegisterPage() {
  const [state, action, pending] = useActionState(signup, {
    success: false,
    errors: {},
    serverError: "",
  });

  return (
    <div className="mx-auto mt-20">
      <h1 className="text-title font-normal text-center mb-9 uppercase">
        Create account
      </h1>
      <div className="text-center text-base mb-12">
        <p>Join our community of board game enthusiasts! 🎲</p>
        <p>Fill in the details below to get started</p>
      </div>

      <div className="flex flex-col items-center justify-center mb-28">
        <form className="flex flex-col gap-4 w-[500px] mb-12" action={action}>
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
          <CustomInput
            placeholder="Enter password"
            id="password"
            label="password"
            name="password"
            error={state?.errors?.password}
          />
          <CustomInput
            placeholder="Enter password"
            id="confirmPassword"
            label="Confirm Password"
            name="confirmPassword"
            error={state?.errors?.confirmPassword}
          />
          {state.message && <p className="text-error">{state.message}</p>}
          <CustomCheckbox
            id="privacy"
            label="I agree to the Privacy Policy and Terms of Service"
          />
          <button
            type="submit"
            disabled={pending}
            className="w-full bg-purple text-white p-4 px-8 text-base uppercase hover:bg-gray-100 transition-all duration-150"
          >
            REGISTER
          </button>
        </form>

        <p className="text-purple">Already have an account?</p>
        <Link href="/login" className="underline text-purple">
          Log in here<span className="inline-block ml-1">→</span>
        </Link>
      </div>
    </div>
  );
}
