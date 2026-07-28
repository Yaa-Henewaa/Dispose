"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatGHS } from "@/lib/format";
import {
  addDeliverySetting,
  deleteDeliverySetting,
  updateDeliverySetting,
} from "./actions";

interface DeliverySettingItem {
  id: string;
  area: string;
  fee: number;
  isDefault: boolean;
}

export default function DeliverySettingsManager({
  deliverySettings,
}: {
  deliverySettings: DeliverySettingItem[];
}) {
  const router = useRouter();
  const [area, setArea] = useState("");
  const [fee, setFee] = useState("");
  const [isDefault, setIsDefault] = useState(deliverySettings.length === 0);
  const [busy, setBusy] = useState(false);

  async function handleAdd(event: React.FormEvent) {
    event.preventDefault();
    if (!area.trim() || !fee) return;
    setBusy(true);
    await addDeliverySetting(area, parseFloat(fee), isDefault);
    setArea("");
    setFee("");
    setIsDefault(false);
    router.refresh();
    setBusy(false);
  }

  return (
    <section>
      <h2 className="text-lg font-bold text-gray-800">Delivery fees</h2>
      <p className="text-sm text-gray-500">
        Set a fee per delivery area. Mark one as default for areas customers
        don&apos;t select explicitly.
      </p>

      <div className="mt-4 overflow-hidden rounded-2xl border border-gray-100 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-2 font-medium">Area</th>
              <th className="px-4 py-2 font-medium">Fee</th>
              <th className="px-4 py-2 font-medium">Default</th>
              <th className="px-4 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {deliverySettings.map((setting) => (
              <tr key={setting.id}>
                <td className="px-4 py-2">{setting.area}</td>
                <td className="px-4 py-2">{formatGHS(setting.fee)}</td>
                <td className="px-4 py-2">{setting.isDefault ? "✓" : ""}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-3">
                    <button
                      disabled={busy}
                      onClick={async () => {
                        setBusy(true);
                        await updateDeliverySetting(
                          setting.id,
                          setting.area,
                          setting.fee,
                          true,
                        );
                        router.refresh();
                        setBusy(false);
                      }}
                      className="text-[#7a3d62] hover:underline disabled:opacity-50"
                    >
                      Set default
                    </button>
                    <button
                      disabled={busy}
                      onClick={async () => {
                        if (!confirm("Delete this delivery area?")) return;
                        setBusy(true);
                        await deleteDeliverySetting(setting.id);
                        router.refresh();
                        setBusy(false);
                      }}
                      className="text-red-500 hover:underline disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {deliverySettings.length === 0 && (
          <p className="p-4 text-center text-sm text-gray-500">
            No delivery areas yet.
          </p>
        )}
      </div>

      <form
        onSubmit={handleAdd}
        className="mt-4 flex flex-wrap items-end gap-3"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Area name
          </label>
          <input
            value={area}
            onChange={(event) => setArea(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder="e.g. East Legon"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Fee (GHS)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={fee}
            onChange={(event) => setFee(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <label className="flex items-center gap-2 pb-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={isDefault}
            onChange={(event) => setIsDefault(event.target.checked)}
          />
          Default area
        </label>
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-[#f7d9e8] px-5 py-2 text-sm font-semibold text-[#7a3d62] transition hover:bg-[#f2c9db] disabled:opacity-50"
        >
          Add area
        </button>
      </form>
    </section>
  );
}
