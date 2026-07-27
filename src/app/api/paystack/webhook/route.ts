import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/paystack";

/**
 * Paystack webhook endpoint. Configure this URL in the Paystack dashboard:
 * Settings -> API Keys & Webhooks -> Webhook URL.
 * https://<your-domain>/api/paystack/webhook
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  const isValid = await verifyWebhookSignature(rawBody, signature);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "charge.success") {
    const reference: string | undefined = event.data?.reference;
    if (reference) {
      const order = await prisma.order.findUnique({
        where: { paymentReference: reference },
      });
      if (order && order.paymentStatus !== "PAID") {
        await prisma.order.update({
          where: { id: order.id },
          data: { paymentStatus: "PAID", status: "PROCESSING" },
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
