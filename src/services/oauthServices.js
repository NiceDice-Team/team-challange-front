
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const sendOAuthToken = async (provider, token) => {
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const response = await fetch(`${API_URL}users/oauth/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      provider,
      token,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "OAuth authentication failed");
  }

  return response.json();
};
