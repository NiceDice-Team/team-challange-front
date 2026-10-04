import { test, expect } from "@playwright/test";
import { BASE_URL, capturePageErrors, expectNoPageErrors, mockBackend } from "./support";

test("canonical product page renders mocked product details", async ({ page }) => {
  const errors = await capturePageErrors(page);
  await mockBackend(page);
  await page.goto(`${BASE_URL}/product/42`);
  await expect(page.getByRole("heading", { name: "Smoke Test Adventure" }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "ADD TO CART" }).last()).toBeVisible();
  expectNoPageErrors(errors);
});
