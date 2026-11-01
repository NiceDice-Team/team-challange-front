import { buildContentSecurityPolicyHeader } from "@/lib/securityHeaders";

describe("buildContentSecurityPolicyHeader", () => {
  const originalCspMode = process.env.CSP_MODE;
  const originalReportOnly = process.env.CSP_REPORT_ONLY;

  afterEach(() => {
    if (originalCspMode === undefined) delete process.env.CSP_MODE;
    else process.env.CSP_MODE = originalCspMode;

    if (originalReportOnly === undefined) delete process.env.CSP_REPORT_ONLY;
    else process.env.CSP_REPORT_ONLY = originalReportOnly;
  });

  it("returns an enforcing strict policy containing the request nonce", () => {
    process.env.CSP_MODE = "strict";
    process.env.CSP_REPORT_ONLY = "false";

    const header = buildContentSecurityPolicyHeader(true, { nonce: "test-nonce" });

    expect(header.key).toBe("Content-Security-Policy");
    expect(header.value).toContain("script-src 'self' 'nonce-test-nonce' 'strict-dynamic'");
    expect(header.value).toContain("style-src 'self' 'nonce-test-nonce'");
    expect(header.value).not.toContain("'unsafe-inline'");
  });

  it("preserves report-only mode", () => {
    process.env.CSP_MODE = "strict";
    process.env.CSP_REPORT_ONLY = "true";

    const header = buildContentSecurityPolicyHeader(true, { nonce: "test-nonce" });

    expect(header.key).toBe("Content-Security-Policy-Report-Only");
  });
});
