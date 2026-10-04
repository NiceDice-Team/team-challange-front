import { test, expect } from "@playwright/test";
import { BASE_URL, capturePageErrors, expectNoPageErrors } from "./support";

test("order cancellation page renders", async ({ page }) => {
  const errors = await capturePageErrors(page);
  await page.goto(`${BASE_URL}/checkout-order/order-cancel`);
  await expect(page.getByRole("heading", { name: "Order Cancelled!" })).toBeVisible();
  await expect(page.getByText("Your order has been cancelled successfully.")).toBeVisible();
  await expect(page.getByText("Dice & Decks Team")).toBeVisible();
  expectNoPageErrors(errors);
});
