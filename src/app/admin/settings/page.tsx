import { prisma } from "@/lib/prisma";
import DeliverySettingsManager from "./DeliverySettingsManager";
import ShopSettingsForm from "./ShopSettingsForm";

export default async function AdminSettingsPage() {
  const [deliverySettings, shop] = await Promise.all([
    prisma.deliverySetting.findMany({ orderBy: { area: "asc" } }),
    prisma.shopSetting.findUnique({ where: { id: "shop" } }),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Settings</h1>
        <p className="text-sm text-gray-500">
          Manage delivery fees and shop details. No code changes needed.
        </p>
      </div>

      <DeliverySettingsManager
        deliverySettings={deliverySettings.map((setting) => ({
          id: setting.id,
          area: setting.area,
          fee: Number(setting.fee),
          isDefault: setting.isDefault,
        }))}
      />

      <ShopSettingsForm
        shop={{
          shopName: shop?.shopName ?? "Disposé",
          address: shop?.address ?? "",
          hours: shop?.hours ?? "",
          phone: shop?.phone ?? "",
          whatsapp: shop?.whatsapp ?? "",
          pickupNotes: shop?.pickupNotes ?? "",
        }}
      />
    </div>
  );
}
