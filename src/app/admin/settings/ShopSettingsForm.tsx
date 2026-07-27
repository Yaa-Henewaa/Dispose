"use client";

import { useState } from "react";
import { updateShopSettings, type ShopSettingInput } from "./actions";

export default function ShopSettingsForm({ shop }: { shop: ShopSettingInput }) {
  const [values, setValues] = useState(shop);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof ShopSettingInput>(key: K, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    await updateShopSettings(values);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <section>
      <h2 className="text-lg font-bold text-gray-800">Shop details</h2>
      <p className="text-sm text-gray-500">
        Shown on the About page, delivery policy, and used for the WhatsApp
        button.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 max-w-xl space-y-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Shop name
          </label>
          <input
            value={values.shopName}
            onChange={(event) => set("shopName", event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Pickup / shop address
          </label>
          <input
            value={values.address}
            onChange={(event) => set("address", event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Opening hours
          </label>
          <input
            value={values.hours}
            onChange={(event) => set("hours", event.target.value)}
            placeholder="e.g. Mon–Sat, 9am–7pm"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Phone number
          </label>
          <input
            value={values.phone}
            onChange={(event) => set("phone", event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            WhatsApp number (with country code)
          </label>
          <input
            value={values.whatsapp}
            onChange={(event) => set("whatsapp", event.target.value)}
            placeholder="e.g. 233244000000"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Pickup notes
          </label>
          <textarea
            value={values.pickupNotes}
            onChange={(event) => set("pickupNotes", event.target.value)}
            rows={2}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-brand-teal px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-teal-dark disabled:opacity-50"
        >
          {saving ? "Saving..." : saved ? "Saved ✓" : "Save shop details"}
        </button>
      </form>
    </section>
  );
}
