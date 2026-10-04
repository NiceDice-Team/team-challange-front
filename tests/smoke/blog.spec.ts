import { test, expect } from "@playwright/test";
import { BASE_URL, capturePageErrors, expectNoPageErrors } from "./support";

test("blog index renders repository-backed article cards", async ({ page }) => {
  const errors = await capturePageErrors(page);
  await page.goto(`${BASE_URL}/blog`);
  await expect(page.getByRole("heading", { name: "Our Articles" })).toBeVisible();
  await expect(page.getByText("Heat: Legends review")).toBeVisible();
  await expect(page.getByRole("link", { name: /Heat: Legends review/i })).toHaveAttribute("href", "/blog/heat-legends-review");
  expectNoPageErrors(errors);
});
