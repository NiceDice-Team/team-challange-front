import { expect, type Page } from "@playwright/test";

export const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

export const productFixture = {
  id: 42,
  name: "Smoke Test Adventure",
  brand: "NiceDice",
  price: "39.99",
  stock: 8,
  stars: 4,
  short_description: "A deterministic product used by the frontend smoke suite.",
  description: "A lightweight product detail fixture.",
  game_information: {
    publisher: "NiceDice",
    players: "2-4",
    ages: "10+",
    "play time": "45 minutes",
  },
  delivery_and_payments: "Standard delivery is available.",
  images: [],
  reviews: [],
};

export async function capturePageErrors(page: Page): Promise<Error[]> {
  const errors: Error[] = [];
  page.on("pageerror", (error) => errors.push(error));
  await page.route("**/api/auth/**", (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith("/_log")) {
      return route.fulfill({ status: 204, body: "" });
    }
    return route.fulfill({ json: {} });
  });
  // Guest-cart initialization runs from the shared layout on every route.
  await mockBackend(page);
  return errors;
}

export function expectNoPageErrors(
  errors: Error[],
  allowedMessages: string[] = [],
): void {
  const unexpectedErrors = errors.filter(
    (error) => !allowedMessages.includes(error.message),
  );
  expect(unexpectedErrors.map((error) => error.message)).toEqual([]);
}

export async function mockBackend(page: Page): Promise<void> {
  await page.route("http://localhost:8000/api/**", async (route) => {
    const request = route.request();
    const path = new URL(request.url()).pathname;

    if (path.endsWith("/cart/guest/") && request.method() === "POST") {
      await route.fulfill({ json: { token: "smoke-guest-cart" } });
      return;
    }

    if (path.endsWith("/cart/guest/")) {
      await route.fulfill({ json: { results: [] } });
      return;
    }

    if (path.endsWith("/products/42/")) {
      await route.fulfill({ json: productFixture });
      return;
    }

    if (path.includes("/reviews/")) {
      await route.fulfill({ json: { count: 0, results: [] } });
      return;
    }

    if (path.endsWith("/orders/delivery-options/")) {
      await route.fulfill({
        json: { results: [{ id: 1, name: "Standard delivery", price: 5, description: "Tracked", estimated_days: 3 }] },
      });
      return;
    }

    if (path.endsWith("/orders/payment-methods/")) {
      await route.fulfill({
        json: { results: [{ id: 2, name: "Cash on delivery", description: "Pay when delivered" }] },
      });
      return;
    }

    await route.fulfill({ json: { count: 0, total_count: 0, results: [] } });
  });
}
