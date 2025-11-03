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

  return (
    <Modal
      open={open}
      title="Change Password"
      description="Update your password to keep your account secure."
      onConfirm={() => {}}
      onCancel={onClose}
      confirmButtonText="Update Password"
    >
      <div>
        <h3>Current Password</h3>
        <CustomInput
          label="Current Password"
          id="currentPassword"
          name="currentPassword"
          placeholder="Enter your current password"
          type="password"
          {...register("currentPassword")}
        />
        <p>Change your password</p>
      </div>
    </Modal>
  );
};

export default ChangePass;
