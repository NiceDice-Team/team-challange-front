import { test, expect } from "@playwright/test";
import { BASE_URL, capturePageErrors, expectNoPageErrors } from "./support";

test("forgot-password page renders its form", async ({ page }) => {
  const errors = await capturePageErrors(page);
  await page.goto(`${BASE_URL}/forgot-password`);
  await expect(page.getByRole("heading", { name: /forgot your password/i })).toBeVisible();
  await expect(page.getByPlaceholder("Enter email address")).toBeVisible();
  await expect(page.getByRole("button", { name: "SUBMIT" })).toBeVisible();
  expectNoPageErrors(errors);
});
