const API_URL = process.env.BACKEND_URL;

export async function fetchAPI(endpoint, options = {}) {
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...defaultOptions,
    ...options,
  });
  if (!response.ok) {
    throw new Error(`Error accessing endpoint: ${response.statusText}`);
  }
  return await response.json();
}
