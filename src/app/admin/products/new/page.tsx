import { prisma } from "@/lib/prisma";
import ProductForm from "../ProductForm";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800">Add product</h1>
      <ProductForm
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      />
    </div>
  );
}
