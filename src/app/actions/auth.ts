"use server";

import { cookies } from "next/headers";
import { FormState, SignupFormSchema } from "../lib/definitions";

type ResponseType = {
  access?: string;
  refresh?: string;
  errors?: {};
};

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function signup(state: FormState, formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse({
    firstname: formData.get("firstname"),
    lastname: formData.get("lastname"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return {
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

    const res = (await response.json()) as ResponseType;
    if (!response.ok) {
      const err = res;
      return {
        success: false,
        errors: err,
      };
    }
    const token = res.access;
    const refresh = res.refresh;
    if (!token || !refresh) {
      return { success: false, serverError: "No token received" };
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
      errors: {
        global: ["An error occurred during signup. Please try again."],
      },
    };
  }
}
