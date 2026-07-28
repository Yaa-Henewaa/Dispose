import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

// Admin pages always read/write live data and require an authenticated session.
export const dynamic = "force-dynamic";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffafc_0%,#f7f0f8_100%)]">
      <header className="border-b border-[#f0dfe9] bg-[rgba(255,255,255,0.94)] backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/admin" className="flex items-center">
            <span className="text-[18px] font-semibold tracking-[0.02em] text-[#4b2458]">
              Disposé Admin
            </span>
          </Link>
          {session && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#7d5d86]">{session.name}</span>
              <LogoutButton />
            </div>
          )}
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-full border border-transparent px-3 py-1.5 text-sm font-medium text-[#5b3a63] transition hover:border-[#e7c8e6] hover:bg-[#fff7fb]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
