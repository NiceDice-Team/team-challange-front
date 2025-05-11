const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || // e.g. "https://api.example.com/"
  "/api/bgshop/"; // ⬅ fallback → hits the local proxy route

export async function fetchAPI(endpoint, options = {}) {
  const needsBody = options?.method && options.method !== "GET";
  const headers = needsBody ? { "Content-Type": "application/json", ...(options.headers || {}) } : options.headers;

  const url = new URL(endpoint, API_URL).toString();

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    throw new Error(`Error accessing endpoint: ${response.statusText}`);
  }
  return response.json();
}
