import ProductPage from "@/components/catalog/ProductPage";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ReviewsProduct from "@/components/catalog/ReviewsProduct";
import ReviewsComments from "@/components/catalog/ReviewsComments";
import {
  ProductDetailMobileFooter,
  ProductDetailMobileHeader,
} from "@/components/catalog/ProductDetailMobileChrome";

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Product detail page component with full layout
 * Displays product details, reviews, and comments
 */
export default async function ProductDetailPage({ params }: ProductDetailPageProps): Promise<React.ReactElement> {
  const resolvedParams = await params;

  return (
    <div className="py-4 sm:py-6">
      <ProductDetailMobileHeader />

      <div className="hidden px-4 sm:block sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <Navbar />
      </div>

      <ProductPage params={resolvedParams} />
      <ReviewsProduct />
      <ReviewsComments />
      <ProductDetailMobileFooter />
      <div className="hidden sm:block">
        <Footer />
      </div>
    </div>
  );
}
