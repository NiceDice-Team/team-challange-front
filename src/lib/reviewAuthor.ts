import type { ProductReviewApi } from "@/types/review";

export const REVIEW_AUTHOR_FALLBACK = "Verified buyer";

const DIRECT_NAME_KEYS = [
  "display_name",
  "displayName",
  "full_name",
  "fullName",
  "name",
  "username",
  "user_name",
] as const;

const FIRST_NAME_KEYS = ["first_name", "firstname"] as const;
const LAST_NAME_KEYS = ["last_name", "lastname"] as const;
const NESTED_AUTHOR_KEYS = ["author", "user", "customer", "reviewer"] as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isInternalIdentifier = (value: string): boolean => {
  const compactValue = value.replace(/[\s:_-]+/g, " ").trim();

  return (
    /^#?\d+$/.test(compactValue) ||
    /^(customer|user)(\s+(id|number))?\s*#?\d+$/i.test(compactValue)
  );
};

const normalizeAuthorName = (value: unknown): string | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalizedValue = value.replace(/\s+/g, " ").trim();

  if (!normalizedValue || isInternalIdentifier(normalizedValue)) {
    return undefined;
  }

  return normalizedValue;
};

const readNameFromKeys = (
  source: Record<string, unknown>,
  keys: readonly string[],
): string | undefined => {
  for (const key of keys) {
    const name = normalizeAuthorName(source[key]);

    if (name) {
      return name;
    }
  }

  return undefined;
};

const readCombinedName = (source: Record<string, unknown>): string | undefined => {
  const firstName = readNameFromKeys(source, FIRST_NAME_KEYS);
  const lastName = readNameFromKeys(source, LAST_NAME_KEYS);

  return normalizeAuthorName([firstName, lastName].filter(Boolean).join(" "));
};

const readAuthorName = (value: unknown): string | undefined => {
  const stringValue = normalizeAuthorName(value);

  if (stringValue) {
    return stringValue;
  }

  if (!isRecord(value)) {
    return undefined;
  }

  const directName = readNameFromKeys(value, DIRECT_NAME_KEYS);

  if (directName) {
    return directName;
  }

  const combinedName = readCombinedName(value);

  if (combinedName) {
    return combinedName;
  }

  for (const key of NESTED_AUTHOR_KEYS) {
    const nestedName = readAuthorName(value[key]);

    if (nestedName) {
      return nestedName;
    }
  }

  return undefined;
};

export const getReviewAuthorName = (review: ProductReviewApi): string =>
  readAuthorName(review) ?? REVIEW_AUTHOR_FALLBACK;
