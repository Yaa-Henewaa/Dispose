"use client";

import { useState } from "react";
import Link from "next/link";
import CartBadge from "./CartBadge";
import SearchBar from "./SearchBar";

type CategoryNavItem = {
  id: string;
  name: string;
  slug: string;
};

export default function HeaderNav({
  categories,
}: {
  categories: CategoryNavItem[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 md:hidden ${open ? "block" : "pointer-events-none"}`}
      >
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          onClick={() => setOpen(false)}
        />
        <aside
          className={`fixed left-0 top-0 z-50 h-full w-[min(85vw,320px)] bg-white px-4 py-6 shadow-2xl transition-transform ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="text-lg font-semibold text-[#4b2458]"
            >
              Disposé
            </Link>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-700 transition hover:bg-stone-100"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="mb-4">
            <SearchBar />
          </div>

          <nav className="space-y-2 text-sm">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="block rounded-full border border-transparent px-3 py-3 font-medium text-[#5b3a63] transition hover:border-[#e7c8e6] hover:bg-stone-50"
            >
              Home
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                onClick={() => setOpen(false)}
                className="block rounded-full border border-transparent px-3 py-3 font-medium text-[#5b3a63] transition hover:border-[#e7c8e6] hover:bg-stone-50"
              >
                {category.name}
              </Link>
            ))}
            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className="block rounded-full border border-transparent px-3 py-3 font-medium text-[#5b3a63] transition hover:border-[#e7c8e6] hover:bg-stone-50"
            >
              About & Contact
            </Link>
          </nav>
        </aside>
      </div>

      <header className="sticky top-0 z-30 border-b border-white/50 bg-[rgba(255,255,255,0.8)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-700 transition hover:bg-stone-100 md:hidden"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            ☰
          </button>

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
          <div className="mx-auto relative flex w-full max-w-6xl items-center justify-center overflow-x-auto px-4 py-2.5 text-sm">
            <div className="hidden items-center gap-1 overflow-x-auto pr-24 md:flex">
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

            <div className="hidden absolute right-4 items-center gap-2 md:flex">
              <Link
                href="/about"
                className="whitespace-nowrap rounded-full border border-transparent px-3 py-1.5 font-medium text-[#5b3a63] transition hover:border-[#e7c8e6] hover:bg-white/70"
              >
                About & Contact
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
