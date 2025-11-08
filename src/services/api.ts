export const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// const API_URL = "/api/";

export type FetchOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  headers?: HeadersInit;
};

export async function fetchAPI<T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : null,
    // Allow React Query to cancel in-flight requests when queries change
    signal: options.signal,
    cache: "no-store",
  });

  if (!response.ok) {
    let errorMessage = `API Error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      if ((errorData as any).errors && (errorData as any).errors.length > 0) {
        errorMessage = (errorData as any).errors[0].detail || errorMessage;
      }
    } catch {
      // If error response isn't JSON, use default message
    }
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}
