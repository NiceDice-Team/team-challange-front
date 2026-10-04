import { test, expect } from "@playwright/test";
import { BASE_URL, capturePageErrors, expectNoPageErrors, mockBackend } from "./support";

test("legacy product URL redirects to the canonical route", async ({ page }) => {
  const errors = await capturePageErrors(page);
  await mockBackend(page);
  await page.goto(`${BASE_URL}/catalog/product/42`);
  await expect(page).toHaveURL(`${BASE_URL}/product/42`);
  expectNoPageErrors(errors);
});
