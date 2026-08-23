"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCategory, deleteCategory } from "./actions";

interface CategoryWithChildren {
  id: string;
  name: string;
  children: { id: string; name: string }[];
}

export default function CategoryManager({
  categories,
}: {
  categories: CategoryWithChildren[];
}) {
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [newParentId, setNewParentId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleAdd(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const result = await createCategory(newName, newParentId || null);
    if (!result.ok) {
      setError(result.error ?? "Could not add category.");
    } else {
      setNewName("");
    }
    router.refresh();
    setBusy(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category?")) return;
    setDeletingId(id);
    const result = await deleteCategory(id);
    if (!result.ok) {
      alert(result.error);
    }
    router.refresh();
    setDeletingId(null);
  }

  return (
    <div className="mt-6 grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-gray-100 bg-white p-4">
        <h2 className="font-semibold text-gray-800">Existing categories</h2>
        <ul className="mt-3 space-y-2">
          {categories.map((category) => (
            <li key={category.id}>
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">
                  {category.name}
                </span>
                <button
                  disabled={deletingId === category.id}
                  onClick={() => handleDelete(category.id)}
                  className="text-sm text-red-500 hover:underline disabled:opacity-50"
                >
                  {deletingId === category.id ? "Deleting..." : "Delete"}
                </button>
              </div>
              {category.children.length > 0 && (
                <ul className="ml-4 mt-1 space-y-1 border-l border-gray-100 pl-3">
                  {category.children.map((child) => (
                    <li
                      key={child.id}
                      className="flex items-center justify-between text-sm text-gray-600"
                    >
                      <span>{child.name}</span>
                      <button
                        disabled={deletingId === child.id}
                        onClick={() => handleDelete(child.id)}
                        className="text-red-500 hover:underline disabled:opacity-50"
                      >
                        {deletingId === child.id ? "Deleting..." : "Delete"}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
          {categories.length === 0 && (
            <p className="text-sm text-gray-500">No categories yet.</p>
          )}
        </ul>
      </div>

      <div className="h-fit rounded-2xl border border-gray-100 bg-white p-4">
        <h2 className="font-semibold text-gray-800">Add category</h2>
        <form onSubmit={handleAdd} className="mt-3 space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              required
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Parent category (optional, for subcategories)
            </label>
            <select
              value={newParentId}
              onChange={(event) => setNewParentId(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">None (top-level category)</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-[#f7d9e8] px-5 py-2 text-sm font-semibold text-[#7a3d62] transition hover:bg-[#f2c9db] disabled:opacity-50"
          >
            {busy ? "Adding..." : "Add category"}
          </button>
        </form>
      </div>
    </div>
  );
}
