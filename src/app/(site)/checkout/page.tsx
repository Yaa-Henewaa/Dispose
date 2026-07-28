import { prisma } from "@/lib/prisma";
import CheckoutForm from "./CheckoutForm";

export default async function CheckoutPage() {
  const [deliverySettings, shop] = await Promise.all([
    prisma.deliverySetting.findMany({ orderBy: { area: "asc" } }),
    prisma.shopSetting.findUnique({ where: { id: "shop" } }),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-xl font-bold text-gray-800">Checkout</h1>
      <CheckoutForm
        deliverySettings={deliverySettings.map((setting) => ({
          id: setting.id,
          area: setting.area,
          fee: Number(setting.fee),
          isDefault: setting.isDefault,
        }))}
        pickupAddress={shop?.address ?? ""}
        pickupHours={shop?.hours ?? ""}
        pickupNotes={shop?.pickupNotes ?? ""}
      />
    </div>
  );
}
