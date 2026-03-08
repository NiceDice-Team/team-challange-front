import axios from "axios";
import axiosInstance from "@/lib/axiosInstance";
import { buildApiUrl } from "@/config/api";
import { ApiRequestOptions } from "@/types/api";
import { CreateProductReviewPayload, ProductReviewApi, ReviewListResponse } from "@/types/review";

interface ProductReviewsParams {
  ordering?: string;
  page?: number;
  search?: string;
}

const buildProductReviewsUrl = (productId: number | string, params: ProductReviewsParams = {}): string => {
  const searchParams = new URLSearchParams();

  if (params.ordering) {
    searchParams.set("ordering", params.ordering);
  }

  if (typeof params.page === "number") {
    searchParams.set("page", params.page.toString());
  }

  if (params.search) {
    searchParams.set("search", params.search);
  }

  const queryString = searchParams.toString();
  const endpoint = `products/products/${productId}/reviews/${queryString ? `?${queryString}` : ""}`;

  return buildApiUrl(endpoint);
};

const parseErrorResponse = async (response: Response): Promise<string> => {
  try {
    const errorData = await response.json();
    if (errorData?.errors?.length > 0) {
      return errorData.errors[0].detail || `API Error! status: ${response.status}`;
    }
  } catch {
    // Fall back to a generic message when the response is not JSON.
  }

  return `API Error! status: ${response.status}`;
};

const fetchReviewPage = async (url: string, options: ApiRequestOptions = {}): Promise<ReviewListResponse> => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    signal: options.signal,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response));
  }

  return response.json() as Promise<ReviewListResponse>;
};

export const reviewServices = {
  getProductReviews: async (
    productId: number | string,
    params: ProductReviewsParams = {},
    options: ApiRequestOptions = {}
  ): Promise<ReviewListResponse> => {
    return fetchReviewPage(buildProductReviewsUrl(productId, params), options);
  },

  getAllProductReviews: async (
    productId: number | string,
    params: ProductReviewsParams = {},
    options: ApiRequestOptions = {}
  ): Promise<ReviewListResponse> => {
    let nextUrl: string | null = buildProductReviewsUrl(productId, params);
    const allResults: ReviewListResponse["results"] = [];
    let count = 0;

    while (nextUrl) {
      const pageData = await fetchReviewPage(nextUrl, options);
      count = pageData.count;
      allResults.push(...pageData.results);
      nextUrl = pageData.next;
    }

    return {
      count,
      next: null,
      previous: null,
      results: allResults,
    };
  },

  createProductReview: async (
    productId: number | string,
    payload: CreateProductReviewPayload
  ): Promise<ProductReviewApi> => {
    try {
      const response = await axiosInstance.post<ProductReviewApi>(`products/products/${productId}/reviews/`, payload);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const detail =
          error.response?.data?.errors?.[0]?.detail ||
          error.response?.data?.detail ||
          error.message;

        throw new Error(detail || "Failed to create review");
      }

      throw error;
    }
  },
};
