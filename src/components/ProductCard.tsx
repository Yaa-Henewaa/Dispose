import Link from "next/link";
import { formatGHS } from "@/lib/format";
import AddToCartButton from "./AddToCartButton";

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
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80",
  ];

  const getImageSrc = (rawImage: string | null, name: string) => {
    if (rawImage && !rawImage.includes("placehold.co")) {
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
    <div className="group flex flex-col overflow-hidden rounded-[18px] border border-[#ead8eb] bg-white/90 shadow-[0_8px_24px_rgba(107,60,123,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(107,60,123,0.14)]">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100">
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
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
          <AddToCartButton
            productId={product.id}
            slug={product.slug}
            name={product.name}
            price={product.price}
            image={image}
            stock={product.stock}
            outOfStock={outOfStock}
          />
        </div>
      </div>
    </div>
  );
}
