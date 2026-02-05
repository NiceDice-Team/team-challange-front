import z from "zod";
import Modal from "../shared/Modal";
import { PasswordInput } from "../shared/PasswordInput";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchAPI } from "@/services/api";
import Link from "next/link";
import { CustomInput } from "../shared/CustomInput";
import { CustomButton } from "../shared/CustomButton";
import { useState } from "react";

const checkoutSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .email("Invalid email"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(128, { message: "Password must be less than 128 characters" }),
})
type CheckoutFormState = z.infer<typeof checkoutSchema>;

const CheckoutModal = ({open, onClose}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [serverError, setServerError] = useState<string | null>(null);
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
    try {
      await fetchAPI("users/token/", {
        method: "POST",
        body: data,
      });
    } catch (error) {
      console.error("Error checking out:", error);
      setServerError("Invalid email or password");
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
        <h3 className="flex items-center gap-2 text-black text-3xl uppercase">🔓Log in here or 
          <Link href="/register" className="underline">create account</Link></h3>
          <p className="mb-4 text-gray-2 text-base text-center">🎯 Don’t forget to log in!< br/>Unlock exclusive rewards, and track your orders with ease.</p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 px-4 w-full">
        <CustomInput
          label="Email"
          id="email"
          placeholder="Enter your Email"
          {...register("email")}
          error={errors.email?.message}
        />
        <PasswordInput
          label="Password"
          id="password"
          placeholder="Enter your new password"
          {...register("password")}
          error={errors.password?.message }
        />
        {serverError && <p className="text-error">{serverError}</p>}
        <CustomButton type="submit" className="mb-6 w-full" >SIGN IN</CustomButton>
        <Link href="/checkout-order" className="text-purple text-center underline">Continue as a guest</Link>
        </form>
      </div>
    </Modal>
  );
};

export default CheckoutModal;