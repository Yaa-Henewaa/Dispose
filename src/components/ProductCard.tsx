import Link from "next/link";
import { formatGHS } from "@/lib/format";

export interface ProductCardData {
  id: string;
  slug: string;
  name: string;
  price: number;
  images: string[];
  stock: number;
  visibility: "VISIBLE" | "OUT_OF_STOCK" | "HIDDEN";
}

export default function ProductCard({ product }: { product: ProductCardData }) {
  const isRenderableImage = (url: string) => {
    if (!url.trim()) return false;
    if (url.startsWith("data:")) return true;

    try {
      const { protocol } = new URL(url);
      return protocol === "http:" || protocol === "https:";
    } catch {
      return false;
    }
  };

  const rawImage = product.images[0] ?? null;
  const image = rawImage && isRenderableImage(rawImage) ? rawImage : null;
  const outOfStock =
    product.visibility === "OUT_OF_STOCK" || product.stock <= 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-none border border-[#ead8eb] bg-white/90 shadow-[0_8px_24px_rgba(107,60,123,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(107,60,123,0.14)]">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden bg-stone-100">
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-stone-400">
              No image
            </div>
          )}
          {outOfStock && (
            <span className="absolute left-2 top-2 rounded-full bg-[linear-gradient(135deg,#d76ea0_0%,#7a5ceb_100%)] px-2 py-1 text-xs font-medium text-white">
              Out of stock
            </span>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-3.5">
        <Link href={`/product/${product.slug}`}>
          <h3 className="line-clamp-2 text-sm font-medium leading-5 text-[#4b2458] hover:text-[#6a3b73]">
            {product.name}
          </h3>
        </Link>
        <p className="text-[15px] font-semibold leading-4 text-[#6a3b73]">
          {formatGHS(product.price)}
        </p>
        <div className="mt-auto pt-1">
          <Link
            href={`/product/${product.slug}`}
            className="inline-flex w-full items-center justify-center rounded-full border border-[#e7c8e6] bg-white px-4 py-2 text-sm font-medium text-[#5b3a63] transition hover:border-[#d8b9d5] hover:bg-[#faf4fb]"
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  );
}
