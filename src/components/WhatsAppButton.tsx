import Link from "next/link";

export default function WhatsAppButton({ phone }: { phone: string }) {
  const digits = phone.replace(/[^0-9]/g, "");
  if (!digits) return null;

  return (
    <Link
      href={`https://wa.me/${digits}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-105"
    >
      <span aria-hidden className="text-lg">
        💬
      </span>
      <span className="hidden sm:inline">Chat on WhatsApp</span>
    </Link>
  );
}
