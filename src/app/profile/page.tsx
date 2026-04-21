"use client";

import { useUserStore } from "@/store/user";
import React, { useEffect, useMemo, useState } from "react";
import { ProtectedRoute } from "@/components/auth/RouteGuards";
import ProfileSVG from "@/assets/svg-components/ProfileSVG";
import { CustomButton } from "@/components/shared/CustomButton";
import mail from "@/assets/icons/mail.svg";
import Image from "next/image";
import { CustomBreadcrumb } from "@/components/shared/CustomBreadcrumb";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BoxSVG from "@/assets/svg-components/BoxSVG";
import { CustomInput } from "@/components/shared/CustomInput";
import { editProfileSchema } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { getValidAccessToken, isAuthenticated } from "@/lib/tokenManager";
import { showCustomToast } from "@/components/shared/Toast";
import OrdersTable from "@/components/profile/OrdersTable";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import Modal from "@/components/shared/Modal";
import ChangePass from "@/components/profile/ChangePass";
import { useTranslation } from "react-i18next";

type ProfileFormState = z.infer<typeof editProfileSchema>;

function ProfileContent() {
  const { t } = useTranslation();

  const breadcrumbItems = useMemo(
    () => [
      { label: t("profile.breadcrumb.home"), href: "/" },
      { label: t("profile.breadcrumb.myAccount"), href: "/profile", current: true },
    ],
    [t],
  );

  const { userData, setUserData, fetchUserData, isLoading } = useUserStore(
    (state) => state
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const accessToken = getValidAccessToken();

  const updateProfileMutation = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormState>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      firstname: userData?.first_name || "",
      lastname: userData?.last_name || "",
      email: userData?.email || "",
    },
  });

  useEffect(() => {
    if (isAuthenticated() && userData && !userData.first_name) {
      if (accessToken) {
        fetchUserData(userData.id);
      }
    }
  }, [userData, accessToken, fetchUserData]);

  useEffect(() => {
    if (updateProfileMutation.isError) {
      showCustomToast({
        type: "error",
        title: t("profile.toast.updateFailedTitle"),
        description:
          updateProfileMutation.error?.message ||
          t("profile.toast.updateFailedDescription"),
      });
    }
  }, [
    t,
    updateProfileMutation.isError,
    updateProfileMutation.error?.message,
  ]);

  useEffect(() => {
    if (updateProfileMutation.isSuccess && updateProfileMutation.data) {
      const updatedUserData = {
        id: updateProfileMutation.data.id,
        first_name: updateProfileMutation.data.first_name,
        last_name: updateProfileMutation.data.last_name,
        email: updateProfileMutation.data.email,
      };
      setUserData(updatedUserData);

      reset({
        firstname: updateProfileMutation.data.first_name,
        lastname: updateProfileMutation.data.last_name,
        email: updateProfileMutation.data.email,
      });

      showCustomToast({
        type: "success",
        title: t("profile.toast.updateSuccessTitle"),
      });
    }
  }, [
    t,
    updateProfileMutation.isSuccess,
    updateProfileMutation.data,
    setUserData,
    reset,
  ]);

  const onSubmit = async (data: ProfileFormState) => {
    try {
      const requestBody = {
        first_name: data.firstname,
        last_name: data.lastname,
        email: data.email,
      };

      await updateProfileMutation.mutateAsync({
        userId: userData.id,
        data: requestBody,
      });

      setError("");
    } catch (error) {
      setError(t("profile.errors.updateFailed"));
      showCustomToast({
        type: "error",
        title: t("profile.toast.updateFailedTitle"),
      });
    }
  };

  return (
    <>
      <div className="py-8 min-h-screen">
        <div className="flex justify-between items-center">
          <CustomBreadcrumb items={breadcrumbItems} />
          <LogoutButton showText={true} showIcon={true} />
        </div>
        <h3 className="mb-4 md:text-title text-xl uppercase">
          {t("profile.welcome", {
            name: isLoading ? "..." : userData?.first_name ?? "",
          })}
        </h3>
        <p>{t("profile.dashboardSubtitle")}</p>
        <div className="flex lg:flex-row flex-col justify-between gap-6 mt-6 h-fit">
          <div className="flex flex-col gap-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.05)] pb-6 w-full lg:w-1/3">
            <div className="flex flex-col bg-purple p-6 text-white">
              <div className="flex items-center gap-2 text-xl uppercase">
                <ProfileSVG color="white" />
                {t("profile.sidebar.yourProfile")}
              </div>
              <div className="text-base">{t("profile.sidebar.quickView")}</div>
            </div>
            <div className="flex flex-col gap-2 px-7 text-black">
              <p className="text-sm uppercase">{t("profile.sidebar.nameLabel")}</p>
              <p className="text-gray-2">
                {isLoading
                  ? t("profile.sidebar.loading")
                  : `${userData?.first_name || ""} ${
                      userData?.last_name || ""
                    }`}
              </p>
            </div>
            <div className="flex flex-col gap-2 px-7 text-black">
              <p className="text-sm uppercase">{t("profile.sidebar.emailLabel")}</p>
              <p className="flex items-center gap-2 text-gray-2">
                <Image src={mail} alt={t("profile.mailIconAlt")} width={20} height={20} />
                {isLoading ? t("profile.sidebar.loading") : userData?.email || ""}
              </p>
            </div>
            <CustomButton
              styleType="whiteButton"
              disabled={isLoading}
              onClick={() => setModalOpen(true)}
            >
              {t("profile.sidebar.changePassword")}
            </CustomButton>
          </div>

          <div className="flex flex-col gap-4 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.05)] w-full lg:w-2/3">
            <Tabs defaultValue="history" className="w-full">
              <TabsList className="bg-[#f3f3f3] mb-7 rounded-none w-full h-[40px]">
                <TabsTrigger
                  value="history"
                  className="group gap-2 data-[state=active]:bg-purple rounded-none w-1/2 h-[40px] text-gray-2 data-[state=active]:text-white uppercase"
                >
                  <BoxSVG className="text-gray-2 group-data-[state=active]:text-white" />
                  {t("profile.tabs.orderHistory")}
                </TabsTrigger>
                <TabsTrigger
                  value="edit"
                  className="group gap-2 data-[state=active]:bg-purple rounded-none w-1/2 h-[40px] text-gray-2 data-[state=active]:text-white uppercase"
                >
                  <ProfileSVG className="text-gray-2 group-data-[state=active]:text-white" />
                  {t("profile.tabs.editProfile")}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="history" className="p-3 md:p-7">
                <h3 className="flex items-center gap-2 text-black text-xl uppercase">
                  <BoxSVG />
                  {t("profile.orderHistory.title")}
                </h3>
                <p className="mt-2 mb-10 text-dark-gray">
                  {t("profile.orderHistory.subtitle")}
                </p>
                <OrdersTable />
              </TabsContent>
              <TabsContent value="edit">
                <div className="flex flex-col gap-2 bg-purple mb-10 p-7 text-white">
                  <h3 className="flex items-center gap-2 text-xl uppercase">
                    <ProfileSVG />
                    {t("profile.editForm.bannerTitle")}
                  </h3>
                  <p>{t("profile.editForm.bannerSubtitle")}</p>
                </div>
                {error && <p className="text-red-500">{error}</p>}

                <form
                  className="px-0 lg:px-7"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="gap-6 grid grid-cols-1 md:grid-cols-2 mb-6">
                    <CustomInput
                      label={t("profile.editForm.labels.firstName")}
                      id="firstname"
                      name="firstname"
                      placeholder={t("profile.editForm.placeholders.firstName")}
                      disabled={isLoading}
                      {...register("firstname")}
                      error={
                        errors.firstname?.message
                          ? [errors.firstname?.message]
                          : undefined
                      }
                    />
                    <CustomInput
                      label={t("profile.editForm.labels.lastName")}
                      id="lastname"
                      name="lastname"
                      placeholder={t("profile.editForm.placeholders.lastName")}
                      disabled={isLoading}
                      {...register("lastname")}
                      error={
                        errors.lastname?.message
                          ? [errors.lastname?.message]
                          : undefined
                      }
                    />
                  </div>
                  <div className="w-full lg:w-1/2">
                    <CustomInput
                      label={t("profile.editForm.labels.email")}
                      id="email"
                      name="email"
                      placeholder={t("profile.editForm.placeholders.email")}
                      disabled={isLoading}
                      {...register("email")}
                      error={
                        errors.email?.message
                          ? [errors.email?.message]
                          : undefined
                      }
                    />
                  </div>
                  <div className="flex justify-end mt-10 mb-7 w-[186px]">
                    <CustomButton
                      type="submit"
                      disabled={updateProfileMutation.isPending || isLoading}
                    >
                      {updateProfileMutation.isPending
                        ? t("profile.editForm.submitting")
                        : t("profile.editForm.submit")}
                    </CustomButton>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {modalOpen && (
        <ChangePass open={modalOpen} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
