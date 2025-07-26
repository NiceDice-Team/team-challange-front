"use client";

import { FC, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { CustomButton } from "../shared/CustomButton";
import FacebookIcon from "../../../public/icons/Facebook.svg";
import Image from "next/image";

interface FacebookAuthButtonProps {
  className?: string;
}

export const FacebookAuthButton: FC<FacebookAuthButtonProps> = ({
  className = "",
}) => {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const handleFacebookAuth = async () => {
    setLoading(true);
    try {
      await signIn("facebook");
    } catch (error) {
      console.error("Facebook auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (session) {
    return (
      <>
        <CustomButton
          className={`bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:text-gray-900 flex items-center justify-center gap-3 ${className}`}
          onClick={() => signOut()}
        >
          Sign out
        </CustomButton>
      </>
    );
  }

  return (
    <>
      <CustomButton
        type="button"
        onClick={handleFacebookAuth}
        disabled={loading}
        loading={loading}
        className={`bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:text-gray-900 flex items-center justify-center gap-3 ${className}`}
      >
        <Image src={FacebookIcon} alt="facebook" />
        Enter with Facebook
      </CustomButton>
    </>
  );
};
