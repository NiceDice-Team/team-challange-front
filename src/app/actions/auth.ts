"use server";

import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import {
  FormState,
  SignupFormSchema,
  LoginFormState,
  loginSchema,
} from "../../lib/definitions";

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

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      if (contentType && contentType.includes("application/json")) {
        try {
          const res = await response.json();
          let errors = {
            firstname: res.error_message?.first_name,
            lastname: res.error_message?.last_name,
            email: res.error_message?.email,
            password: res.error_message?.password,
            confirmPassword: res.error_message?.confirm_password,
          };

          return {
            firstname,
            lastname,
            email,
            password,
            confirmPassword,
            errors: errors,
          };
        } catch (jsonError) {
          console.error("Error parsing JSON response:", jsonError);
          errorMessage += " - Invalid JSON response";
        }
      } else {
        // Если ответ не JSON, получаем текст для отладки
        const textResponse = await response.text();
        console.error(
          "Non-JSON response received:",
          textResponse.substring(0, 200)
        );
        errorMessage += " - Server returned non-JSON response";
      }

      return {
        firstname,
        lastname,
        email,
        password,
        confirmPassword,
        errors: {
          serverError: errorMessage,
        },
      };
    }

    const data = await response.json();
    console.log("Registration successful:", data);
  } catch (error) {
    console.error("Error during signup:", error, error.message);

    let errorMessage = "An error occurred during signup. Please try again.";
    if (error instanceof TypeError && error.message.includes("fetch")) {
      errorMessage = "Network error: Unable to connect to server";
    } else if (error instanceof SyntaxError && error.message.includes("JSON")) {
      errorMessage = "Server response error: Invalid data format";
    }

    return {
      firstname,
      lastname,
      email,
      password,
      confirmPassword,
      errors: {
        serverError: errorMessage,
      },
    };
  }
  redirect("/confirm-signup", RedirectType.replace);
}

export async function signin(
  state: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const validatedFields = loginSchema.safeParse({
    email,
    password,
  });

  if (!validatedFields.success) {
    return {
      email,
      password,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const requestBody = {
    email: validatedFields.data.email,
    password: validatedFields.data.password,
  };

  try {
    const response = await fetch(`${API_URL}users/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const res = await response.json();

    if (!response.ok) {
      let errors: any = {};
      if (res.errors && res.errors.length > 0) {
        errors = res.errors.reduce((acc: any, error: any) => {
          if (error.attr) {
            acc[error.attr] = [error.detail];
          } else {
            acc.serverError =
              error.detail ||
              "An error occurred during signin. Please try again." +
                " If the problem persists, contact support.";
          }
          return acc;
        }, {});
      } else {
        errors.serverError = "Invalid email or password.";
      }

      return {
        email,
        password,
        errors: errors,
      };
    }

    const token = res.access;
    const refresh = res.refresh;

    if (!token || !refresh) {
      return {
        email,
        password,
        errors: {
          serverError: "No token received",
        },
      };
    }
    // save token in cookies
    (await cookies()).set("access_token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 15, // 15 minutes
    });

    // save refreshToken in cookies
    (await cookies()).set("refresh_token", refresh, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return {
      email,
      password,
      accessToken: token,
      refreshToken: refresh,
    };
  } catch (error) {
    console.error("Error during signin:", error, error.message);
    return {
      email,
      password,
      errors: {
        serverError: "An error occurred during signin. Please try again.",
      },
    };
  }
}
