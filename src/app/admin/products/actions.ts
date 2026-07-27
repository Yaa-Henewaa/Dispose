"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import type { ProductVisibility } from "@prisma/client";

export interface ProductFormInput {
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  visibility: ProductVisibility;
  categoryId: string;
  featured: boolean;
  images: string[];
}

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("Not authenticated");
  return session;
}

export async function createProduct(input: ProductFormInput) {
  await requireAdmin();
  await prisma.product.create({ data: input });
  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function updateProduct(id: string, input: ProductFormInput) {
  await requireAdmin();
  await prisma.product.update({ where: { id }, data: input });
  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function setProductVisibility(
  id: string,
  visibility: ProductVisibility,
) {
  await requireAdmin();
  await prisma.product.update({ where: { id }, data: { visibility } });
  revalidatePath("/admin/products");
  revalidatePath("/");
}
