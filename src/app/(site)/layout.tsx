import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

// All storefront pages read live product/order data, so the whole subtree is dynamic.
export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const shop = await prisma.shopSetting.findUnique({ where: { id: "shop" } });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton phone={shop?.whatsapp ?? ""} />
    </div>
  );
}
