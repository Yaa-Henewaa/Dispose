"use client";

import { useRouter } from "next/navigation";
import { logoutAdmin } from "./login/actions";

export default function LogoutButton() {
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        await logoutAdmin();
        router.push("/admin/login");
        router.refresh();
      }}
      className="rounded-full border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
    >
      Sign out
    </button>
  );
}
