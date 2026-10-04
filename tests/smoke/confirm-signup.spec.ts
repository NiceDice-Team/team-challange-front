import { test, expect } from "@playwright/test";
import { BASE_URL, capturePageErrors, expectNoPageErrors } from "./support";

test("signup confirmation page renders", async ({ page }) => {
  const errors = await capturePageErrors(page);
  await page.goto(`${BASE_URL}/confirm-signup`);
  await expect(page.getByRole("heading", { name: "Thank you for registering!" })).toBeVisible();
  await expect(page.getByRole("main").getByText("A confirmation email has been sent to your inbox.", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: /browse games/i })).toBeVisible();
  expectNoPageErrors(errors);
});
