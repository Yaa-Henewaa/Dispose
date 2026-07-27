import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatGHS } from "@/lib/format";
import ProductRowActions from "./ProductRowActions";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-brand-teal px-4 py-2 text-sm font-semibold text-white hover:bg-brand-teal-dark"
        >
          + Add product
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-100 bg-white">
        <table className="w-full min-w-180 text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-2 font-medium">Product</th>
              <th className="px-4 py-2 font-medium">Category</th>
              <th className="px-4 py-2 font-medium">Price</th>
              <th className="px-4 py-2 font-medium">Stock</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-2 font-medium text-gray-800">
                  {product.name}
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {product.category.name}
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {formatGHS(Number(product.price))}
                </td>
                <td className="px-4 py-2 text-gray-600">{product.stock}</td>
                <td className="px-4 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      product.visibility === "VISIBLE"
                        ? "bg-brand-teal/10 text-brand-teal"
                        : product.visibility === "OUT_OF_STOCK"
                          ? "bg-yellow-50 text-yellow-700"
                          : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {product.visibility.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <ProductRowActions
                    productId={product.id}
                    visibility={product.visibility}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="p-4 text-center text-sm text-gray-500">
            No products yet. Add your first product to get started.
          </p>
        )}
      </div>
    </div>
  );
}
