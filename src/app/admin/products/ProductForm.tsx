"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ProductVisibility } from "@prisma/client";
import { createProduct, updateProduct } from "./actions";

interface CategoryOption {
  id: string;
  name: string;
}

interface ProductFormProps {
  categories: CategoryOption[];
  product?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    stock: number;
    visibility: ProductVisibility;
    categoryId: string;
    featured: boolean;
    images: string[];
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [stock, setStock] = useState(product?.stock?.toString() ?? "0");
  const [visibility, setVisibility] = useState<ProductVisibility>(
    product?.visibility ?? "VISIBLE",
  );
  const [categoryId, setCategoryId] = useState(
    product?.categoryId ?? categories[0]?.id ?? "",
  );
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [imagesText, setImagesText] = useState(
    (product?.images ?? []).join("\n"),
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!name.trim() || !categoryId || !price) {
      setError("Name, category, and price are required.");
      return;
    }

    setSaving(true);
    const input = {
      name: name.trim(),
      slug: slug.trim() || slugify(name),
      description,
      price: parseFloat(price),
      stock: parseInt(stock, 10) || 0,
      visibility,
      categoryId,
      featured,
      images: imagesText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    };

    try {
      if (product) {
        await updateProduct(product.id, input);
      } else {
        await createProduct(input);
      }
      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Something went wrong saving the product.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 max-w-2xl space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Product name
        </label>
        <input
          required
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            if (!product) setSlug(slugify(event.target.value));
          }}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          URL slug
        </label>
        <input
          required
          value={slug}
          onChange={(event) => setSlug(slugify(event.target.value))}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Price (GHS)
          </label>
          <input
            required
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Stock quantity
          </label>
          <input
            required
            type="number"
            min="0"
            value={stock}
            onChange={(event) => setStock(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Visibility
          </label>
          <select
            value={visibility}
            onChange={(event) =>
              setVisibility(event.target.value as ProductVisibility)
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="VISIBLE">In stock (visible)</option>
            <option value="OUT_OF_STOCK">Out of stock</option>
            <option value="HIDDEN">Hidden</option>
          </select>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={featured}
          onChange={(event) => setFeatured(event.target.checked)}
        />
        Feature on homepage
      </label>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Image URLs (one per line)
        </label>
        <textarea
          value={imagesText}
          onChange={(event) => setImagesText(event.target.value)}
          rows={3}
          placeholder="https://example.com/photo1.jpg"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono"
        />
        <p className="mt-1 text-xs text-gray-400">
          Upload photos to a service like Cloudinary or Supabase Storage, then
          paste the image links here.
        </p>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-brand-teal px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-teal-dark disabled:opacity-50"
      >
        {saving ? "Saving..." : product ? "Save changes" : "Add product"}
      </button>
    </form>
  );
}
