export const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// const API_URL = "/api/";

export async function fetchAPI(endoint, options = {}) {
  const url = `${API_URL}${endoint}`;
  const response = await fetch(url, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : null,
  });
  if (!response.ok) {
    throw new Error(`API Error! status: ${response.status}`);
  }
  return response.json();
}
