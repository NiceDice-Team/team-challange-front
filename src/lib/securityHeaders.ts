type SecurityHeader = {
  key: string;
  value: string;
};

export type SecurityHeaderOptions = {
  nonce?: string;
};

const TRUSTED_IMAGE_ORIGINS = [
  "https://cdn.bgshop.work.gd",
  "http://minio:9000",
  "http://127.0.0.1:9000",
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

function shouldUpgradeInsecureRequests(): boolean {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) {
    return true;
  }

  try {
    return new URL(backendUrl).protocol === "https:";
  } catch {
    return true;
  }
}

function getCspMode(): "strict" | "compat" {
  const mode = process.env.CSP_MODE?.toLowerCase();
  return mode === "strict" ? "strict" : "compat";
}

function isCspReportOnlyEnabled(): boolean {
  const value = process.env.CSP_REPORT_ONLY?.toLowerCase();
  return value === "1" || value === "true" || value === "yes" || value === "on";
}

function buildContentSecurityPolicy(
  isProduction: boolean,
  options: SecurityHeaderOptions = {},
): string {
  const backendOrigin = getBackendOrigin();
  const connectSources = ["'self'", ...TRUSTED_CONNECT_ORIGINS];
  const cspMode = getCspMode();

  if (backendOrigin) {
    connectSources.push(backendOrigin);
  }

  const scriptSrcParts = ["'self'"];
  if (cspMode === "strict" && options.nonce) {
    scriptSrcParts.push(`'nonce-${options.nonce}'`);
    scriptSrcParts.push("'strict-dynamic'");
  } else {
    scriptSrcParts.push("'unsafe-inline'");
  }
  if (!isProduction && cspMode !== "strict") {
    scriptSrcParts.push("'unsafe-eval'");
  }
  scriptSrcParts.push(...TRUSTED_SCRIPT_ORIGINS);

  const styleSrc = cspMode === "strict" && options.nonce
    ? `style-src 'self' 'nonce-${options.nonce}'`
    : "style-src 'self' 'unsafe-inline'";

  const directives = [
    "default-src 'self'",
    `script-src ${scriptSrcParts.join(" ")}`,
    styleSrc,
    "font-src 'self' data:",
    `img-src 'self' data: blob: ${TRUSTED_IMAGE_ORIGINS.join(" ")}`,
    `connect-src ${connectSources.join(" ")}`,
    `frame-src 'self' https://js.stripe.com https://hooks.stripe.com`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ];

  if (isProduction && shouldUpgradeInsecureRequests()) {
    directives.push("upgrade-insecure-requests");
  }

  return directives.join("; ");
}

export function buildSecurityHeaders(
  isProduction = process.env.NODE_ENV === "production",
  options: SecurityHeaderOptions = {},
): SecurityHeader[] {
  const cspHeaderName = isCspReportOnlyEnabled()
    ? "Content-Security-Policy-Report-Only"
    : "Content-Security-Policy";

  const headers: SecurityHeader[] = [
    {
      key: cspHeaderName,
      value: buildContentSecurityPolicy(isProduction, options),
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

export function buildContentSecurityPolicyHeader(
  isProduction = process.env.NODE_ENV === "production",
  options: SecurityHeaderOptions = {},
): SecurityHeader {
  const header = buildSecurityHeaders(isProduction, options).find(
    ({ key }) => key.startsWith("Content-Security-Policy"),
  );

  if (!header) {
    throw new Error("Content Security Policy header is not configured");
  }

  return header;
}

export function applySecurityHeaders<T extends Response>(response: T): T {
  const nonce = response.headers.get("x-nonce") ?? undefined;

  for (const header of buildSecurityHeaders(process.env.NODE_ENV === "production", { nonce })) {
    response.headers.set(header.key, header.value);
  }

  response.headers.delete("X-Powered-By");

  return response;
}
