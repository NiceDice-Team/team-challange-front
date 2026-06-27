import { cn } from "@/lib/utils";

export type NavigationLink = {
  label: string;
  href: string;
  isSale?: boolean;
};

export const navigationLinks: NavigationLink[] = [
  { label: "New arrivals", href: "/catalog?categories=1" },
  { label: "Bestsellers", href: "/catalog?categories=2" },
  { label: "Board games", href: "/catalog" },
  { label: "Sale", href: "/catalog?categories=4", isSale: true },
  { label: "Coming soon", href: "/catalog?categories=5" },
  { label: "Blog", href: "/blog" },
  { label: "Reviews", href: "/#reviews" },
  { label: "About", href: "/#about" },
];

export function isNavigationLinkActive(
  href: string,
  pathname: string,
  searchParams: Pick<URLSearchParams, "get">,
  hash = "",
): boolean {
  const linkUrl = new URL(href, "http://localhost");

  if (linkUrl.hash) {
    return pathname === linkUrl.pathname && hash === linkUrl.hash;
  }

  if (pathname !== linkUrl.pathname) {
    return false;
  }

  if (
    linkUrl.pathname === "/catalog" &&
    !linkUrl.searchParams.has("categories")
  ) {
    return !searchParams.get("categories");
  }

  for (const [key, value] of linkUrl.searchParams.entries()) {
    if (searchParams.get(key) !== value) {
      return false;
    }
  }

  return true;
}

export function getDesktopNavigationLinkClassName(
  item: NavigationLink,
  isActive: boolean,
): string {
  if (item.isSale) {
    return cn(
      "inline-block rounded-sm px-1 py-0.5 transition-colors cursor-pointer",
      "text-red-500 hover:text-red-600 active:text-red-700",
      isActive &&
        "font-semibold underline underline-offset-[6px] decoration-2 decoration-red-500",
    );
  }

  return cn(
    "inline-block rounded-sm px-1 py-0.5 transition-colors cursor-pointer",
    "text-[#040404] hover:text-[#494791] active:text-[#3a3973]",
    isActive &&
      "text-[#494791] font-medium underline underline-offset-[6px] decoration-[#494791]",
  );
}

export function getMobileNavigationLinkClassName(
  item: NavigationLink,
  isActive: boolean,
): string {
  const interactiveStyles =
    "rounded-sm transition-colors hover:bg-[#f4f3fb] active:bg-[#ebeaf5]";

  if (item.isSale) {
    return cn(
      interactiveStyles,
      "flex items-center gap-3 px-2 py-1 -mx-2",
      isActive && "bg-[#f4f3fb] font-medium",
    );
  }

  return cn(
    interactiveStyles,
    "block px-2 py-1 -mx-2",
    isActive ? "bg-[#f4f3fb] font-medium text-[#494791]" : "text-black",
  );
}
