import Link from "next/link";
import Image from "next/image";
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
  const fallbackImages = [
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=60&fm=webp",
    "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=900&q=60&fm=webp",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=60&fm=webp",
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=60&fm=webp",
  ];

  // Keep in sync with images.remotePatterns in next.config.ts, or next/image throws and crashes the page.
  const allowedImageHosts = [
    "res.cloudinary.com",
    "images.unsplash.com",
    "m.media-amazon.com",
  ];
  const isAllowedImage = (url: string) => {
    try {
      const { hostname } = new URL(url);
      return (
        allowedImageHosts.includes(hostname) ||
        hostname.endsWith(".supabase.co")
      );
    } catch {
      return false;
    }
  };

  const getImageSrc = (rawImage: string | null, name: string) => {
    if (rawImage && isAllowedImage(rawImage)) {
      return rawImage;
    }

    const seed = name
      .split("")
      .reduce((total, char) => total + char.charCodeAt(0), 0);

    return fallbackImages[seed % fallbackImages.length];
  };

  const image = getImageSrc(product.images[0] ?? null, product.name);
  const outOfStock =
    product.visibility === "OUT_OF_STOCK" || product.stock <= 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-none border border-[#ead8eb] bg-white/90 shadow-[0_8px_24px_rgba(107,60,123,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(107,60,123,0.14)]">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden bg-stone-100">
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
            quality={60}
          />
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
