import { redirect } from "next/navigation";

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Redirect legacy catalog product URLs to the canonical product detail route.
 */
export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps): Promise<never> {
  const resolvedParams = await params;

  redirect(`/product/${encodeURIComponent(resolvedParams.id)}`);
}
