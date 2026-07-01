import type { Metadata } from "next";
import CatalogPageClient from "./CatalogPageClient";
import {
  getCatalogPageTitle,
  parseCatalogFiltersFromSearchParams,
} from "@/lib/catalogQueryParams";

type CatalogPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function toUrlSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): URLSearchParams {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string") {
      params.set(key, value);
    } else if (Array.isArray(value)) {
      params.set(key, value.join(","));
    }
  }

  return params;
}

export async function generateMetadata({
  searchParams,
}: CatalogPageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const filters = parseCatalogFiltersFromSearchParams(
    toUrlSearchParams(resolvedSearchParams),
  );

  return {
    title: getCatalogPageTitle(filters),
    description: "Browse board games, expansions, and accessories at Dice & Decks.",
  };
}

export default function CatalogPage() {
  return <CatalogPageClient />;
}
