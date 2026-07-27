import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Footer() {
  const shop = await prisma.shopSetting.findUnique({ where: { id: "shop" } });

  return (
    <footer className="mt-16 border-t border-gray-100 bg-gray-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-teal text-sm font-bold text-white">
              D
            </span>
            <span className="text-lg font-bold text-brand-pink">Disposé</span>
          </div>
          <p className="mt-2 text-sm text-gray-500">Ready to serve you.</p>
        </div>

        <div className="text-sm text-gray-600">
          <h3 className="mb-2 font-semibold text-gray-800">Shop</h3>
          <ul className="space-y-1">
            <li>
              <Link href="/about" className="hover:text-brand-teal">
                About &amp; Contact
              </Link>
            </li>
            <li>
              <Link href="/delivery-policy" className="hover:text-brand-teal">
                Delivery &amp; Pickup Policy
              </Link>
            </li>
            <li>
              <Link href="/track-order" className="hover:text-brand-teal">
                Track my order
              </Link>
            </li>
          </ul>
        </div>

        <div className="text-sm text-gray-600">
          <h3 className="mb-2 font-semibold text-gray-800">Contact</h3>
          <ul className="space-y-1">
            {shop?.address && <li>{shop.address}</li>}
            {shop?.phone && <li>{shop.phone}</li>}
            {shop?.hours && <li>{shop.hours}</li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-100 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Disposé. All rights reserved.
      </div>
    </footer>
  );
}
