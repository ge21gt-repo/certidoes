"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function sair() {
    await fetch("/api/portal/logout", { method: "POST" });
    router.push("/portal/login");
    router.refresh();
  }

  return (
    <button
      onClick={sair}
      className="rounded-md bg-brand-800 px-4 py-1 text-sm font-semibold text-white hover:bg-brand-900"
    >
      Sair
    </button>
  );
}
