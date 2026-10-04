import { test, expect } from "@playwright/test";
import { BASE_URL, capturePageErrors, expectNoPageErrors, mockBackend } from "./support";

test("policies page renders its navigation and representative content", async ({ page }) => {
  const errors = await capturePageErrors(page);
  await mockBackend(page);
  await page.goto(`${BASE_URL}/policies`);
  await expect(page.getByRole("heading", { name: "Policies", exact: true })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Policies navigation" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Available Delivery Options" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Privacy Policy" })).toBeVisible();
  expectNoPageErrors(errors);
});
