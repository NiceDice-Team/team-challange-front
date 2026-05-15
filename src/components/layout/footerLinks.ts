import { navigationLinks } from "./navigationLinks";

const navigationHrefByLabel = new Map(
  navigationLinks.map((item) => [item.label, item.href])
);

const getNavigationHref = (label: string, fallback: string): string =>
  navigationHrefByLabel.get(label) ?? fallback;

export const footerBrand = {
  name: "Dice & Decks",
  description:
    "Your trusted online gaming destination with quality dice, cards, and board games",
};

export const footerSections = [
  {
    title: "products",
    links: [
      {
        label: "New Arrivals",
        mobileLabel: "New arrivals",
        href: getNavigationHref("New arrivals", "/catalog?categories=1"),
      },
      {
        label: "Bestsellers",
        href: getNavigationHref("Bestsellers", "/catalog?categories=2"),
      },
      {
        label: "Board Games",
        mobileLabel: "Board games",
        href: getNavigationHref("Board games", "/catalog"),
      },
      {
        label: "Coming soon",
        href: getNavigationHref("Coming soon", "/catalog?categories=5"),
      },
      {
        label: "Sale",
        href: getNavigationHref("Sale", "/catalog?categories=4"),
      },
    ],
  },
  {
    title: "clients",
    links: [
      {
        label: "Blog",
        href: getNavigationHref("Blog", "/#blog"),
      },
      {
        label: "Reviews",
        href: getNavigationHref("Reviews", "/#reviews"),
      },
      {
        label: "Shipping",
        href: "/shipping",
      },
      {
        label: "Returns",
        href: "/returns",
      },
    ],
  },
  {
    title: "company",
    links: [
      {
        label: "About",
        href: getNavigationHref("About", "/#about"),
      },
      {
        label: "Contact Us",
        mobileLabel: "Contact us",
        href: "/contact",
      },
      {
        label: "Terms of Service",
        mobileLabel: "Terms of service",
        href: "/terms-of-service",
      },
      {
        label: "Privacy Policy",
        mobileLabel: "Privacy policy",
        href: "/privacy-policy",
      },
    ],
  },
];

export const footerNewsletter = {
  title: "Stay Updated & Get Exclusive Deals!",
  description:
    "Subscribe to our newsletter and be the first to know about new arrivals, special offers, and gaming news",
  consentLabel: "I agree to receiving marketing emails and special deals",
  consentMobileLines: ["I agree to receiving marketing emails", "and special deals"],
};

export const footerLegal = {
  owner: "Dice & Decks",
  privacyLabel: "Privacy Policy",
  termsLabel: "Terms of Service",
};
