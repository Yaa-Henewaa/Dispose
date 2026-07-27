import { prisma } from "@/lib/prisma";

export const metadata = { title: "About & Contact" };

export default async function AboutPage() {
  const shop = await prisma.shopSetting.findUnique({ where: { id: "shop" } });

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800">About Disposé</h1>
      <p className="mt-4 text-gray-600">
        Disposé is your one-stop shop in Accra for disposables, party supplies,
        and toiletries. We&apos;re ready to serve you — whether you&apos;re
        planning a party, restocking essentials, or need something in a hurry.
      </p>

      <h2 className="mt-8 text-lg font-bold text-gray-800">Contact us</h2>
      <ul className="mt-3 space-y-2 text-gray-600">
        {shop?.address && <li>📍 {shop.address}</li>}
        {shop?.phone && <li>📞 {shop.phone}</li>}
        {shop?.hours && <li>🕒 {shop.hours}</li>}
        {shop?.whatsapp && (
          <li>
            💬{" "}
            <a
              href={`https://wa.me/${shop.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-teal hover:underline"
            >
              Chat with us on WhatsApp
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}
