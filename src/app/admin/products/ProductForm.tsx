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
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function readFileAsDataUrl(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Could not read image file."));
      reader.readAsDataURL(file);
    });
  }

  async function handleImageSelection(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    setUploadingImages(true);
    try {
      const imageDataUrls = await Promise.all(files.map(readFileAsDataUrl));
      setUploadedImages((current) => [...current, ...imageDataUrls]);
    } catch {
      setError("Could not upload one or more images.");
    } finally {
      setUploadingImages(false);
      event.target.value = "";
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!name.trim() || !categoryId || !price) {
      setError("Name, category, and price are required.");
      return;
    }

    setSaving(true);
    const pastedImages = imagesText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const allImages = [...new Set([...uploadedImages, ...pastedImages])];

    const input = {
      name: name.trim(),
      slug: slug.trim() || slugify(name),
      description,
      price: parseFloat(price),
      stock: parseInt(stock, 10) || 0,
      visibility,
      categoryId,
      featured,
      images: allImages,
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
          Product images
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageSelection}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-[#f7d9e8] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-[#7a3d62]"
        />
        {uploadingImages && (
          <p className="mt-2 text-sm text-gray-500">Preparing images...</p>
        )}
        {uploadedImages.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {uploadedImages.map((image, index) => (
              <img
                key={`${image}-${index}`}
                src={image}
                alt={`Uploaded preview ${index + 1}`}
                className="h-24 w-full rounded-lg object-cover"
              />
            ))}
          </div>
        )}
        <textarea
          value={imagesText}
          onChange={(event) => setImagesText(event.target.value)}
          rows={3}
          placeholder="Or paste image links here, one per line"
          className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono"
        />
        <p className="mt-1 text-xs text-gray-400">
          You can upload images from your device directly, or paste image links
          if you already have them.
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
        className="rounded-full bg-[#f7d9e8] px-6 py-2.5 text-sm font-semibold text-[#7a3d62] transition hover:bg-[#f2c9db] disabled:opacity-50"
      >
        {saving ? "Saving..." : product ? "Save changes" : "Add product"}
      </button>
    </form>
  );
}
