import { test, expect } from "@playwright/test";
import { BASE_URL, capturePageErrors, expectNoPageErrors, mockBackend } from "./support";

test("anonymous profile access redirects to login", async ({ page }) => {
  const errors = await capturePageErrors(page);
  await mockBackend(page);
  await page.goto(`${BASE_URL}/profile`);
  await expect(page).toHaveURL(/\/login\?returnUrl=%2Fprofile$/);
  await expect(page.getByRole("heading", { name: /log in here or/i })).toBeVisible();
  expectNoPageErrors(errors);
});
