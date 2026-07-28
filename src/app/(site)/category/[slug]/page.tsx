import { notFound } from "next/navigation";
import Link from "next/link";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import CategorySortSelect from "@/components/CategorySortSelect";

export const revalidate = 60;

const getCategoryData = cache(async (slug: string) => {
  return prisma.category.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      children: {
        orderBy: { sortOrder: "asc" },
        select: { id: true, name: true, slug: true },
      },
    },
  });
});

const getCategoryProducts = cache(
  async (
    categoryIds: string[],
    orderBy: { price?: "asc" | "desc"; createdAt?: "desc" },
  ) => {
    return prisma.product.findMany({
      where: {
        categoryId: { in: categoryIds },
        visibility: { not: "HIDDEN" },
      },
      orderBy,
      select: {
        id: true,
        slug: true,
        name: true,
        price: true,
        images: true,
        stock: true,
        visibility: true,
      },
    });
  },
);

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string; sub?: string }>;
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const { sort, sub } = await searchParams;

  const category = await getCategoryData(slug);

  if (!category) notFound();

  const categoryIds = sub
    ? [sub]
    : [category.id, ...category.children.map((c) => c.id)];

  const orderBy: { price?: "asc" | "desc"; createdAt?: "desc" } =
    sort === "price-asc"
      ? { price: "asc" }
      : sort === "price-desc"
        ? { price: "desc" }
        : { createdAt: "desc" };

  const products = await getCategoryProducts(categoryIds, orderBy);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800">{category.name}</h1>

      {category.children.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/category/${slug}`}
            prefetch={true}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              !sub
                ? "bg-[#f7d9e8] text-[#7a3d62]"
                : "bg-[#fdf2f7] text-[#8b5e7a] hover:bg-[#f8e3ee]"
            }`}
          >
            All
          </Link>
          {category.children.map((child) => (
            <Link
              key={child.id}
              href={`/category/${slug}?sub=${child.id}`}
              prefetch={true}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                sub === child.id
                  ? "bg-[#f7d9e8] text-[#7a3d62]"
                  : "bg-[#fdf2f7] text-[#8b5e7a] hover:bg-[#f8e3ee]"
              }`}
            >
              {child.name}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <CategorySortSelect slug={slug} currentSort={sort} sub={sub} />
      </div>

      {products.length === 0 ? (
        <p className="mt-8 text-center text-gray-500">
          No products in this category yet.
        </p>
      ) : (
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
      )}
    </div>
  );
}
