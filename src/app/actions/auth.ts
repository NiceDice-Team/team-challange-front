import { FormState, SignupFormSchema } from "../lib/definitions";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function signup(state: FormState, formData: FormData) {
  for (const pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

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
    username: validatedFields.data.email,
  };

  const response = await fetch(`${API_URL}users/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });
}
