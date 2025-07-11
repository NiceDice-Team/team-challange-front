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
    console.log("res", res);
    if (!response.ok) {
      let errors = {};
      if (res.errors && res.errors.length > 0) {
        errors = res.errors.reduce((acc, error) => {
          if (error.attr) {
            acc[error.attr] = [error.detail];
          } else {
            acc.serverError =
              error.detail ||
              "An error occurred during signup. Please try again." +
                " If the problem persists, contact support.";
          }
          return acc;
        }, {});
      }

      return {
        firstname,
        lastname,
        email,
        password,
        confirmPassword,
        errors: errors,
      };
    }
    // const token = res.access;
    // const refresh = res.refresh;
    // if (!token || !refresh) {
    //   return {
    //     firstname,
    //     lastname,
    //     email,
    //     password,
    //     confirmPassword,
    //     errors: {
    //       serverError: "No token received",
    //     },
    //   };
    // }

    // save token in cookies
    // (await cookies()).set("access_token", token, {
    //   httpOnly: true,
    //   secure: true,
    //   path: "/",
    //   maxAge: 60 * 15, // 15 minutes
    // });

    // // save refreshToken in cookies
    // (await cookies()).set("refresh_token", refresh, {
    //   httpOnly: true,
    //   secure: true,
    //   path: "/",
    //   maxAge: 60 * 60 * 24 * 7, // 7 days
    // });
  } catch (error) {
    console.error("Error during signup:", error, error.message);
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
