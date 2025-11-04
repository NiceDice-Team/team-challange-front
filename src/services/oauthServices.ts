import { API_BASE_URL, API_ENDPOINTS, buildApiUrl } from '@/config/api';
import { OAuthProvider, OAuthResponse } from '@/types/api';

export const sendOAuthToken = async (provider: OAuthProvider): Promise<OAuthResponse> => {
  const body = {
    provider: provider.provider,
    access_token: provider.token,
  };

  const response = await fetch(buildApiUrl(API_ENDPOINTS.oauth), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "OAuth authentication failed");
  }

  return response.json();
};
