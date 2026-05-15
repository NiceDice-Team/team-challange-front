import { render, screen } from "@testing-library/react";
import FeatureSection from "../../components/home/FeaturesSection";

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, className }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={className} data-testid={`image-${alt}`} />;
  },
}));

// Mock image imports
jest.mock("../../../public/Features/arrow.png", () => "arrow.png");
jest.mock("../../../public/Features/lock.png", () => "lock.png");
jest.mock("../../../public/Features/phone.png", () => "phone.png");

describe("FeatureSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    test("renders feature section without crashing", () => {
      render(<FeatureSection />);

      expect(screen.getByText("24-Hour Fast Shipping")).toBeInTheDocument();
    });

    test("renders all three features", () => {
      render(<FeatureSection />);

      expect(screen.getByText("24-Hour Fast Shipping")).toBeInTheDocument();
      expect(screen.getByText("Secure Payment")).toBeInTheDocument();
      expect(screen.getByText("Easy Returns and Exchanges")).toBeInTheDocument();
    });

    test("renders feature icons", () => {
      render(<FeatureSection />);

      expect(screen.getByTestId("image-Car icon")).toBeInTheDocument();
      expect(screen.getByTestId("image-Lock icon")).toBeInTheDocument();
      expect(screen.getByTestId("image-Arrows icon")).toBeInTheDocument();
    });

    test("renders feature descriptions", () => {
      render(<FeatureSection />);

      expect(screen.getByText("Get your games delivered quickly and safely")).toBeInTheDocument();
      expect(screen.getByText("Shop with confidence, using trusted payment methods")).toBeInTheDocument();
      expect(screen.getByText("Hassle-free shopping experience")).toBeInTheDocument();
    });
  });

  describe("Layout structure", () => {
    test("renders section element", () => {
      const { container } = render(<FeatureSection />);
      const section = container.querySelector("section");

      expect(section).toBeInTheDocument();
    });

    test("has correct background color", () => {
      const { container } = render(<FeatureSection />);
      const section = container.querySelector("section");
      const contentDiv = section?.querySelector("div");

      expect(contentDiv).toHaveClass("bg-[#494791]");
    });

    test("has correct text color", () => {
      const { container } = render(<FeatureSection />);
      const section = container.querySelector("section");
      const contentDiv = section?.querySelector("div");

      expect(contentDiv).toHaveClass("text-white");
    });

    test("renders features in flexbox layout", () => {
      const { container } = render(<FeatureSection />);
      const section = container.querySelector("section");
      const contentDiv = section?.querySelector("div");

      expect(contentDiv).toHaveClass("flex");
    });
  });

  describe("Feature content", () => {
    test("24-Hour Fast Shipping feature has correct title and description", () => {
      render(<FeatureSection />);

      const title = screen.getByText("24-Hour Fast Shipping");
      const description = screen.getByText("Get your games delivered quickly and safely");

      expect(title).toBeInTheDocument();
      expect(description).toBeInTheDocument();
    });

    test("Secure Payment feature has correct title and description", () => {
      render(<FeatureSection />);

      const title = screen.getByText("Secure Payment");
      const description = screen.getByText("Shop with confidence, using trusted payment methods");

      expect(title).toBeInTheDocument();
      expect(description).toBeInTheDocument();
    });

    test("Easy Returns feature has correct title and description", () => {
      render(<FeatureSection />);

      const title = screen.getByText("Easy Returns and Exchanges");
      const description = screen.getByText("Hassle-free shopping experience");

      expect(title).toBeInTheDocument();
      expect(description).toBeInTheDocument();
    });
  });
});
