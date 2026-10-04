import { test, expect } from "@playwright/test";
import { BASE_URL, capturePageErrors, expectNoPageErrors } from "./support";

test("forgot-password success page renders", async ({ page }) => {
  const errors = await capturePageErrors(page);
  await page.goto(`${BASE_URL}/forgot-password/success`);
  await expect(page.getByRole("heading", { name: /check your inbox/i })).toBeVisible();
  await expect(page.getByRole("link", { name: "Resend" })).toBeVisible();
  await expect(page.getByRole("link", { name: /continue shopping/i })).toBeVisible();
  expectNoPageErrors(errors);
});
