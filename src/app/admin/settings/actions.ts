"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("Not authenticated");
  return session;
}

export async function addDeliverySetting(
  area: string,
  fee: number,
  isDefault: boolean,
) {
  await requireAdmin();
  if (isDefault) {
    await prisma.deliverySetting.updateMany({
      data: { isDefault: false },
      where: {},
    });
  }
  await prisma.deliverySetting.create({
    data: { area: area.trim(), fee, isDefault },
  });
  revalidatePath("/admin/settings");
  revalidatePath("/checkout");
  revalidatePath("/delivery-policy");
}

export async function updateDeliverySetting(
  id: string,
  area: string,
  fee: number,
  isDefault: boolean,
) {
  await requireAdmin();
  if (isDefault) {
    await prisma.deliverySetting.updateMany({
      data: { isDefault: false },
      where: {},
    });
  }
  await prisma.deliverySetting.update({
    where: { id },
    data: { area: area.trim(), fee, isDefault },
  });
  revalidatePath("/admin/settings");
  revalidatePath("/checkout");
  revalidatePath("/delivery-policy");
}

export async function deleteDeliverySetting(id: string) {
  await requireAdmin();
  await prisma.deliverySetting.delete({ where: { id } });
  revalidatePath("/admin/settings");
  revalidatePath("/checkout");
  revalidatePath("/delivery-policy");
}

export interface ShopSettingInput {
  shopName: string;
  address: string;
  hours: string;
  phone: string;
  whatsapp: string;
  pickupNotes: string;
}

export async function updateShopSettings(input: ShopSettingInput) {
  await requireAdmin();
  await prisma.shopSetting.upsert({
    where: { id: "shop" },
    create: { id: "shop", ...input },
    update: input,
  });
  revalidatePath("/", "layout");
}
