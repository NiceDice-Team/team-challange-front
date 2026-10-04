import { test, expect } from "@playwright/test";
import { BASE_URL, capturePageErrors, expectNoPageErrors, mockBackend } from "./support";

test("order review renders in a controlled empty-cart state", async ({ page }) => {
  const errors = await capturePageErrors(page);
  await mockBackend(page);
  await page.route("https://js.stripe.com/**", (route) => route.abort());
  await page.goto(`${BASE_URL}/checkout-order/order-review`);
  await expect(page.getByRole("heading", { name: "Order review" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Shipping" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Payment" })).toBeVisible();
  await expect(page.getByText("Cash on delivery")).toBeVisible();
  expectNoPageErrors(errors, ["Failed to load Stripe.js"]);
});
