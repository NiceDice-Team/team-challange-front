"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signup } from "@/app/actions/auth";
import { CustomInput } from "@/components/shared/CustomInput";

export default function RegisterPage() {
  const [state, action, pending] = useActionState(signup, undefined);

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
          {/* <input
            defaultValue="User"
            placeholder="Name"
            id="firstname"
            name="firstname"
            className="w-full md:flex-1 p-4 bg-white text-black outline-none"
          /> */}
          <CustomInput
            defaultValue="Anna"
            placeholder="Enter your name"
            id="firstname"
            label="First name"
            error={state?.errors?.firstname}
          />
          <CustomInput
            defaultValue="Vinture"
            placeholder="Enter your last name"
            id="lastname"
            label="Last name"
            error={state?.errors?.lastname}
          />
          <CustomInput
            defaultValue="anna@gmail.com"
            placeholder="Enter email address"
            id="email"
            label="Email"
            error={state?.errors?.email}
          />
          <CustomInput
            defaultValue="12345678"
            placeholder="Enter password"
            id="password"
            label="password"
            error={state?.errors?.password}
          />
          <CustomInput
            placeholder="Enter password"
            id="confirmPassword"
            label="Confirm Password"
            error={state?.errors?.confirmPassword}
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
