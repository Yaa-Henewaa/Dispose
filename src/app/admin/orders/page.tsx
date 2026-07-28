import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatGHS } from "@/lib/format";
import type { Prisma, OrderStatus } from "@prisma/client";

const STATUS_OPTIONS: OrderStatus[] = [
  "NEW",
  "PROCESSING",
  "OUT_FOR_DELIVERY",
  "READY_FOR_PICKUP",
  "COMPLETED",
  "CANCELLED",
];

interface AdminOrdersPageProps {
  searchParams: Promise<{ status?: string; q?: string }>;
}

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const { status, q } = await searchParams;

  const where: Prisma.OrderWhereInput = {};
  if (status) where.status = status as OrderStatus;
  if (q) {
    where.OR = [
      { orderNumber: { contains: q, mode: "insensitive" } },
      { customerName: { contains: q, mode: "insensitive" } },
      { customerPhone: { contains: q, mode: "insensitive" } },
    ];
  }

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800">Orders</h1>

      <form className="mt-4 flex flex-wrap gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by order #, name, or phone"
          className="flex-1 min-w-50 rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-[#f7d9e8] px-4 py-2 text-sm font-semibold text-[#7a3d62] transition hover:bg-[#f2c9db]"
        >
          Filter
        </button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-100 bg-white">
        <table className="w-full min-w-180 text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-2 font-medium">Order #</th>
              <th className="px-4 py-2 font-medium">Customer</th>
              <th className="px-4 py-2 font-medium">Fulfillment</th>
              <th className="px-4 py-2 font-medium">Total</th>
              <th className="px-4 py-2 font-medium">Payment</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="font-mono font-medium text-[#7a3d62] hover:underline"
                  >
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-4 py-2 text-gray-700">
                  {order.customerName}
                  <div className="text-xs text-gray-400">
                    {order.customerPhone}
                  </div>
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {order.fulfillmentType === "DELIVERY" ? "Delivery" : "Pickup"}
                </td>
                <td className="px-4 py-2 font-medium text-gray-800">
                  {formatGHS(Number(order.total))}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={
                      order.paymentStatus === "PAID"
                        ? "font-medium text-[#7a3d62]"
                        : order.paymentStatus === "FAILED"
                          ? "font-medium text-red-500"
                          : "font-medium text-yellow-600"
                    }
                  >
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {order.status.replace(/_/g, " ")}
                </td>
                <td className="px-4 py-2 text-gray-500">
                  {order.createdAt.toLocaleDateString("en-GH")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="p-4 text-center text-sm text-gray-500">
            No orders found.
          </p>
        )}
      </div>
    </div>
  );
}
