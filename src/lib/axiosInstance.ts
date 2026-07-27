import axios, { AxiosError, AxiosInstance } from "axios";
import { getValidAccessToken } from "./tokenManager";
import {
  NO_CACHE_CONTROL_VALUE,
  shouldAttachNoCacheHeaders,
} from "./noCacheHeaders";
import { API_CONFIG } from '@/config/api';
import { getApiErrorMessage } from "./apiError";

const axiosInstance: AxiosInstance = axios.create(API_CONFIG);

axiosInstance.interceptors.request.use(
  async function (config) {
    try {
      const accessToken = await getValidAccessToken();
      config.headers.Authorization = `Bearer ${accessToken}`;
    } catch (error) {
      console.error("Error getting access token:", error);
    }

    if (shouldAttachNoCacheHeaders()) {
      config.headers.set("Cache-Control", NO_CACHE_CONTROL_VALUE);
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
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === 401) {
      // TODO add toast
      console.error("Unauthorized request - tokens may be invalid");
    }

    if (axiosError.response?.data) {
      axiosError.message = getApiErrorMessage(
        axiosError.response.data,
        axiosError.message,
      );
    }

    return Promise.reject(axiosError);
  }
);

export default axiosInstance;
