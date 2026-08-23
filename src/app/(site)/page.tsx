import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Disposé Ghana | Disposable Cups, Plates & Party Supplies in Accra",
  description:
    "Shop disposable cups, plates, takeaway packs, party supplies, and toiletries in Accra, Ghana. Fast delivery and pickup available from Disposé.",
};

export const revalidate = 60;

export default async function HomePage() {
  let categories: Array<{ id: string; name: string; slug: string }> = [];
  let featured: Array<{
    id: string;
    slug: string;
    name: string;
    price: unknown;
    images: string[];
    stock: number;
    visibility: "VISIBLE" | "OUT_OF_STOCK" | "HIDDEN";
  }> = [];
  let latest: Array<{
    id: string;
    slug: string;
    name: string;
    price: unknown;
    images: string[];
    stock: number;
    visibility: "VISIBLE" | "OUT_OF_STOCK" | "HIDDEN";
  }> = [];

  const mapProduct = (product: (typeof featured)[number]) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: Number(product.price),
    images: product.images,
    stock: product.stock,
    visibility: product.visibility,
  });

  try {
    [categories, featured, latest] = await Promise.all([
      prisma.category.findMany({
        where: { parentId: null },
        orderBy: { sortOrder: "asc" },
        select: { id: true, name: true, slug: true },
      }) as Promise<Array<{ id: string; name: string; slug: string }>>,
      prisma.product.findMany({
        where: { featured: true, visibility: { not: "HIDDEN" } },
        take: 8,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          slug: true,
          name: true,
          price: true,
          images: true,
          stock: true,
          visibility: true,
        },
      }),
      prisma.product.findMany({
        where: { visibility: { not: "HIDDEN" } },
        take: 8,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          slug: true,
          name: true,
          price: true,
          images: true,
          stock: true,
          visibility: true,
        },
      }),
    ]);
  } catch {
    categories = [];
    featured = [];
    latest = [];
  }

  return (
    <div>
      <section className="relative isolate overflow-hidden border-b border-stone-200 px-4 py-14 text-white">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://m.media-amazon.com/images/I/71iSBBDSrOL.jpg')",
            backgroundSize: "50%",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(243,169,201,0.72)_0%,rgba(217,139,207,0.68)_45%,rgba(154,79,180,0.76)_100%)]" />
        <div className="relative mx-auto max-w-6xl text-center">
          <div className="mb-4 inline-flex rounded-full border border-white/40 bg-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/90 backdrop-blur-sm">
            Ready to serve you!
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Disposable essentials for food vendors, parties, and everyday use.
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/90 sm:text-base">
            Discover disposables, party supplies, and everyday basics with a
            cleaner experience designed for quick ordering and effortless
            delivery.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/category/party-supplies"
              className="rounded-full border border-white/55 bg-white/15 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/25"
            >
              Shop Party Supplies
            </Link>
            <Link
              href="/category/disposables"
              className="rounded-full border border-white/55 bg-white/15 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/25"
            >
              Shop Disposables
            </Link>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-8">
          <div className="rounded-[28px] bg-[linear-gradient(135deg,rgba(255,247,251,0.95)_0%,rgba(245,232,247,0.95)_100%)] p-6 shadow-[0_10px_30px_rgba(107,60,123,0.05)] sm:p-8">
            <div className="mb-5">
              <div className="mb-2 inline-flex rounded-full border border-[#f7e6ef] bg-white/70 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.34em] text-[#9a5d87]">
                Featured picks
              </div>
              <h2 className="text-xl font-semibold text-[#4b2458]">
                A refined selection of our most-loved essentials.
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
              {featured.map((product) => (
                <ProductCard key={product.id} product={mapProduct(product)} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-8 pb-16">
        <div className="rounded-[28px] bg-[linear-gradient(135deg,rgba(255,247,251,0.95)_0%,rgba(245,232,247,0.95)_100%)] p-6 shadow-[0_10px_30px_rgba(107,60,123,0.05)] sm:p-8">
          <div className="mb-5">
            <div className="mb-2 inline-flex rounded-full border border-[#f7e6ef] bg-white/70 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.34em] text-[#9a5d87]">
              Fresh arrivals
            </div>
            <h2 className="text-xl font-semibold text-[#4b2458]">
              Discover what’s just landed for your next event.
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
            {latest.map((product) => (
              <ProductCard key={product.id} product={mapProduct(product)} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
