"use server";

import { prisma } from "@/lib/prisma";
import { initializeTransaction } from "@/lib/paystack";
import { generateOrderNumber, generatePaymentReference } from "@/lib/format";

export interface CheckoutItemInput {
  productId: string;
  quantity: number;
}

export interface CheckoutInput {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  fulfillmentType: "DELIVERY" | "PICKUP";
  deliveryAddress?: string;
  deliverySettingId?: string;
  items: CheckoutItemInput[];
}

export interface CheckoutResult {
  ok: boolean;
  error?: string;
  authorizationUrl?: string;
  orderNumber?: string;
}

export async function placeOrder(
  input: CheckoutInput,
): Promise<CheckoutResult> {
  if (!input.customerName?.trim() || !input.customerPhone?.trim()) {
    return { ok: false, error: "Name and phone number are required." };
  }

  if (!input.items || input.items.length === 0) {
    return { ok: false, error: "Your cart is empty." };
  }

  if (input.fulfillmentType === "DELIVERY" && !input.deliveryAddress?.trim()) {
    return { ok: false, error: "Delivery address is required." };
  }

  // Re-fetch products server-side so prices/stock can never be manipulated by the client.
  const productIds = input.items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  const productMap = new Map(products.map((product) => [product.id, product]));

  let subtotal = 0;
  const orderItemsData: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }[] = [];

  for (const item of input.items) {
    const product = productMap.get(item.productId);
    if (!product) {
      return { ok: false, error: "One of the items is no longer available." };
    }
    if (product.visibility === "HIDDEN") {
      return { ok: false, error: `${product.name} is no longer available.` };
    }
    if (product.stock < item.quantity) {
      return {
        ok: false,
        error: `${product.name} only has ${product.stock} left in stock.`,
      };
    }
    const price = Number(product.price);
    subtotal += price * item.quantity;
    orderItemsData.push({
      productId: product.id,
      name: product.name,
      price,
      quantity: item.quantity,
    });
  }

  let deliveryFee = 0;
  let deliveryArea: string | null = null;

  if (input.fulfillmentType === "DELIVERY") {
    if (input.deliverySettingId) {
      const setting = await prisma.deliverySetting.findUnique({
        where: { id: input.deliverySettingId },
      });
      if (setting) {
        deliveryFee = Number(setting.fee);
        deliveryArea = setting.area;
      }
    }
    if (!deliveryArea) {
      const defaultSetting = await prisma.deliverySetting.findFirst({
        where: { isDefault: true },
      });
      if (defaultSetting) {
        deliveryFee = Number(defaultSetting.fee);
        deliveryArea = defaultSetting.area;
      }
    }
  }

  const total = subtotal + deliveryFee;
  const orderNumber = generateOrderNumber();
  const paymentReference = generatePaymentReference();

  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerName: input.customerName.trim(),
      customerPhone: input.customerPhone.trim(),
      customerEmail: input.customerEmail?.trim() || null,
      fulfillmentType: input.fulfillmentType,
      deliveryAddress:
        input.fulfillmentType === "DELIVERY"
          ? input.deliveryAddress?.trim()
          : null,
      deliveryArea,
      deliveryFee,
      subtotal,
      total,
      paymentReference,
      items: {
        create: orderItemsData,
      },
    },
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    const transaction = await initializeTransaction({
      email: input.customerEmail?.trim() || "guest@dispose.shop",
      amountInGHS: total,
      reference: paymentReference,
      callbackUrl: `${siteUrl}/order-confirmation/${order.orderNumber}`,
      metadata: { orderNumber: order.orderNumber },
    });

    return {
      ok: true,
      authorizationUrl: transaction.authorizationUrl,
      orderNumber: order.orderNumber,
    };
  } catch {
    return {
      ok: false,
      error:
        "We could not start the payment process. Please try again shortly.",
    };
  }
}
