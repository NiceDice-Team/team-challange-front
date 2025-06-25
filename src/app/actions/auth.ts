"use server";

import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { FormState, SignupFormSchema } from "../lib/definitions";

type ResponseType = {
  access?: string;
  refresh?: string;
  errors?: {};
};

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function signup(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const firstname = String(formData.get("firstname"));
  const email = String(formData.get("email"));
  const lastname = String(formData.get("lastname"));
  const password = String(formData.get("password"));
  const confirmPassword = String(formData.get("confirmPassword"));

  const validatedFields = SignupFormSchema.safeParse({
    firstname,
    lastname,
    email,
    password,
    confirmPassword,
  });

  if (!validatedFields.success) {
    return {
      firstname,
      lastname,
      email,
      password,
      confirmPassword,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const requestBody = {
    first_name: validatedFields.data.firstname,
    last_name: validatedFields.data.lastname,
    email: validatedFields.data.email,
    password: validatedFields.data.password,
    username: validatedFields.data.email.split("@")[0],
  };

  try {
    const response = await fetch(`${API_URL}users/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const res = await response.json();
    if (!response.ok) {
      const err = res;
      if (err?.username) {
        err.email = err.username;
      }
      return {
        firstname,
        lastname,
        email,
        password,
        confirmPassword,
        errors: err || {
          serverError:
            "An error occurred during signup. Please try again." +
            " If the problem persists, contact support.",
        },
      };
    }
    const token = res.access;
    const refresh = res.refresh;
    if (!token || !refresh) {
      return {
        firstname,
        lastname,
        email,
        password,
        confirmPassword,
        errors: {
          serverError: "No token received",
        },
      };
    }

    // save token in cookies
    (await cookies()).set("access_token", token, {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 15, // 15 minutes
    });

    // save refreshToken in cookies
    (await cookies()).set("refresh_token", refresh, {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  } catch (error) {
    console.error("Error during signup:", error);
    return {
      firstname,
      lastname,
      email,
      password,
      confirmPassword,
      errors: {
        serverError: "An error occurred during signup. Please try again.",
      },
    };
  }
  redirect("/complete-signup", RedirectType.replace);
}
