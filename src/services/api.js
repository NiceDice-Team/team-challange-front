export const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// const API_URL = "/api/";

export async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : null,
  });
  
  if (!response.ok) {
    let errorMessage = `API Error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.errors && errorData.errors.length > 0) {
        errorMessage = errorData.errors[0].detail || errorMessage;
      }
    } catch {
      // If error response isn't JSON, use default message
    }
    throw new Error(errorMessage);
  }
  
  return response.json();
}
