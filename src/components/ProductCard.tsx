import Link from "next/link";
import Image from "next/image";
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
  const image = product.images[0] ?? null;
  const outOfStock =
    product.visibility === "OUT_OF_STOCK" || product.stock <= 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition group-hover:scale-105"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-300">
              No image
            </div>
          )}
          {outOfStock && (
            <span className="absolute left-2 top-2 rounded-full bg-gray-900/80 px-2 py-1 text-xs font-medium text-white">
              Out of stock
            </span>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <Link href={`/product/${product.slug}`}>
          <h3 className="line-clamp-2 text-sm font-medium text-gray-800 hover:text-brand-teal">
            {product.name}
          </h3>
        </Link>
        <p className="text-base font-semibold text-brand-pink">
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
