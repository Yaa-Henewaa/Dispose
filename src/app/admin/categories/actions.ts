"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("Not authenticated");
  return session;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function createCategory(
  name: string,
  parentId: string | null,
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  if (!name.trim()) return { ok: false, error: "Name is required." };

  const slug = slugify(name);
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing)
    return { ok: false, error: "A category with this name already exists." };

  await prisma.category.create({
    data: { name: name.trim(), slug, parentId },
  });
  revalidatePath("/admin/categories");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteCategory(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  const productCount = await prisma.product.count({
    where: { categoryId: id },
  });
  if (productCount > 0) {
    return {
      ok: false,
      error: `Cannot delete: ${productCount} product(s) still use this category.`,
    };
  }
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  revalidatePath("/");
  return { ok: true };
}
