import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import AddToCartButton from "@/components/AddToCartButton";
import { formatGHS } from "@/lib/format";
import type { Metadata } from "next";

export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return {};
  return {
    title: product.name,
    description: product.description || undefined,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product || product.visibility === "HIDDEN") notFound();

  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      visibility: { not: "HIDDEN" },
    },
    take: 4,
  });

  const outOfStock =
    product.visibility === "OUT_OF_STOCK" || product.stock <= 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="grid gap-3">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50">
            {product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover"
                loading="eager"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-300">
                No image
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1, 5).map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-lg bg-gray-50"
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 2}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-[#8a5a8f]">
            {product.category.name}
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[#4b2458]">
            {product.name}
          </h1>
          <p className="mt-3 text-2xl font-bold text-[#c24b8b]">
            {formatGHS(Number(product.price))}
          </p>
          <p className="mt-2 text-sm text-[#5c4765]">
            {outOfStock ? (
              <span className="font-medium text-red-500">Out of stock</span>
            ) : (
              <span className="font-medium text-[#2f8f7b]">
                In stock ({product.stock} available)
              </span>
            )}
          </p>

          {product.description && (
            <p className="mt-4 whitespace-pre-line text-[#5f5163]">
              {product.description}
            </p>
          )}

          <div className="mt-6 w-full max-w-sm">
            <AddToCartButton
              productId={product.id}
              slug={product.slug}
              name={product.name}
              price={Number(product.price)}
              image={product.images[0] ?? null}
              stock={product.stock}
              outOfStock={outOfStock}
            />
          </div>
        </div>
      </div>

      <section className="mt-14 rounded-2xl border border-[#f0e2eb] bg-[#fffafc] p-5">
        <h2 className="mb-4 text-lg font-bold text-[#4b2458]">
          You may also like
        </h2>
        {related.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {related.map((item) => (
              <ProductCard
                key={item.id}
                product={{
                  id: item.id,
                  slug: item.slug,
                  name: item.name,
                  price: Number(item.price),
                  images: item.images,
                  stock: item.stock,
                  visibility: item.visibility,
                }}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#6a4a6b]">
            More similar items will appear here soon.
          </p>
        )}
      </section>
    </div>
  );
}
