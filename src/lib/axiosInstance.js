import axios from "axios";
import { getValidAccessToken } from "./tokenManager";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  async function (config) {
    try {
      const accessToken = await getValidAccessToken();
      config.headers.Authorization = `Bearer ${accessToken}`;
    } catch (error) {
      console.error("Error getting access token:", error);
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response?.status === 401) {
      // TODO add toast
      console.error("Unauthorized request - tokens may be invalid");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
