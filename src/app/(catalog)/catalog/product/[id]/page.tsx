import ProductPage from "../../../../../components/catalog/ProductPage";

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Product detail page component
 * Displays detailed information about a specific product
 */
export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps): Promise<React.ReactElement> {
  const resolvedParams = await params;

  return <ProductPage params={resolvedParams} />;
}
