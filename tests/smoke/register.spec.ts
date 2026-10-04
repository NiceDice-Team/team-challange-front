import { test, expect } from "@playwright/test";
import { BASE_URL, capturePageErrors, expectNoPageErrors } from "./support";

test("registration page renders its essential controls", async ({ page }) => {
  const errors = await capturePageErrors(page);
  await page.goto(`${BASE_URL}/register`);
  await expect(page.getByRole("heading", { name: "Create account" })).toBeVisible();
  await expect(page.getByLabel("First name")).toBeVisible();
  await expect(page.getByPlaceholder("Enter email address")).toBeVisible();
  await expect(page.getByLabel("Confirm Password")).toBeVisible();
  await expect(page.getByRole("button", { name: "REGISTER" })).toBeVisible();
  expectNoPageErrors(errors);
});
