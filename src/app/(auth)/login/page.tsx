"use client";

import { CustomButton } from "@/components/shared/CustomButton";
import { CustomInput } from "@/components/shared/CustomInput";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import {
  LoginFormState,
  loginFrontSchema,
  loginSchema,
} from "@/lib/definitions";
import { GoogleAuthButton } from "@/components/auth/GoogleLogin";
import { FacebookAuthButton } from "@/components/auth/FacebookLogin";
import { useRouter, useSearchParams } from "next/navigation";
import { PublicRoute } from "@/components/auth/RouteGuards";
import { showCustomToast } from "@/components/shared/Toast";
import { getTokens, setTokens } from "@/lib/tokenManager";
import { API_BASE_URL } from "@/config/api";

function LoginPageContent() {
  const params = useSearchParams();
  const router = useRouter();
  const mode = params.get("mode");
  const message = params.get("message");
  const activationStatus = params.get("activation_status");
  const { refreshToken } = getTokens();

  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState<LoginFormState["errors"]>(
    {},
  );
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  useEffect(() => {
    if (refreshToken) {
      showCustomToast({
        type: "success",
        title: "Success! You are logged in.",
        description: "You can now continue your adventure",
      });
      setTimeout(() => router.push("/"), 1000);
    }
  }, [refreshToken, router]);

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

    if (serverErrors[name as keyof typeof serverErrors]) {
      setServerErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof typeof newErrors];
        return newErrors;
      });
    }

    const result = loginFrontSchema.safeParse({ ...values, [name]: value });
    if (!result.success) {
      const fieldError = result.error.flatten().fieldErrors[name]?.[0];
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setServerErrors({});
    setErrors({});

    const validatedFields = loginSchema.safeParse({
      email: values.email,
      password: values.password,
    });

    if (!validatedFields.success) {
      const fieldErrors = validatedFields.error.flatten().fieldErrors;
      const formattedErrors: LoginFormState["errors"] = {};

      if (fieldErrors.email) {
        formattedErrors.email = Array.isArray(fieldErrors.email)
          ? fieldErrors.email
          : [fieldErrors.email];
      }
      if (fieldErrors.password) {
        formattedErrors.password = Array.isArray(fieldErrors.password)
          ? fieldErrors.password
          : [fieldErrors.password];
      }

      setServerErrors(formattedErrors);
      setIsLoading(false);
      return;
    }

    const requestBody = {
      email: validatedFields.data.email,
      password: validatedFields.data.password,
    };

    try {
      const response = await fetch(`${API_BASE_URL}users/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const res = await response.json();

      if (!response.ok) {
        let errors: LoginFormState["errors"] = {};

        if (
          res.errors &&
          typeof res.errors === "object" &&
          !Array.isArray(res.errors)
        ) {
          if (res.errors.email) {
            errors.email = Array.isArray(res.errors.email)
              ? res.errors.email
              : [res.errors.email];
          }
          if (res.errors.password) {
            errors.password = Array.isArray(res.errors.password)
              ? res.errors.password
              : [res.errors.password];
          }
        } else if (
          res.errors &&
          Array.isArray(res.errors) &&
          res.errors.length > 0
        ) {
          errors = res.errors.reduce(
            (acc: LoginFormState["errors"], error: any) => {
              if (error.attr) {
                const fieldName =
                  error.attr === "email"
                    ? "email"
                    : error.attr === "password"
                      ? "password"
                      : null;
                if (fieldName) {
                  acc[fieldName] = Array.isArray(acc[fieldName])
                    ? [...(acc[fieldName] || []), error.detail]
                    : [error.detail];
                } else {
                  acc.serverError =
                    error.detail ||
                    "An error occurred during signin. Please try again.";
                }
              } else {
                acc.serverError =
                  error.detail ||
                  "An error occurred during signin. Please try again.";
              }
              return acc;
            },
            {},
          );
        } else if (res.error_message) {
          if (res.error_message.email) {
            errors.email = Array.isArray(res.error_message.email)
              ? res.error_message.email
              : [res.error_message.email];
          }
          if (res.error_message.password) {
            errors.password = Array.isArray(res.error_message.password)
              ? res.error_message.password
              : [res.error_message.password];
          }
          if (!errors.email && !errors.password) {
            errors.serverError =
              typeof res.error_message === "string"
                ? res.error_message
                : "Invalid email or password.";
          }
        } else {
          errors.serverError =
            res.detail || res.message || "Invalid email or password.";
        }

        setServerErrors(errors);
        setIsLoading(false);
        return;
      }

      const token = res.access;
      const refresh = res.refresh;

      if (!token || !refresh) {
        setServerErrors({
          serverError: "No token received",
        });
        setIsLoading(false);
        return;
      }

      setTokens(token, refresh);

      showCustomToast({
        type: "success",
        title: "Success! You are logged in.",
        description: "You can now continue your adventure",
      });

      setTimeout(() => router.push("/"), 1000);
    } catch (error: any) {
      console.error("Error during signin:", error);
      setServerErrors({
        serverError: "An error occurred during signin. Please try again.",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mx-auto mt-20">
      <div className="bg-purple md:bg-transparent mb-6 p-6 text-white md:text-black">
        <h1 className="mb-9 font-normal md:text-title text-xl text-center uppercase">
          {mode === "back" ? (
            "👋 Welcome back!"
          ) : (
            <div className="flex md:flex-row flex-col items-center gap-2">
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
          <div className="text-base text-center">
            <p>🎯 Don&apos;t forget to log in!</p>
            <p>Unlock exclusive rewards, and track your orders with ease.</p>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center items-center mb-28 md:w-[500px] w-xs">
        <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
          <CustomInput
            placeholder="Enter email address"
            id="email"
            label="Email"
            name="email"
            value={values.email}
            error={
              [
                ...(serverErrors?.email
                  ? Array.isArray(serverErrors.email)
                    ? serverErrors.email
                    : [serverErrors.email]
                  : []),
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
            value={values.password}
            error={
              [
                ...(serverErrors?.password
                  ? Array.isArray(serverErrors.password)
                    ? serverErrors.password
                    : [serverErrors.password]
                  : []),
                ...(errors.password ? [errors.password] : []),
              ].filter(Boolean) as string[]
            }
            onChange={handleChange}
          />
          <Link href="/forgot-password" className="mb-4 text-right underline">
            Forgot your password?
          </Link>
          {serverErrors?.serverError && (
            <div className="bg-red-50 mb-2 p-3 border border-red-200 rounded">
              <p className="text-error text-sm">
                {Array.isArray(serverErrors.serverError)
                  ? serverErrors.serverError.join(", ")
                  : serverErrors.serverError}
              </p>
            </div>
          )}
          <CustomButton type="submit" disabled={isLoading} loading={isLoading}>
            SIGN IN
          </CustomButton>
        </form>
        <div className="flex items-center gap-2 mt-6 mb-4 w-full">
          <div className="bg-gray-text h-px grow"></div>
          <span className="text-gray-text">or</span>
          <div className="bg-gray-text h-px grow"></div>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <GoogleAuthButton />
          {/* <FacebookAuthButton /> */}
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
