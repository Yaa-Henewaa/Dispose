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
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-4xl border border-[#ecd8ee] bg-[linear-gradient(180deg,rgba(255,250,253,0.96)_0%,#fffafc_100%)] p-8 shadow-[0_20px_40px_rgba(107,60,123,0.08)]">
        <div className="space-y-6">
          <div className="space-y-4 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#8c5f8c]">
              About Disposé
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-[#3f2b42] sm:text-4xl">
              Clean, reliable disposables for vendors, parties, and daily life
              in Accra.
            </h1>
            <p className="text-base leading-8 text-[#5b4a67] sm:text-lg">
              Disposé makes it simple for food vendors, events, and households
              in Accra to get affordable disposables fast. Whether you need
              takeaway packs, party supplies, or daily essentials, we deliver or
              you can pick up in-store.
            </p>
          </div>

          <div className="space-y-2 max-w-2xl">
            <h2 className="text-xl font-semibold text-[#3f2b42]">
              Wholesale pricing
            </h2>
            <p className="text-base leading-7 text-[#6f5278]">
              Bulk packs and trade discounts for food vendors, event organisers,
              and small businesses across Accra. Contact us for quotes,
              minimums, and faster turnaround.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[28px] border border-[#e9dfea] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#4b2458]">
            Contact information
          </h2>
          <p className="mt-3 text-sm leading-7 text-[#6f5278]">
            Get in touch for custom orders, large pack requests, or delivery
            details.
          </p>
          <ul className="mt-6 space-y-4 text-[#5d4665]">
            {shop?.address && (
              <li className="flex gap-3">
                <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#faf0fb] text-[#8b5f8a]">
                  <FiMapPin size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold">Shop address</p>
                  <p className="text-sm text-[#7a637f]">{shop.address}</p>
                </div>
              </li>
            )}
            {shop?.phone && (
              <li className="flex gap-3">
                <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#faf0fb] text-[#8b5f8a]">
                  <FiPhone size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold">Phone</p>
                  <p className="text-sm text-[#7a637f]">{shop.phone}</p>
                </div>
              </li>
            )}
            {shop?.hours && (
              <li className="flex gap-3">
                <span className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#faf0fb] text-[#8b5f8a]">
                  <FiClock size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold">Opening hours</p>
                  <p className="text-sm text-[#7a637f]">{shop.hours}</p>
                </div>
              </li>
            )}
          </ul>
        </div>

        <div className="rounded-[28px] border border-[#e9dfea] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#4b2458]">Message us</h2>
          <p className="mt-3 text-sm leading-7 text-[#6f5278]">
            Prefer a quick chat? Reach us on WhatsApp for orders, quotes, and
            delivery questions.
          </p>
          {shop?.whatsapp && (
            <a
              href={`https://wa.me/${shop.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#f8ecfb] px-5 py-3 text-sm font-semibold text-[#6f4b86] transition hover:bg-[#f1e0f9]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#6f4b86]">
                <FiMessageCircle size={18} />
              </span>
              Chat on WhatsApp
            </a>
          )}
          {!shop?.whatsapp && (
            <p className="mt-6 text-sm text-[#8c748f]">
              WhatsApp contact not available yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
