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
import { setTokens, clearTokens } from "@/lib/tokenManager";
import { showCustomToast } from "@/components/shared/Toast";

interface GoogleAuthButtonProps {
  className?: string;
}

export const GoogleAuthButton: FC<GoogleAuthButtonProps> = ({
  className = "",
}) => {
  const [loading, setLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  const { setUserData } = useUserStore();
  const oauthStartedRef = useRef(false);
  const oauthCompletedRef = useRef(false);

  const oauthMutation = useMutation({
    mutationFn: sendOAuthToken,
    onSuccess: (data) => {
      oauthCompletedRef.current = true;
      oauthStartedRef.current = false;
      if (data.access_token) {
        setTokens(data.access_token, data.refresh_token);
      }

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
      oauthStartedRef.current = false;
      oauthCompletedRef.current = false;
      showCustomToast({
        type: "error",
        title: "Google login failed",
        description:
          error instanceof Error
            ? error.message
            : "Please try again or use email login.",
      });
      signOut({ redirect: false });
    },
  });

  useEffect(() => {
    if (
      session?.accessToken &&
      !oauthMutation.isPending &&
      !oauthStartedRef.current &&
      !oauthCompletedRef.current
    ) {
      oauthStartedRef.current = true;
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
      oauthStartedRef.current = false;
      oauthCompletedRef.current = false;

      await signIn("google");
    } catch (error) {
      console.error("Google auth error:", error);
      showCustomToast({
        type: "error",
        title: "Google login failed",
        description: "Please try again or use email login.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLogoutLoading(true);
    try {
      oauthStartedRef.current = false;
      oauthCompletedRef.current = false;

      const provider = session?.provider || "google";

      const result = await logoutAction({ provider });
      if (result.needsOAuthLogout) {
        await signOut({ redirect: false });
      }
      clearTokens();

      await updateSession();
      router.push("/");
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
