import ProductPage from "../../../../../components/catalog/ProductPage.jsx";

export default function ProductDetailPage({ params }) {
  // You can use params.id to fetch the specific product data
  return <ProductPage params={params} />;
}
