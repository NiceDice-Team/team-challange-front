"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomInput } from "@/components/shared/CustomInput";
import CustomCheckbox from "@/components/shared/CustomCheckbox";
import Image from "next/image";
import ArrowNext from "../../../../public/icons/ArrowNext.svg";
import {
  FormState,
  signupFrontSchema,
  SignupFormSchema,
} from "@/lib/definitions";
import { CustomButton } from "@/components/shared/CustomButton";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { PublicRoute } from "@/components/auth/RouteGuards";
import { API_BASE_URL } from "@/config/api";

function RegisterPageContent() {
  const [isChecked, setIsChecked] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState<FormState["errors"]>({});
  const router = useRouter();

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

  const watchedFields = watch();

  const handleFieldChange = (
    fieldName:
      | "firstname"
      | "lastname"
      | "email"
      | "password"
      | "confirmPassword",
  ) => {
    if (serverErrors[fieldName]) {
      setServerErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setServerErrors({});

    const validatedFields = SignupFormSchema.safeParse({
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });

    if (!validatedFields.success) {
      const fieldErrors = validatedFields.error.flatten().fieldErrors;
      const formattedErrors: FormState["errors"] = {};

      if (fieldErrors.firstname) {
        formattedErrors.firstname = Array.isArray(fieldErrors.firstname)
          ? fieldErrors.firstname
          : [fieldErrors.firstname as string];
      }
      if (fieldErrors.lastname) {
        formattedErrors.lastname = Array.isArray(fieldErrors.lastname)
          ? fieldErrors.lastname
          : [fieldErrors.lastname as string];
      }
      if (fieldErrors.email) {
        formattedErrors.email = Array.isArray(fieldErrors.email)
          ? fieldErrors.email
          : [fieldErrors.email as string];
      }
      if (fieldErrors.password) {
        formattedErrors.password = Array.isArray(fieldErrors.password)
          ? fieldErrors.password
          : [fieldErrors.password as string];
      }
      if (fieldErrors.confirmPassword) {
        formattedErrors.confirmPassword = Array.isArray(
          fieldErrors.confirmPassword,
        )
          ? fieldErrors.confirmPassword
          : [fieldErrors.confirmPassword as string];
      }

      setServerErrors(formattedErrors);
      setIsLoading(false);
      return;
    }

    const requestBody = {
      first_name: validatedFields.data.firstname,
      last_name: validatedFields.data.lastname,
      email: validatedFields.data.email,
      password: validatedFields.data.password,
      password_confirm: validatedFields.data.confirmPassword,
      privacy_policy: true,
    };

    try {
      const response = await fetch(`${API_BASE_URL}users/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

        if (contentType && contentType.includes("application/json")) {
          try {
            const res = await response.json();
            const errors: FormState["errors"] = {};

            if (res.errors && typeof res.errors === "object" && !Array.isArray(res.errors)) {
              if (res.errors.email) {
                errors.email = Array.isArray(res.errors.email)
                  ? res.errors.email
                  : [res.errors.email];
              }
              if (res.errors.first_name) {
                errors.firstname = Array.isArray(res.errors.first_name)
                  ? res.errors.first_name
                  : [res.errors.first_name];
              }
              if (res.errors.last_name) {
                errors.lastname = Array.isArray(res.errors.last_name)
                  ? res.errors.last_name
                  : [res.errors.last_name];
              }
              if (res.errors.password) {
                errors.password = Array.isArray(res.errors.password)
                  ? res.errors.password
                  : [res.errors.password];
              }
              if (res.errors.password_confirm) {
                errors.confirmPassword = Array.isArray(res.errors.password_confirm)
                  ? res.errors.password_confirm
                  : [res.errors.password_confirm];
              }
            }

            if (res.error_message) {
              if (res.error_message.first_name) {
                errors.firstname = Array.isArray(res.error_message.first_name)
                  ? res.error_message.first_name
                  : [res.error_message.first_name];
              }
              if (res.error_message.last_name) {
                errors.lastname = Array.isArray(res.error_message.last_name)
                  ? res.error_message.last_name
                  : [res.error_message.last_name];
              }
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
              if (res.error_message.password_confirm) {
                errors.confirmPassword = Array.isArray(
                  res.error_message.password_confirm,
                )
                  ? res.error_message.password_confirm
                  : [res.error_message.password_confirm];
              }
            }

            if (res.errors && Array.isArray(res.errors)) {
              res.errors.forEach((error: any) => {
                if (error.attr === "first_name" || error.attr === "firstname") {
                  errors.firstname = Array.isArray(errors.firstname)
                    ? [...errors.firstname, error.detail]
                    : [error.detail];
                } else if (
                  error.attr === "last_name" ||
                  error.attr === "lastname"
                ) {
                  errors.lastname = Array.isArray(errors.lastname)
                    ? [...errors.lastname, error.detail]
                    : [error.detail];
                } else if (error.attr === "email") {
                  errors.email = Array.isArray(errors.email)
                    ? [...errors.email, error.detail]
                    : [error.detail];
                } else if (error.attr === "password") {
                  errors.password = Array.isArray(errors.password)
                    ? [...errors.password, error.detail]
                    : [error.detail];
                } else if (
                  error.attr === "password_confirm" ||
                  error.attr === "confirmPassword"
                ) {
                  errors.confirmPassword = Array.isArray(errors.confirmPassword)
                    ? [...errors.confirmPassword, error.detail]
                    : [error.detail];
                } else {
                  errors.serverError = error.detail || errorMessage;
                }
              });
            }

            if (Object.keys(errors).length === 0 && res.detail) {
              errors.serverError = res.detail;
            } else if (Object.keys(errors).length === 0) {
              errors.serverError = errorMessage;
            }

            setServerErrors(errors);
            setIsLoading(false);
            return;
          } catch (jsonError) {
            console.error("Error parsing JSON response:", jsonError);
            errorMessage += " - Invalid JSON response";
          }
        } else {
          const textResponse = await response.text();
          console.error(
            "Non-JSON response received:",
            textResponse.substring(0, 200),
          );
          errorMessage += " - Server returned non-JSON response";
        }

        setServerErrors({ serverError: errorMessage });
        setIsLoading(false);
        return;
      }

      const responseData = await response.json();
      
      router.push("/confirm-signup");
    } catch (error: any) {
      console.error("Error during signup:", error);

      let errorMessage = "An error occurred during signup. Please try again.";
      if (error instanceof TypeError && error.message.includes("fetch")) {
        errorMessage = "Network error: Unable to connect to server";
      } else if (
        error instanceof SyntaxError &&
        error.message.includes("JSON")
      ) {
        errorMessage = "Server response error: Invalid data format";
      }

      setServerErrors({ serverError: errorMessage });
      setIsLoading(false);
    }
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
            {...register("firstname", {
              onChange: () => handleFieldChange("firstname"),
            })}
            error={
              [
                ...(formErrors.firstname?.message
                  ? [formErrors.firstname.message]
                  : []),
                ...(serverErrors?.firstname
                  ? Array.isArray(serverErrors.firstname)
                    ? serverErrors.firstname
                    : [serverErrors.firstname]
                  : []),
              ].filter(Boolean) as string[]
            }
          />
          <CustomInput
            placeholder="Enter your last name"
            id="lastname"
            label="Last name"
            {...register("lastname", {
              onChange: () => handleFieldChange("lastname"),
            })}
            error={
              [
                ...(formErrors.lastname?.message
                  ? [formErrors.lastname.message]
                  : []),
                ...(serverErrors?.lastname
                  ? Array.isArray(serverErrors.lastname)
                    ? serverErrors.lastname
                    : [serverErrors.lastname]
                  : []),
              ].filter(Boolean) as string[]
            }
          />
          <CustomInput
            placeholder="Enter email address"
            id="email"
            label="Email"
            {...register("email", {
              onChange: () => handleFieldChange("email"),
            })}
            error={
              [
                ...(formErrors.email?.message
                  ? [formErrors.email.message]
                  : []),
                ...(serverErrors?.email
                  ? Array.isArray(serverErrors.email)
                    ? serverErrors.email
                    : [serverErrors.email]
                  : []),
              ].filter(Boolean) as string[]
            }
          />
          <PasswordInput
            placeholder="Enter password"
            id="password"
            label="password"
            {...register("password", {
              onChange: () => handleFieldChange("password"),
            })}
            error={
              [
                ...(formErrors.password?.message
                  ? [formErrors.password.message]
                  : []),
                ...(serverErrors?.password
                  ? Array.isArray(serverErrors.password)
                    ? serverErrors.password
                    : [serverErrors.password]
                  : []),
              ].filter(Boolean) as string[]
            }
          />
          <PasswordInput
            placeholder="Enter password"
            id="confirmPassword"
            label="Confirm Password"
            {...register("confirmPassword", {
              onChange: () => handleFieldChange("confirmPassword"),
            })}
            error={
              [
                ...(formErrors.confirmPassword?.message
                  ? [formErrors.confirmPassword.message]
                  : []),
                ...(serverErrors?.confirmPassword
                  ? Array.isArray(serverErrors.confirmPassword)
                    ? serverErrors.confirmPassword
                    : [serverErrors.confirmPassword]
                  : []),
              ].filter(Boolean) as string[]
            }
          />
          {serverErrors?.serverError && (
            <div className="bg-red-50 mb-2 p-3 border border-red-200 rounded">
              <p className="text-error text-sm">
                {Array.isArray(serverErrors.serverError)
                  ? serverErrors.serverError.join(", ")
                  : serverErrors.serverError}
              </p>
            </div>
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

          <CustomButton
            type="submit"
            disabled={isLoading || !isChecked}
            loading={isLoading}
          >
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
