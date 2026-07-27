import { prisma } from "@/lib/prisma";
import { formatGHS } from "@/lib/format";

export const metadata = { title: "Delivery & Pickup Policy" };

export default async function DeliveryPolicyPage() {
  const [shop, deliverySettings] = await Promise.all([
    prisma.shopSetting.findUnique({ where: { id: "shop" } }),
    prisma.deliverySetting.findMany({ orderBy: { area: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800">
        Delivery &amp; Pickup Policy
      </h1>

      <h2 className="mt-6 text-lg font-bold text-gray-800">Delivery</h2>
      <p className="mt-2 text-gray-600">
        We deliver across Accra. Choose your area at checkout — the delivery fee
        is calculated automatically.
      </p>
      {deliverySettings.length > 0 && (
        <ul className="mt-3 divide-y divide-gray-100 rounded-xl border border-gray-100">
          {deliverySettings.map((setting) => (
            <li
              key={setting.id}
              className="flex justify-between px-4 py-2 text-sm"
            >
              <span className="text-gray-600">{setting.area}</span>
              <span className="font-medium text-gray-800">
                {formatGHS(Number(setting.fee))}
              </span>
            </li>
          ))}
        </ul>
      )}

      <h2 className="mt-8 text-lg font-bold text-gray-800">Pickup</h2>
      <p className="mt-2 text-gray-600">
        Prefer to pick up your order yourself? Select &quot;Pickup&quot; at
        checkout — there&apos;s no delivery fee.
      </p>
      <ul className="mt-3 space-y-1 text-gray-600">
        {shop?.address && <li>📍 {shop.address}</li>}
        {shop?.hours && <li>🕒 {shop.hours}</li>}
        {shop?.pickupNotes && <li>{shop.pickupNotes}</li>}
      </ul>
    </div>
  );
}
