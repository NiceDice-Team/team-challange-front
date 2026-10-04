import { test, expect } from "@playwright/test";
import { BASE_URL, capturePageErrors, expectNoPageErrors, mockBackend } from "./support";

test("checkout page renders with controlled cart and delivery data", async ({ page }) => {
  const errors = await capturePageErrors(page);
  await mockBackend(page);
  await page.goto(`${BASE_URL}/checkout-order`);
  await expect(page.getByRole("heading", { name: "Checkout" })).toBeVisible();
  await expect(page.getByText("Shipping", { exact: true }).first()).toBeVisible();
  await expect(page.getByLabel("First Name").first()).toBeVisible();
  await expect(page.getByText("Choose delivery option").last()).toBeVisible();
  expectNoPageErrors(errors);
});
