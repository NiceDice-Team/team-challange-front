"use client";

import { FC, useState, useEffect, useRef } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { CustomButton } from "../shared/CustomButton";
import GoogleIcon from "../../../public/icons/Google.svg";
import Image from "next/image";
import { logoutAction } from "@/app/actions/logout";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { sendOAuthToken } from "@/services/oauthServices";
import { useUserStore } from "@/store/user";

interface GoogleAuthButtonProps {
  className?: string;
}

export const GoogleAuthButton: FC<GoogleAuthButtonProps> = ({
  className = "",
}) => {
  const [loading, setLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const { setUserData } = useUserStore();
  const oauthCompletedRef = useRef(false);

  const oauthMutation = useMutation({
    mutationFn: sendOAuthToken,
    onSuccess: (data) => {
      oauthCompletedRef.current = true;

      if (data.user) {
        setUserData({
          id: data.user.id || data.user.user_id,
          email: data.user.email,
          first_name:
            data.user.first_name || session?.user?.name?.split(" ")[0] || "",
          last_name:
            data.user.last_name || session?.user?.name?.split(" ")[1] || "",
        });
      } else if (session?.user) {
        const nameParts = session.user.name?.split(" ") || [];
        setUserData({
          email: session.user.email || "",
          first_name: nameParts[0] || "",
          last_name: nameParts[1] || "",
        });
      }

      setTimeout(() => {
        router.push("/");
      }, 100);
    },
    onError: (error) => {
      console.error("OAuth error:", error);
      oauthCompletedRef.current = false;
      signOut({ redirect: false });
    },
  });

  useEffect(() => {
    if (
      session?.accessToken &&
      !oauthMutation.isPending &&
      !oauthCompletedRef.current
    ) {
      oauthMutation.mutate({
        provider: "google",
        token: session.accessToken,
      });
    }
  }, [
    session?.accessToken,
    session?.provider,
    oauthMutation,
    oauthMutation.isPending,
  ]);

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      oauthCompletedRef.current = false;

      await signIn("google", {
        redirect: false,
      });
    } catch (error) {
      console.error("Google auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLogoutLoading(true);
    try {
      oauthCompletedRef.current = false;

      await logoutAction();
      await signOut({ redirect: false });
    } catch (error) {
      console.error("Sign out error:", error);
      await signOut({
        callbackUrl: "/",
        redirect: true,
      });
    } finally {
      setLogoutLoading(false);
    }
  };

  if (session) {
    return (
      <>
        <CustomButton
          className={`bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:text-gray-900 flex items-center justify-center gap-3 ${className}`}
          onClick={handleSignOut}
          disabled={logoutLoading}
          loading={logoutLoading}
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
        disabled={loading || oauthMutation.isPending}
        loading={loading || oauthMutation.isPending}
        className={`bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:text-gray-900 flex items-center justify-center gap-3 ${className}`}
      >
        <Image src={GoogleIcon} alt="google" />
        {oauthMutation.isPending ? "Authenticating..." : "Enter with Google"}
      </CustomButton>
    </>
  );
};
