"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/toast";
import { apiPatch, getErrorMessage } from "@/lib/api-client";
import type { UserResponse } from "@/lib/types";

export function MemberActiveButton({
  username,
  name,
}: {
  username: string;
  name: string;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [pending, setPending] = useState(false);

  async function handleActivate() {
    setPending(true);
    try {
      await apiPatch<UserResponse>(`/users/${username}`, { isActive: true });
      showToast(`Akun ${name} diaktifkan kembali.`);
      router.refresh();
    } catch (error) {
      showToast(getErrorMessage(error), "error");
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      className="text-button"
      type="button"
      onClick={handleActivate}
      disabled={pending}
    >
      Aktifkan
    </button>
  );
}
