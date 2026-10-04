import { test, expect } from "@playwright/test";
import { BASE_URL, capturePageErrors, expectNoPageErrors } from "./support";

test("blog article renders deterministic repository content", async ({ page }) => {
  const errors = await capturePageErrors(page);
  await page.goto(`${BASE_URL}/blog/heat-legends-review`);
  await expect(page.getByRole("heading", { name: "Heat: Legends review" })).toBeVisible();
  await expect(page.getByRole("link", { name: /back to blog/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Introduction" })).toBeVisible();
  expectNoPageErrors(errors);
});
