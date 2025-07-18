"use client";

import { CustomButton } from "@/components/shared/CustomButton";
import { CustomInput } from "@/components/shared/CustomInput";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { useActionState } from "react";
import Link from "next/link";
import { LoginFormState } from "@/app/lib/definitions";
import { signin } from "@/app/actions/auth";
import { GoogleAuthButton } from "@/components/auth/GoogleLogin";

const INITIAL_STATE: LoginFormState = {
  errors: {},
};

export default function LoginPage() {
  const [formState, formAction, pending] = useActionState<
    LoginFormState,
    FormData
  >(signin, INITIAL_STATE);

  return (
    <div className="mx-auto mt-20">
      <h1 className="mb-9 font-normal text-4xl text-center uppercase">
        Log in here or{" "}
        <Link href="/register" className="underline">
          create account
        </Link>
      </h1>
      <div className="mb-12 text-base text-center">
        <p>🎯 Don&apos;t forget to log in!</p>
        <p>Unlock exclusive rewards, and track your orders with ease.</p>
      </div>

      <div className="flex flex-col justify-center items-center mb-28">
        <form
          className="flex flex-col gap-2 mb-12 w-[500px]"
          action={formAction}
        >
          <CustomInput
            placeholder="Enter email address"
            id="email"
            label="Email"
            name="email"
            error={formState?.errors?.email}
          />
          <PasswordInput
            placeholder="Enter password"
            id="password"
            label="password"
            name="password"
            error={formState?.errors?.password}
          />
          <Link href="/forgot-password" className="mb-4 text-right underline">
            Forgot your password?
          </Link>
          {formState?.errors?.serverError && (
            <p className="text-error">{formState.errors.serverError}</p>
          )}
          <CustomButton type="submit" disabled={pending}>
            SIGN IN
          </CustomButton>
          <GoogleAuthButton />
        </form>

        <Link href="/" className="text-purple underline">
          Continue as a guest<span className="inline-block ml-1">→</span>
        </Link>
      </div>
    </div>
  );
}
