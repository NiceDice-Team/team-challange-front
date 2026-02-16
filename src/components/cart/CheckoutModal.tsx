import z from "zod";
import Modal from "../shared/Modal";
import { PasswordInput } from "../shared/PasswordInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { CustomInput } from "../shared/CustomInput";
import { CustomButton } from "../shared/CustomButton";
import { useState } from "react";
import { loginSchema, LoginFormState } from "@/lib/definitions";
import { API_BASE_URL } from "@/config/api";
import { setTokens } from "@/lib/tokenManager";
import { useRouter } from "next/navigation";

const checkoutSchema = z.object({
  email: z.string().nonempty("Email is required").email("Invalid email"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(128, { message: "Password must be less than 128 characters" }),
});
type CheckoutFormState = z.infer<typeof checkoutSchema>;

const CheckoutModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState<LoginFormState["errors"]>(
    {},
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormState>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: CheckoutFormState) => {
    setIsLoading(true);
    setServerErrors({});

    const validatedFields = loginSchema.safeParse({
      email: data.email,
      password: data.password,
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

      onClose();
      router.push("/checkout-order");
      router.refresh();
    } catch (error: any) {
      console.error("Error during signin:", error);
      setServerErrors({
        serverError: "An error occurred during signin. Please try again.",
      });
      setIsLoading(false);
    }
  };
  return (
    <Modal
      open={open}
      title=""
      description=""
      onConfirm={handleSubmit(onSubmit)}
      onCancel={onClose}
      footer={false}
      className="sm:rounded-none max-w-2xl"
    >
      <div className="flex flex-col items-center gap-4 max-w-2xl">
        <h3 className="flex items-center gap-2 text-black text-3xl uppercase">
          🔓Log in here or
          <Link href="/register" className="underline">
            create account
          </Link>
        </h3>
        <p className="mb-4 text-gray-2 text-base text-center">
          🎯 Don’t forget to log in!
          <br />
          Unlock exclusive rewards, and track your orders with ease.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 px-4 w-full"
        >
          <CustomInput
            label="Email"
            id="email"
            placeholder="Enter your Email"
            {...register("email")}
            error={
              [
                ...(errors.email?.message ? [errors.email.message] : []),
                ...(serverErrors?.email
                  ? Array.isArray(serverErrors.email)
                    ? serverErrors.email
                    : [serverErrors.email]
                  : []),
              ].filter(Boolean) as string[]
            }
          />
          <PasswordInput
            label="Password"
            id="password"
            placeholder="Enter your new password"
            {...register("password")}
            error={
              [
                ...(errors.password?.message ? [errors.password.message] : []),
                ...(serverErrors?.password
                  ? Array.isArray(serverErrors.password)
                    ? serverErrors.password
                    : [serverErrors.password]
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
          <CustomButton
            type="submit"
            className="mb-6 w-full"
            disabled={isLoading}
            loading={isLoading}
          >
            SIGN IN
          </CustomButton>
          <Link
            href="/checkout-order"
            className="text-purple text-center underline"
          >
            Continue as a guest
          </Link>
        </form>
      </div>
    </Modal>
  );
};

export default CheckoutModal;
