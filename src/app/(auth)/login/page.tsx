"use client";

import { CustomButton } from "@/components/shared/CustomButton";
import { CustomInput } from "@/components/shared/CustomInput";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { useActionState, Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { LoginFormState, loginFrontSchema } from "@/lib/definitions";
import { signin } from "@/app/actions/auth";
import { GoogleAuthButton } from "@/components/auth/GoogleLogin";
import { FacebookAuthButton } from "@/components/auth/FacebookLogin";
import { useRouter, useSearchParams } from "next/navigation";
import { PublicRoute } from "@/components/auth/RouteGuards";
import { showCustomToast } from "@/components/shared/Toast";
import { getTokens } from "@/lib/tokenManager";
import { z } from "zod";

const INITIAL_STATE: LoginFormState = {
  refreshToken: "",
  errors: {},
};


function LoginPageContent() {
  const params = useSearchParams();
  const router = useRouter();
  const mode = params.get("mode");
  const message = params.get("message");
  const activationStatus = params.get("activation_status");
  const {refreshToken} = getTokens();
  const [formState, formAction, pending] = useActionState<
    LoginFormState,
    FormData
  >(signin, INITIAL_STATE);

  
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  useEffect(() => {
    if (formState.refreshToken || refreshToken) {
      showCustomToast({
        type: "success",
        title: "Success! You are logged in.",
        description: "You can now continue your adventure",
      });
      setTimeout(() => router.push("/"), 1000);
    }
  }, [formState, refreshToken]);

  useEffect(() => {
    if (message) {
      switch (activationStatus) {
        case "success":
          showCustomToast({
            type: "success",
            title: "Success! You are logged in.",
          });
          break;
        case "error":
          showCustomToast({
            type: "error",
            title: "Error! You are not logged in.",
          });
          break;
      }
    }
  }, [message, activationStatus]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setValues((prev) => ({ ...prev, [name]: value }));

      const result = loginFrontSchema.safeParse({ ...values, [name]: value });
      if (!result.success) {
        const fieldError = result.error.flatten().fieldErrors[name]?.[0];
        setErrors((prev) => ({ ...prev, [name]: fieldError }));
      } else {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    };

  return (
    <div className="flex flex-col items-center mx-auto mt-20">
      <h1 className="mb-9 font-normal text-4xl text-center uppercase">
        {mode === "back" ? (
          "👋 Welcome back!"
        ) : (
          <div className="flex items-center gap-2">
            Log in here or{" "}
            <Link href="/register" className="underline">
              create account
            </Link>
          </div>
        )}
      </h1>
      {mode === "back" ? (
        <div className="mb-12 text-base text-center">
          <p>🎉 Success! Your password has been changed.</p>
          <p>You can now log in and continue your adventure</p>
        </div>
      ) : (
        <div className="mb-12 text-base text-center">
          <p>🎯 Don&apos;t forget to log in!</p>
          <p>Unlock exclusive rewards, and track your orders with ease.</p>
        </div>
      )}

      <div className="flex flex-col justify-center items-center mb-28 w-[500px]">
        <form className="flex flex-col gap-2 w-full" action={formAction}>
          <CustomInput
            placeholder="Enter email address"
            id="email"
            label="Email"
            name="email"
            error={
              [
                ...(formState?.errors?.email ? [formState.errors.email] : []),
                ...(errors.email ? [errors.email] : []),
              ].filter(Boolean) as string[]
            }
            onChange={handleChange}
          />
          <PasswordInput
            placeholder="Enter password"
            id="password"
            label="password"
            name="password"
            error={
              [
                ...(formState?.errors?.password
                  ? [formState.errors.password]
                  : []),
                ...(errors.password ? [errors.password] : []),
              ].filter(Boolean) as string[]
            }
            onChange={handleChange}
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

export default function LoginPage() {
  return (
    <PublicRoute>
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-screen">
            Loading...
          </div>
        }
      >
        <LoginPageContent />
      </Suspense>
    </PublicRoute>
  );
}
