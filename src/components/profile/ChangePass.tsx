import React from "react";
import { CustomInput } from "../shared/CustomInput";
import Modal from "../shared/Modal";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  newPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
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
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ChangePasswordFormState) => {
    console.log(data);
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
        <CustomInput
          label="Current Password"
          id="currentPassword"
          name="currentPassword"
          placeholder="Enter your current password"
          type="password"
          {...register("currentPassword")}
        />
        <CustomInput
          label="New Password"
          id="newPassword"
          name="newPassword"
          placeholder="Enter your new password"
          type="password"
          {...register("newPassword")}
        />
        <CustomInput
          label="Confirm New Password"
          id="confirmNewPassword"
          name="confirmNewPassword"
          placeholder="Enter your confirm new password"
          type="password"
          {...register("confirmPassword")}
        />
      </div>
    </Modal>
  );
};

export default ChangePass;
