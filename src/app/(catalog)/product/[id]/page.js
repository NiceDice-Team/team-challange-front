import ProductPage from "../../../../components/catalog/ProductPage.jsx";
import Navbar from "../../../../components/layout/Navbar.jsx";
import Footer from "../../../../components/layout/Footer.jsx";
import ReviewsProduct from "../../../../components/catalog/ReviewsProduct.jsx";

export default function ProductDetailPage({ params }) {
  // You can use params.id to fetch the specific product data
  return (
    <>
      <Navbar />
      <ProductPage params={params} />
      <ReviewsProduct />
      <Footer />
    </>
  );
}
