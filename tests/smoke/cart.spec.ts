import { test, expect } from "@playwright/test";
import { BASE_URL, capturePageErrors, expectNoPageErrors, mockBackend } from "./support";

test("cart renders a controlled empty state", async ({ page }) => {
  const errors = await capturePageErrors(page);
  await mockBackend(page);
  await page.goto(`${BASE_URL}/cart`);
  await expect(page.getByRole("heading", { name: "your cart (0)" })).toBeVisible();
  await expect(page.getByText("Your cart is empty")).toBeVisible();
  await expect(page.getByRole("link", { name: "Start Shopping" })).toBeVisible();
  expectNoPageErrors(errors);
});
