"use server";

import { prisma } from "@/lib/prisma";

export interface TrackOrderResult {
  found: boolean;
  order?: {
    orderNumber: string;
    status: string;
    paymentStatus: string;
    fulfillmentType: string;
    total: number;
    createdAt: string;
    items: { name: string; quantity: number; price: number }[];
  };
}

export async function trackOrder(query: string): Promise<TrackOrderResult> {
  const trimmedQuery = query.trim();

  const order = await prisma.order.findFirst({
    where: {
      OR: [{ orderNumber: trimmedQuery }, { customerPhone: trimmedQuery }],
    },
    include: { items: true },
  });

  if (!order) return { found: false };

  return {
    found: true,
    order: {
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      fulfillmentType: order.fulfillmentType,
      total: Number(order.total),
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: Number(item.price),
      })),
    },
  };
}
