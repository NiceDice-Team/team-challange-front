import React from "react";
import Modal from "../shared/Modal";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordInput } from "../shared/PasswordInput";
import { fetchAPI } from "@/services/api";
import { showCustomToast } from "../shared/Toast";

const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(128, { message: "Password must be less than 128 characters" }),
  newPassword: z
    .string()
    .nonempty("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(128, { message: "Password must be less than 128 characters" })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, {
      message: "Password must сontain at least one letter and one number.",
    }),
  confirmNewPassword: z
    .string()
    .nonempty("Confirm password is required")
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

type ChangePasswordFormState = z.infer<typeof changePasswordSchema>;
const ChangePass = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormState) => {
    try {
      await fetchAPI("users/change-password/", {
        method: "POST",
        body: {
          current_password: data.currentPassword,
          new_password: data.newPassword,
          confirm_new_password: data.confirmNewPassword,
        },
      });
      onClose();
      showCustomToast({
        type: "success",
        title: "Password changed successfully",
        description: "You can now continue your adventure",
      });
    } catch (error) {
      console.error("Error changing password:", error);
      showCustomToast({
        type: "error",
        title: "Error changing password",
        description: "Please try again.",
      });
    }
  };
  return (
    <Modal
      open={open}
      title="Change Password"
      description="Update your password to keep your account secure."
      onConfirm={handleSubmit(onSubmit)}
      onCancel={onClose}
      confirmButtonText="Update Password"
    >
      <div className="flex flex-col gap-4">
        <PasswordInput
          label="Current Password"
          id="currentPassword"
          placeholder="Enter your current password"
          {...register("currentPassword")}
          error={
              [
                ...(errors.currentPassword?.message
                  ? [errors.currentPassword.message]
                  : []),
                ...(errors?.currentPassword
                  ? [errors?.currentPassword]
                  : []),
              ].filter(Boolean) as string[]
            }
        />
        <PasswordInput
          label="New Password"
          id="newPassword"
          placeholder="Enter your new password"
          {...register("newPassword")}
          error={
            [
                ...(errors.newPassword?.message
                  ? [errors.newPassword.message]
                  : []),
                ...(errors?.newPassword
                  ? [errors?.newPassword]
                  : []),
              ].filter(Boolean) as string[]
          }
        />
        <PasswordInput
          label="Confirm New Password"
          id="confirmNewPassword"
          placeholder="Enter your confirm new password"
          {...register("confirmNewPassword")}
          error={
            [
                ...(errors.confirmNewPassword?.message
                  ? [errors.confirmNewPassword.message]
                  : []),
                ...(errors?.confirmNewPassword
                  ? [errors?.confirmNewPassword]
                  : []),
              ].filter(Boolean) as string[]
          }
        />
      </div>
    </Modal>
  );
};

export default ChangePass;
