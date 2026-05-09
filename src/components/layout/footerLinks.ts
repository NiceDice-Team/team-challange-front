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
    titleKey: "layout.footer.sections.products.title",
    links: [
      {
        label: "New Arrivals",
        labelKey: "layout.footer.sections.products.links.newArrivals",
        mobileLabel: "New arrivals",
        href: getNavigationHref("New arrivals", "/catalog?categories=1"),
      },
      {
        label: "Bestsellers",
        labelKey: "layout.footer.sections.products.links.bestsellers",
        href: getNavigationHref("Bestsellers", "/catalog?categories=2"),
      },
      {
        label: "Board Games",
        labelKey: "layout.footer.sections.products.links.boardGames",
        mobileLabel: "Board games",
        href: getNavigationHref("Board games", "/catalog"),
      },
      {
        label: "Coming soon",
        labelKey: "layout.footer.sections.products.links.comingSoon",
        href: getNavigationHref("Coming soon", "/catalog?categories=5"),
      },
      {
        label: "Sale",
        labelKey: "layout.footer.sections.products.links.sale",
        href: getNavigationHref("Sale", "/catalog?categories=4"),
      },
    ],
  },
  {
    title: "clients",
    titleKey: "layout.footer.sections.clients.title",
    links: [
      {
        label: "Blog",
        labelKey: "layout.footer.sections.clients.links.blog",
        href: getNavigationHref("Blog", "/#blog"),
      },
      {
        label: "Reviews",
        labelKey: "layout.footer.sections.clients.links.reviews",
        href: getNavigationHref("Reviews", "/#reviews"),
      },
      {
        label: "Shipping",
        labelKey: "layout.footer.sections.clients.links.shipping",
        href: "/shipping",
      },
      {
        label: "Returns",
        labelKey: "layout.footer.sections.clients.links.returns",
        href: "/returns",
      },
    ],
  },
  {
    title: "company",
    titleKey: "layout.footer.sections.company.title",
    links: [
      {
        label: "About",
        labelKey: "layout.footer.sections.company.links.about",
        href: getNavigationHref("About", "/#about"),
      },
      {
        label: "Contact Us",
        labelKey: "layout.footer.sections.company.links.contactUs",
        mobileLabel: "Contact us",
        href: "/contact",
      },
      {
        label: "Terms of Service",
        labelKey: "layout.footer.sections.company.links.termsOfService",
        mobileLabel: "Terms of service",
        href: "/terms-of-service",
      },
      {
        label: "Privacy Policy",
        labelKey: "layout.footer.sections.company.links.privacyPolicy",
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
};

export const footerLegal = {
  owner: "Dice & Decks",
  privacyLabel: "Privacy Policy",
  termsLabel: "Terms of Service",
};
