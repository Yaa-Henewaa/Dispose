import { prisma } from "@/lib/prisma";
import {
  FiMapPin,
  FiPhone,
  FiClock,
  FiMessageCircle,
  FiArrowUpRight,
} from "react-icons/fi";

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
      <ul className="mt-3 space-y-3 text-gray-600">
        {shop?.address && (
          <li className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff4fa] text-[#7a3d62]">
              <FiMapPin size={18} />
            </span>
            <span>{shop.address}</span>
          </li>
        )}
        {shop?.phone && (
          <li className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff4fa] text-[#7a3d62]">
              <FiPhone size={18} />
            </span>
            <span>{shop.phone}</span>
          </li>
        )}
        {shop?.hours && (
          <li className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fff4fa] text-[#7a3d62]">
              <FiClock size={18} />
            </span>
            <span>{shop.hours}</span>
          </li>
        )}
        {shop?.whatsapp && (
          <li>
            <a
              href={`https://wa.me/${shop.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#e8cfe0] bg-[linear-gradient(135deg,#fff7fb_0%,#f5e8f7_100%)] px-4 py-2.5 font-medium text-[#7a3d62] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-[#7a3d62]">
                <FiMessageCircle size={16} />
              </span>
              <span>Chat with us on WhatsApp</span>
              <FiArrowUpRight size={16} />
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}
