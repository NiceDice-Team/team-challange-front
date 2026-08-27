type SecurityHeader = {
  key: string;
  value: string;
};

const TRUSTED_IMAGE_ORIGINS = [
  "https://cdn.bgshop.work.gd",
  "https://placehold.co",
  "https://cdn.shopify.com",
];

const TRUSTED_SCRIPT_ORIGINS = ["https://js.stripe.com"];

const TRUSTED_CONNECT_ORIGINS = [
  "https://api.stripe.com",
  "https://hooks.stripe.com",
  "https://m.stripe.com",
  "https://r.stripe.com",
  "https://api.adviceslip.com",
];

function getBackendOrigin(): string | null {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!backendUrl) {
    return null;
  }

  try {
    return new URL(backendUrl).origin;
  } catch {
    return null;
  }
}

function buildContentSecurityPolicy(isProduction: boolean): string {
  const backendOrigin = getBackendOrigin();
  const connectSources = ["'self'", ...TRUSTED_CONNECT_ORIGINS];

  if (backendOrigin) {
    connectSources.push(backendOrigin);
  }

  const directives = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' ${TRUSTED_SCRIPT_ORIGINS.join(" ")}`,
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    `img-src 'self' data: blob: ${TRUSTED_IMAGE_ORIGINS.join(" ")}`,
    `connect-src ${connectSources.join(" ")}`,
    `frame-src 'self' https://js.stripe.com https://hooks.stripe.com`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ];

  if (isProduction) {
    directives.push("upgrade-insecure-requests");
  }

  return directives.join("; ");
}

export function buildSecurityHeaders(
  isProduction = process.env.NODE_ENV === "production",
): SecurityHeader[] {
  const headers: SecurityHeader[] = [
    {
      key: "Content-Security-Policy",
      value: buildContentSecurityPolicy(isProduction),
    },
    {
      key: "X-Frame-Options",
      value: "DENY",
    },
    {
      key: "X-Content-Type-Options",
      value: "nosniff",
    },
    {
      key: "Referrer-Policy",
      value: "strict-origin-when-cross-origin",
    },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=()",
    },
  ];

  if (isProduction) {
    headers.push({
      key: "Strict-Transport-Security",
      value: "max-age=31536000; includeSubDomains",
    });
  }

  return headers;
}

export function applySecurityHeaders<T extends Response>(response: T): T {
  for (const header of buildSecurityHeaders()) {
    response.headers.set(header.key, header.value);
  }

  response.headers.delete("X-Powered-By");

  return response;
}
