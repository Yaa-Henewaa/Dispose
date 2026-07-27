import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export default async function HomePage() {
  const [categories, featured, latest] = await Promise.all([
    prisma.category.findMany({
      where: { parentId: null },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.product.findMany({
      where: { featured: true, visibility: { not: "HIDDEN" } },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      where: { visibility: { not: "HIDDEN" } },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const categoryStyles = ["bg-brand-teal", "bg-brand-pink", "bg-brand-purple"];

  return (
    <div>
      <section className="bg-linear-to-br from-brand-teal via-brand-purple to-brand-pink px-4 py-14 text-white">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="text-3xl font-extrabold sm:text-4xl">
            Disposé — Ready to serve you
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-white/90">
            Disposables, party supplies, and toiletries in Accra. Order online
            for delivery or pickup, pay by card or mobile money.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/category/party-supplies"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-brand-pink shadow hover:bg-white/90"
            >
              Shop Party Supplies
            </Link>
            <Link
              href="/category/disposables"
              className="rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/40 hover:bg-white/20"
            >
              Shop Disposables
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mb-4 text-lg font-bold text-gray-800">
          Shop by category
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className={`${
                categoryStyles[index % categoryStyles.length]
              } flex h-24 items-center justify-center rounded-2xl text-center text-base font-semibold text-white shadow-sm transition hover:opacity-90 sm:h-32 sm:text-lg`}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-6">
          <h2 className="mb-4 text-lg font-bold text-gray-800">
            Featured products
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {featured.map((product) => (
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
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-6 pb-16">
        <h2 className="mb-4 text-lg font-bold text-gray-800">New arrivals</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {latest.map((product) => (
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
      </section>
    </div>
  );
}
