import { test, expect } from "@playwright/test";
import { BASE_URL, capturePageErrors, expectNoPageErrors } from "./support";

test("reset-password page renders for a deterministic token state", async ({ page }) => {
  const errors = await capturePageErrors(page);
  await page.goto(`${BASE_URL}/reset-password?uid=smoke-user&token=smoke-token`);
  await expect(page.getByRole("heading", { name: /reset your password/i })).toBeVisible();
  await expect(page.getByLabel("Password", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Confirm Password")).toBeVisible();
  await expect(page.getByRole("button", { name: "RESET" })).toBeVisible();
  expectNoPageErrors(errors);
});
