const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const sendOAuthToken = async (provider) => {
  const body = {
    provider: provider.provider,
    access_token: provider.token,
  };

  const response = await fetch(`${API_URL}users/oauth/`, {
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
