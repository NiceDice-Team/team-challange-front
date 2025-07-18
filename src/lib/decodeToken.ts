import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "../store/auth";

interface JwtPayload {
  user_id?: string;
}

export default function decodeToken(token: string) {
  try {
    const decoded: JwtPayload = jwtDecode(token);
    const userId = decoded.user_id;

    if (userId) {
      const { setUserId } = useAuthStore.getState();
      setUserId(userId);
    } else {
      console.warn("user_id not found in token");
    }
  } catch (error) {
    console.error("Decoding JWT error:", error);
  }
}
