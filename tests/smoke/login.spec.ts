import { test, expect } from "@playwright/test";
import { BASE_URL, capturePageErrors, expectNoPageErrors } from "./support";

test("login page renders its essential controls", async ({ page }) => {
  const errors = await capturePageErrors(page);
  await page.goto(`${BASE_URL}/login`);
  await expect(page.getByRole("heading", { name: /log in here or/i })).toBeVisible();
  await expect(page.getByPlaceholder("Enter email address")).toBeVisible();
  await expect(page.getByLabel("password", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "SIGN IN" })).toBeVisible();
  expectNoPageErrors(errors);
});
