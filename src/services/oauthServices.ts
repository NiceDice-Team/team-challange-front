import { API_BASE_URL, API_ENDPOINTS, buildApiUrl } from '@/config/api';
import { mergeNoCacheHeaders } from '@/lib/noCacheHeaders';
import { OAuthProvider, OAuthResponse } from '@/types/api';

export const sendOAuthToken = async (provider: OAuthProvider): Promise<OAuthResponse> => {
  const body = {
    provider: provider.provider,
    access_token: provider.token,
  };

  const response = await fetch(buildApiUrl(API_ENDPOINTS.oauth), {
    method: "POST",
    headers: mergeNoCacheHeaders(
      {
        "Content-Type": "application/json",
      },
      { force: true },
    ),
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "OAuth authentication failed");
  }

  return response.json();
};
