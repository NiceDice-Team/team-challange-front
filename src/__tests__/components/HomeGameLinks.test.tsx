import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import NewArrivals from "@/components/home/NewArrivals";
import ReviewSection from "@/components/home/ReviewSection";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt }: { alt: string }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} />;
  },
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: { children: ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

describe("home game links", () => {
  test("points product promo links at existing catalog routes", () => {
    render(<NewArrivals />);

    const hrefs = screen.getAllByRole("link").map((link) => link.getAttribute("href"));

    expect(hrefs).toEqual(["/catalog?sort=newest", "/catalog?sort=bestsellers", "/catalog", "/catalog"]);
    hrefs.forEach((href) => {
      expect(href).not.toMatch(/^\/products\//);
    });
  });

  test("points review game links at existing catalog search routes", () => {
    render(<ReviewSection />);

    const hrefs = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"))
      .filter((href): href is string => href !== null);

    expect(hrefs).toEqual(expect.arrayContaining(["/catalog?search=Catan", "/catalog?search=7%20Wonders"]));
    hrefs.forEach((href) => {
      expect(href).toMatch(/^\/catalog\?search=(Catan|7%20Wonders)$/);
      expect(href).not.toMatch(/^\/games\//);
    });
  });
});
