import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  const products = query
    ? await prisma.product.findMany({
        where: {
          visibility: { not: "HIDDEN" },
          name: { contains: query, mode: "insensitive" },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-xl font-bold text-gray-800">
        {query ? `Search results for "${query}"` : "Search products"}
      </h1>

      {query && products.length === 0 && (
        <p className="mt-8 text-center text-gray-500">
          No products found for &quot;{query}&quot;.
        </p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: Number(product.price),
              images: product.images,
              stock: product.stock,
              visibility: product.visibility,
            }}
          />
        ))}
      </div>
    </div>
  );
}
