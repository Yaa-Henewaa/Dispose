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
      className="rounded-full border border-[#ecd8e4] bg-[#f7d9e8] px-3 py-1.5 text-sm font-medium text-[#7a3d62] transition hover:bg-[#f2c9db]"
    >
      Sign out
    </button>
  );
}
