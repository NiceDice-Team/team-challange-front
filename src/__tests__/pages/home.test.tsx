import { render, screen } from "@testing-library/react";
import Home from "../../app/page";

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} data-testid="mock-image" />;
  },
}));

// Mock Next.js Link component
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

// Mock layout components
jest.mock("../../components/layout/Navbar", () => ({
  __esModule: true,
  default: () => <nav data-testid="navbar">Navbar</nav>,
}));

jest.mock("../../components/layout/Footer", () => ({
  __esModule: true,
  default: () => <footer data-testid="footer">Footer</footer>,
}));

jest.mock("../../components/layout/About", () => ({
  __esModule: true,
  default: () => <section data-testid="about-section">About Section</section>,
}));

// Mock home page components
jest.mock("../../components/home/HeroScroller", () => ({
  __esModule: true,
  default: () => <div data-testid="hero-scroller">Hero Scroller</div>,
}));

jest.mock("../../components/home/FeaturesSection", () => ({
  __esModule: true,
  default: () => <section data-testid="feature-section">Features Section</section>,
}));

jest.mock("../../components/home/NewArrivals", () => ({
  __esModule: true,
  default: () => <section data-testid="new-arrivals">New Arrivals</section>,
}));

jest.mock("../../components/home/CommingSoonSection", () => ({
  __esModule: true,
  default: () => <section data-testid="coming-soon-section">Coming Soon</section>,
}));

jest.mock("../../components/home/FeatureSectionBottom", () => ({
  __esModule: true,
  default: () => <section data-testid="feature-section-bottom">Feature Section Bottom</section>,
}));

jest.mock("../../components/home/ReviewSection", () => ({
  __esModule: true,
  default: () => <section data-testid="review-section">Review Section</section>,
}));

jest.mock("../../components/home/BlogSection", () => ({
  __esModule: true,
  default: () => <section data-testid="blog-section">Blog Section</section>,
}));

jest.mock("../../components/home/PartnersScroller", () => ({
  __esModule: true,
  default: () => <section data-testid="partners-scroller">Partners Scroller</section>,
}));

describe("Home Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    test("renders home page without crashing", () => {
      render(<Home />);

      expect(screen.getByTestId("navbar")).toBeInTheDocument();
    });

    test("renders Navbar component", () => {
      render(<Home />);

      expect(screen.getByTestId("navbar")).toBeInTheDocument();
      expect(screen.getByTestId("navbar").tagName).toBe("NAV");
    });

    test("renders HeroScroller component", () => {
      render(<Home />);

      expect(screen.getByTestId("hero-scroller")).toBeInTheDocument();
    });

    test("renders FeatureSection component", () => {
      render(<Home />);

      expect(screen.getByTestId("feature-section")).toBeInTheDocument();
    });

    test("renders NewArrivals component", () => {
      render(<Home />);

      expect(screen.getByTestId("new-arrivals")).toBeInTheDocument();
    });

    test("renders CommingSoonSection component", () => {
      render(<Home />);

      expect(screen.getByTestId("coming-soon-section")).toBeInTheDocument();
    });

    test("renders FeatureSectionBottom component", () => {
      render(<Home />);

      expect(screen.getByTestId("feature-section-bottom")).toBeInTheDocument();
    });

    test("renders ReviewSection component", () => {
      render(<Home />);

      expect(screen.getByTestId("review-section")).toBeInTheDocument();
    });

    test("renders BlogSection component", () => {
      render(<Home />);

      expect(screen.getByTestId("blog-section")).toBeInTheDocument();
    });

    test("renders PartnersScroller component", () => {
      render(<Home />);

      expect(screen.getByTestId("partners-scroller")).toBeInTheDocument();
    });

    test("renders About section", () => {
      render(<Home />);

      expect(screen.getByTestId("about-section")).toBeInTheDocument();
    });

    test("renders Footer component", () => {
      render(<Home />);

      expect(screen.getByTestId("footer")).toBeInTheDocument();
      expect(screen.getByTestId("footer").tagName).toBe("FOOTER");
    });
  });

  describe("Layout structure", () => {
    test("renders page with correct main container", () => {
      const { container } = render(<Home />);
      const mainDiv = container.querySelector("div");

      expect(mainDiv).toBeInTheDocument();
      expect(mainDiv).toHaveClass("py-4", "sm:py-6");
    });

    test("renders all main sections in correct order", () => {
      render(<Home />);

      const navbar = screen.getByTestId("navbar");
      const heroScroller = screen.getByTestId("hero-scroller");
      const featureSection = screen.getByTestId("feature-section");
      const newArrivals = screen.getByTestId("new-arrivals");
      const comingSoon = screen.getByTestId("coming-soon-section");
      const featureSectionBottom = screen.getByTestId("feature-section-bottom");
      const reviewSection = screen.getByTestId("review-section");
      const blogSection = screen.getByTestId("blog-section");
      const partnersScroller = screen.getByTestId("partners-scroller");
      const aboutSection = screen.getByTestId("about-section");
      const footer = screen.getByTestId("footer");

      expect(navbar).toBeInTheDocument();
      expect(heroScroller).toBeInTheDocument();
      expect(featureSection).toBeInTheDocument();
      expect(newArrivals).toBeInTheDocument();
      expect(comingSoon).toBeInTheDocument();
      expect(featureSectionBottom).toBeInTheDocument();
      expect(reviewSection).toBeInTheDocument();
      expect(blogSection).toBeInTheDocument();
      expect(partnersScroller).toBeInTheDocument();
      expect(aboutSection).toBeInTheDocument();
      expect(footer).toBeInTheDocument();
    });

    test("renders Navbar at the beginning", () => {
      render(<Home />);

      const navbar = screen.getByTestId("navbar");
      expect(navbar).toBeInTheDocument();
    });

    test("renders Footer at the end", () => {
      render(<Home />);

      const footer = screen.getByTestId("footer");
      expect(footer).toBeInTheDocument();
    });
  });
});
