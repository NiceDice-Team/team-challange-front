"use client";

import { CustomButton } from "@/components/shared/CustomButton";
import { CustomInput } from "@/components/shared/CustomInput";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { useActionState, useEffect } from "react";
import Link from "next/link";
import { LoginFormState } from "@/lib/definitions";
import { signin } from "@/app/actions/auth";
import { GoogleAuthButton } from "@/components/auth/GoogleLogin";
import { FacebookAuthButton } from "@/components/auth/FacebookLogin";
import { useAuthStore } from "@/store/auth";
import { useUserStore } from "@/store/user";
import decodeToken from "@/lib/decodeToken";
import { useRouter } from "next/navigation";

const INITIAL_STATE: LoginFormState = {
  errors: {},
};

export default function LoginPage() {
  const { setTokens, userId } = useAuthStore();
  const { fetchUserData } = useUserStore();
  const router = useRouter();
  const [formState, formAction, pending] = useActionState<
    LoginFormState,
    FormData
  >(signin, INITIAL_STATE);

  useEffect(() => {
    if (formState?.accessToken && formState?.refreshToken) {
      setTokens(formState.accessToken, formState.refreshToken);
      decodeToken(formState.accessToken);
    }
  }, [formState?.accessToken, formState?.refreshToken, setTokens]);

  useEffect(() => {
    if (userId && formState?.accessToken) {
      fetchUserData(userId, formState.accessToken).then(() => {
        router.push("/");
      });
    }
  }, [userId, formState?.accessToken, fetchUserData, router]);

  return (
    <div className="flex flex-col items-center mx-auto mt-20">
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

      <div className="flex flex-col justify-center items-center mb-28 w-[500px]">
        <form className="flex flex-col gap-2 w-full" action={formAction}>
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
        </form>
        <div className="flex items-center gap-2 mt-6 mb-4 w-full">
          <div className="flex-grow bg-gray-text h-px"></div>
          <span className="text-gray-text">or</span>
          <div className="flex-grow bg-gray-text h-px"></div>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <GoogleAuthButton />
          <FacebookAuthButton />
        </div>

        <Link href="/" className="mt-12 text-purple underline">
          Continue as a guest<span className="inline-block ml-1">→</span>
        </Link>
      </div>
    </div>
  );
}
