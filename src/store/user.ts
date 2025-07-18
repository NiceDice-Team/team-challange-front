import { create } from "zustand";

export type UserData = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
};

type UserState = {
  userData: UserData | null;
  isLoading: boolean;
  error: string | null;
  setUserData: (userData: UserData) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearUserData: () => void;
  fetchUserData: (userId: string, accessToken: string) => Promise<void>;
};

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const useUserStore = create<UserState>()((set, get) => ({
  userData: null,
  isLoading: false,
  error: null,
  setUserData: (userData) => set({ userData }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearUserData: () => set({ userData: null, error: null }),

  fetchUserData: async (userId: string, accessToken: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_URL}api/users/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.status}`);
      }

      const userData = await response.json();
      set({ userData, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch user data";
      set({ error: errorMessage, isLoading: false });
      console.error("Error fetching user data:", error);
    }
  },
}));
