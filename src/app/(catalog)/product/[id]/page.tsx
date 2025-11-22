import ProductPage from "@/components/catalog/ProductPage";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ReviewsProduct from "@/components/catalog/ReviewsProduct";
import ReviewsComments from "@/components/catalog/ReviewsComments";

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Product detail page component with full layout
 * Displays product details, reviews, and comments
 */
export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps): Promise<React.ReactElement> {
  // In Next.js App Router, params is a Promise and needs to be awaited
  const resolvedParams = await params;

  // Debug log to see what we're getting
  console.log("Page params:", resolvedParams);

  return (
    <div className="py-6">
      <div className="px-8  lg:px-50">
        <Navbar />
      </div>
      <ProductPage params={resolvedParams} />
      <ReviewsProduct>
        <></>
      </ReviewsProduct>
      <ReviewsComments>
        <></>
      </ReviewsComments>

      <Footer />
    </div>
  );
}
