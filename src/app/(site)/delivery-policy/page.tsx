import { prisma } from "@/lib/prisma";
import { FiMapPin, FiClock, FiTruck, FiPackage } from "react-icons/fi";

export const metadata = { title: "Delivery & Pickup Policy" };

export default async function DeliveryPolicyPage() {
  const [shop] = await Promise.all([
    prisma.shopSetting.findUnique({ where: { id: "shop" } }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-[28px] border border-[#efe0f0] bg-[linear-gradient(180deg,rgba(255,250,253,0.98)_0%,#fff_100%)] p-8 shadow-[0_20px_40px_rgba(107,60,123,0.06)]">
        <h1 className="text-2xl font-bold text-[#3f2b42]">
          Delivery &amp; Pickup Policy
        </h1>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr,0.8fr] lg:items-start">
          <div>
            <p className="text-base leading-7 text-[#5b4a67]">
              We make getting disposables to your customers and events simple.
              Choose delivery during checkout or select pickup if you prefer to
              collect your order from our CMB location.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-3 rounded-lg border border-[#f3e9f5] bg-white p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#f8effb] text-[#8b5f8a]">
                    <FiTruck size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#4b2458]">
                      Delivery in Accra
                    </p>
                    <p className="mt-1 text-sm text-[#6f5278]">
                      We deliver Tuesdays, Thursdays, and Saturdays across Accra
                      at affordable rates. Distance is not a barrier.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 rounded-lg border border-[#f3e9f5] bg-white p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#f8effb] text-[#8b5f8a]">
                    <FiPackage size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#4b2458]">
                      Pickup available
                    </p>
                    <p className="mt-1 text-sm text-[#6f5278]">
                      Order online and pick up conveniently at the CMB shop
                      location — no delivery fee for pickup.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside>
            <div className="rounded-lg border border-[#efe6f2] bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#a779b5]">
                Need help?
              </p>
              <p className="mt-3 text-sm text-[#6f5278]">
                Contact us for custom deliveries, large orders, or wholesale
                pricing.
              </p>

              <div className="mt-4 space-y-3">
                {shop?.address && (
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#faf0fb] text-[#8b5f8a]">
                      <FiMapPin size={16} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#4b2458]">
                        Shop address
                      </p>
                      <p className="text-sm text-[#7a637f]">{shop.address}</p>
                    </div>
                  </div>
                )}

                {shop?.hours && (
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#faf0fb] text-[#8b5f8a]">
                      <FiClock size={16} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#4b2458]">
                        Opening hours
                      </p>
                      <p className="text-sm text-[#7a637f]">{shop.hours}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
