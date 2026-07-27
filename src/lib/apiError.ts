function getStringProperty(
  value: Record<string, unknown>,
  key: string,
): string | undefined {
  return typeof value[key] === "string" ? value[key] : undefined;
}

export function getApiErrorMessage(
  errorData: unknown,
  fallback: string,
): string {
  if (!errorData || typeof errorData !== "object") {
    return fallback;
  }

  const record = errorData as Record<string, unknown>;
  const detail = getStringProperty(record, "detail");
  const message = getStringProperty(record, "message");

  if (detail) return detail;
  if (message) return message;

  if (Array.isArray(record.errors) && record.errors.length > 0) {
    const [firstError] = record.errors;

    if (firstError && typeof firstError === "object") {
      return getStringProperty(firstError as Record<string, unknown>, "detail") ?? fallback;
    }
  }

  return fallback;
}
