import { jwtDecode } from "jwt-decode";
import { useUserStore } from "../store/user";

interface JwtPayload {
  user_id?: string;
}

export default function decodeToken(token: string) {
  try {
    const decoded: JwtPayload = jwtDecode(token);
    const userId = decoded.user_id;

    if (userId) {
      const { fetchUserData } = useUserStore.getState();
      fetchUserData(userId);
    } else {
      console.warn("user_id not found in token");
    }
  } catch (error) {
    console.error("Decoding JWT error:", error);
  }
}
