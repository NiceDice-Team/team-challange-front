import axios from "axios";
import axiosInstance from "@/lib/axiosInstance";
import { buildApiUrl } from "@/config/api";
import { mergeNoCacheHeaders } from "@/lib/noCacheHeaders";
import { ApiRequestOptions } from "@/types/api";
import {
  CreateProductReviewInput,
  CreateProductReviewPayload,
  ProductReviewApi,
  ReviewListResponse,
} from "@/types/review";

interface ProductReviewsParams {
  ordering?: string;
  page?: number;
  search?: string;
}

const normalizeProductReviews = (
  productId: number | string,
  reviews: unknown,
): ReviewListResponse => {
  if (!Array.isArray(reviews)) {
    return {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };
  }

  const normalizedResults: ProductReviewApi[] = reviews
    .map((review, index) => {
      if (!review || typeof review !== "object") {
        return null;
      }

      const raw = review as Record<string, unknown>;
      const ratingValue = raw.rating;
      const commentValue = raw.comment;
      const createdAtValue = raw.created_at;
      const idValue = raw.id;

      return {
        id:
          typeof idValue === "number" && Number.isFinite(idValue)
            ? idValue
            : Number(productId) * 1000 + index + 1,
        rating: typeof ratingValue === "string" ? ratingValue : String(ratingValue ?? "0"),
        comment: typeof commentValue === "string" ? commentValue : "",
        created_at:
          typeof createdAtValue === "string" && createdAtValue
            ? createdAtValue
            : new Date(0).toISOString(),
      };
    })
    .filter((review): review is ProductReviewApi => review !== null);

  return {
    count: normalizedResults.length,
    next: null,
    previous: null,
    results: normalizedResults,
  };
};

const buildProductReviewsUrl = (productId: number | string, params: ProductReviewsParams = {}): string => {
  return buildApiUrl(`products/${productId}/`);
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
    headers: mergeNoCacheHeaders({
      "Content-Type": "application/json",
      ...options.headers,
    }),
    signal: options.signal,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response));
  }

  const product = (await response.json()) as {
    reviews?: unknown;
    id?: number;
  };

  return normalizeProductReviews(product.id ?? 0, product.reviews);
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
    payload: CreateProductReviewInput
  ): Promise<ProductReviewApi> => {
    const body: CreateProductReviewPayload = {
      product_id: Number(productId),
      ...payload,
    };

    try {
      const response = await axiosInstance.post<ProductReviewApi>(
        `reviews/`,
        body
      );
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
