import ProductPage from "../../../../components/catalog/ProductPage.jsx";
import Navbar from "../../../../components/layout/Navbar.jsx";
import Footer from "../../../../components/layout/Footer.jsx";
import ReviewsProduct from "../../../../components/catalog/ReviewsProduct.jsx";
import ReviewsComments from "../../../../components/catalog/ReviewsComments.jsx";

export default async function ProductDetailPage({ params }) {
  // In Next.js App Router, params is a Promise and needs to be awaited
  const resolvedParams = await params;

  // Debug log to see what we're getting
  console.log("Page params:", resolvedParams);

  return (
    <div className="py-6">
      <Navbar className="px-8  lg:px-50" />
      <ProductPage params={resolvedParams} />
      <ReviewsProduct />
      <ReviewsComments />

      <Footer />
    </div>
  );
}
