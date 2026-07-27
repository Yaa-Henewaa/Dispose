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
      <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-gray-100 bg-white p-4"
          >
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-800">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-lg font-bold text-gray-800">
          Low stock alerts
        </h2>
        {lowStockProducts.length === 0 ? (
          <p className="text-sm text-gray-500">
            All products are well stocked.
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500">
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
