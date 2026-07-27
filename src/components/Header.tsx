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
    <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-teal text-lg font-bold text-white">
            D
          </span>
          <span className="text-xl font-bold text-brand-pink">Disposé</span>
        </Link>

        <div className="hidden flex-1 md:block">
          <SearchBar />
        </div>

        <nav className="ml-auto flex items-center gap-1">
          <CartBadge />
        </nav>
      </div>

      <div className="border-t border-gray-50">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 text-sm">
          <Link
            href="/"
            className="whitespace-nowrap rounded-full px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
          >
            Home
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="whitespace-nowrap rounded-full px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-50 px-4 py-2 md:hidden">
        <SearchBar />
      </div>
    </header>
  );
}
