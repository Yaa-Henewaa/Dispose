import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#fffafc_0%,#f7f0f8_100%)] px-4 py-12">
      <div className="w-full max-w-md rounded-[28px] border border-[#f0dfe9] bg-white/90 p-8 text-center shadow-[0_16px_40px_rgba(107,60,123,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#9a5d87]">
          404
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-[#4b2458]">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#7d5d86]">
          The page you’re looking for doesn’t exist, may have moved, or is no
          longer available.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-[#f7d9e8] px-4 py-2 text-sm font-semibold text-[#7a3d62] transition hover:bg-[#f2c9db]"
          >
            Go home
          </Link>
          <Link
            href="/search"
            className="rounded-full border border-[#ecd8e4] px-4 py-2 text-sm font-semibold text-[#7a3d62] transition hover:bg-[#fff7fb]"
          >
            Search products
          </Link>
        </div>
      </div>
    </div>
  );
}
