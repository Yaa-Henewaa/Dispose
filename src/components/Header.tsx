import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CartBadge from "./CartBadge";
import SearchBar from "./SearchBar";

export default async function Header() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true, slug: true },
  });

  return (
    <header className="sticky top-0 z-30 border-b border-white/50 bg-[rgba(255,255,255,0.8)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link href="/" className="ml-1 flex shrink-0 items-center">
          <span className="text-[18px] font-semibold tracking-[0.02em] text-[#4b2458]">
            Disposé
          </span>
        </Link>

        <div className="hidden flex-1 md:block">
          <SearchBar />
        </div>

        <nav className="ml-auto flex items-center gap-2">
          <CartBadge />
        </nav>
      </div>

      <div className="border-t border-stone-100">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-1 overflow-x-auto px-4 py-2.5 text-sm">
          <Link
            href="/"
            className="whitespace-nowrap rounded-full border border-transparent px-3 py-1.5 font-medium text-[#5b3a63] transition hover:border-[#e7c8e6] hover:bg-white/70"
          >
            Home
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="whitespace-nowrap rounded-full border border-transparent px-3 py-1.5 font-medium text-[#5b3a63] transition hover:border-[#e7c8e6] hover:bg-white/70"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t border-stone-100 px-4 py-2 md:hidden">
        <SearchBar />
      </div>
    </header>
  );
}
