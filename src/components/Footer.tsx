import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Footer() {
  const shop = await prisma.shopSetting.findUnique({ where: { id: "shop" } });

  return (
    <footer className="mt-16 border-t border-[#e9d7eb] bg-[linear-gradient(180deg,#fff8fd_0%,#f5ebf9_100%)]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <div className="flex items-center">
            <span className="text-lg font-semibold tracking-[0.02em] text-[#4b2458]">
              Disposé
            </span>
          </div>
          <p className="mt-2 text-sm text-[#7d5d86]">Ready to serve you.</p>
        </div>

        <div className="text-sm text-[#7d5d86]">
          <h3 className="mb-2 font-semibold text-[#4b2458]">Shop</h3>
          <ul className="space-y-1">
            <li>
              <Link href="/about" className="transition hover:text-[#4b2458]">
                About &amp; Contact
              </Link>
            </li>
            <li>
              <Link
                href="/delivery-policy"
                className="transition hover:text-stone-900"
              >
                Delivery &amp; Pickup Policy
              </Link>
            </li>
            <li>
              <Link
                href="/track-order"
                className="transition hover:text-stone-900"
              >
                Track my order
              </Link>
            </li>
          </ul>
        </div>

        <div className="text-sm text-[#7d5d86]">
          <h3 className="mb-2 font-semibold text-[#4b2458]">Contact</h3>
          <ul className="space-y-1">
            {shop?.address && <li>{shop.address}</li>}
            {shop?.phone && <li>{shop.phone}</li>}
            {shop?.hours && <li>{shop.hours}</li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-[#e9d7eb] py-4 text-center text-xs text-[#8c6a8d]">
        © {new Date().getFullYear()} Disposé. All rights reserved.
      </div>
    </footer>
  );
}
