import { test, expect } from "@playwright/test";
import { BASE_URL, capturePageErrors, expectNoPageErrors, mockBackend } from "./support";

test("catalog renders with deterministic empty data", async ({ page }) => {
  const errors = await capturePageErrors(page);
  await mockBackend(page);
  await page.goto(`${BASE_URL}/catalog`);
  await expect(page.getByRole("heading", { name: "Board games" }).first()).toBeVisible();
  await expect(page.getByText("Sort by", { exact: true })).toBeVisible();
  await expect(page.getByText(/No products (found|match your filters)/)).toBeVisible();
  expectNoPageErrors(errors);
});
