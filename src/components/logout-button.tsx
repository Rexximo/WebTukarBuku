"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiPost, getErrorMessage } from "@/lib/api-client";
import { useToast } from "@/components/toast";

export function LogoutButton({ className = "logout-link" }: { className?: string }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setPending(true);
    try {
      await apiPost("/auth/logout");
      showToast("Anda telah keluar.");
      router.replace("/masuk");
      router.refresh();
    } catch (error) {
      showToast(getErrorMessage(error), "error");
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      className={className}
      onClick={handleLogout}
      disabled={pending}
    >
      Keluar
    </button>
  );
}
