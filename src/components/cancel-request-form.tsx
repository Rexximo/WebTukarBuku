"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useToast } from "@/components/toast";
import { apiPost, getErrorMessage } from "@/lib/api-client";
import type { RequestResponse } from "@/lib/types";

export function CancelRequestForm({
  requestId,
  bookTitle,
}: {
  requestId: string;
  bookTitle: string;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);

    try {
      await apiPost<RequestResponse>(`/swap-requests/${requestId}/cancel`);
      showToast(`Permintaan untuk ${bookTitle} dibatalkan.`);
      router.push("/permintaan");
      router.refresh();
    } catch (error) {
      showToast(getErrorMessage(error), "error");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="requestId" value={requestId} />
      <button className="button button-danger" type="submit" disabled={pending}>
        Ya, Batalkan Permintaan
      </button>
    </form>
  );
}
