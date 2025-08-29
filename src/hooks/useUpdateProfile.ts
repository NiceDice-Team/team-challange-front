import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";

interface UpdateProfileData {
  first_name: string;
  last_name: string;
  email: string;
}

interface UpdateProfileResponse {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      data,
    }: {
      userId: string;
      data: UpdateProfileData;
    }) => {
      const response = await axiosInstance.put<UpdateProfileResponse>(
        `users/${userId}/`,
        data
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["user", variables.userId] });
      queryClient.setQueryData(["user", variables.userId], data);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
    },
  });
};
