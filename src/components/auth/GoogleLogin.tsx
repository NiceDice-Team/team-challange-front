"use client";

import { FC, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { CustomButton } from "../shared/CustomButton";
import GoogleIcon from "../../../public/icons/google.svg";
import Image from "next/image";

interface GoogleAuthButtonProps {
  className?: string;
}

export const GoogleAuthButton: FC<GoogleAuthButtonProps> = ({
  className = "",
}) => {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      await signIn("google");
    } catch (error) {
      console.error("Google auth error:", error);
    } finally {
      setLoading(false);
    }
  };
  if (session) {
    return (
      <>
        {/* Signed in as {session.user?.email} <br /> */}
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
        onClick={handleGoogleAuth}
        disabled={loading}
        loading={loading}
        className={`bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:text-gray-900 flex items-center justify-center gap-3 ${className}`}
      >
        <Image src={GoogleIcon} alt="google" />
        Enter with Google
      </CustomButton>
    </>
  );
};
