import axios, { AxiosInstance } from "axios";
import { getValidAccessToken } from "./tokenManager";
import {
  NO_CACHE_CONTROL_VALUE,
  shouldAttachNoCacheHeaders,
} from "./noCacheHeaders";
import { API_CONFIG } from '@/config/api';

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
    if (error.response?.status === 401) {
      // TODO add toast
      console.error("Unauthorized request - tokens may be invalid");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
