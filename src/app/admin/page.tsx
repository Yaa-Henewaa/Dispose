import { prisma } from "@/lib/prisma";
import { formatGHS } from "@/lib/format";

export default async function AdminDashboardPage() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [todayOrders, todayRevenueAgg, lowStockProducts, pendingOrders] =
    await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.order.aggregate({
        where: { createdAt: { gte: startOfToday }, paymentStatus: "PAID" },
        _sum: { total: true },
      }),
      prisma.product.findMany({
        where: { stock: { lte: 5 }, visibility: { not: "HIDDEN" } },
        orderBy: { stock: "asc" },
        take: 10,
      }),
      prisma.order.count({ where: { status: "NEW" } }),
    ]);

  const stats = [
    { label: "Orders today", value: todayOrders },
    {
      label: "Revenue today",
      value: formatGHS(Number(todayRevenueAgg._sum.total ?? 0)),
    },
    { label: "New orders to process", value: pendingOrders },
    { label: "Low stock products", value: lowStockProducts.length },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold text-[#4b2458]">Dashboard</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-[22px] border border-[#f1dfe8] bg-white/90 p-4 shadow-[0_8px_20px_rgba(107,60,123,0.06)]"
          >
            <p className="text-sm text-[#7d5d86]">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold text-[#4b2458]">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-lg font-semibold text-[#4b2458]">
          Low stock alerts
        </h2>
        {lowStockProducts.length === 0 ? (
          <p className="text-sm text-gray-500">
            All products are well stocked.
          </p>
        ) : (
          <div className="overflow-hidden rounded-[22px] border border-[#f1dfe8] bg-white/90 shadow-[0_8px_20px_rgba(107,60,123,0.06)]">
            <table className="w-full text-sm">
              <thead className="bg-[#fff7fb] text-left text-[#7d5d86]">
                <tr>
                  <th className="px-4 py-2 font-medium">Product</th>
                  <th className="px-4 py-2 font-medium">Stock left</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {lowStockProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-4 py-2">{product.name}</td>
                    <td className="px-4 py-2 font-semibold text-red-500">
                      {product.stock}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
