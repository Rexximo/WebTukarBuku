"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Alert } from "@/components/alert";
import { TextAreaField } from "@/components/form";
import { useToast } from "@/components/toast";
import { apiPost, getErrorMessage } from "@/lib/api-client";
import type { RequestResponse } from "@/lib/types";

export function RequestDecisionForm({ requestId }: { requestId: string }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [reason, setReason] = useState("");
  const [pending, setPending] = useState(false);

  async function decide(decision: "selesai" | "ditolak") {
    if (decision === "ditolak" && !reason.trim()) {
      showToast("Alasan penolakan wajib diisi.", "error");
      return;
    }

    setPending(true);
    try {
      if (decision === "selesai") {
        const response = await apiPost<RequestResponse>(
          `/swap-requests/${requestId}/approve`
        );
        showToast(
          `Permintaan ${response.request.id} selesai${
            response.createdBook
              ? ` dan "${response.createdBook.title}" ditambahkan ke katalog.`
              : "."
          }`
        );
      } else {
        await apiPost<RequestResponse>(
          `/swap-requests/${requestId}/reject`,
          { reason }
        );
        showToast(`Permintaan ${requestId} ditolak.`);
      }
      router.push("/admin/permintaan");
      router.refresh();
    } catch (error) {
      showToast(getErrorMessage(error), "error");
      setPending(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit}>
      <Alert variant="info">
        Setelah disetujui, buku pilihan menjadi <strong>Sudah Ditukar</strong>{" "}
        dan buku anggota ditambahkan ke katalog.
      </Alert>
      <div className="decision-reason">
        <TextAreaField
          id="reject-reason"
          label="Alasan jika ditolak"
          hint="Wajib diisi saat menolak permintaan."
          placeholder="Jelaskan alasan penolakan kepada anggota"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
      </div>
      <div className="decision-actions">
        <button
          className="button button-primary"
          type="button"
          onClick={() => decide("selesai")}
          disabled={pending}
        >
          Setujui &amp; Selesaikan
        </button>
        <button
          className="button button-danger"
          type="button"
          onClick={() => decide("ditolak")}
          disabled={pending}
        >
          Tolak Permintaan
        </button>
      </div>
      <p className="field-hint" style={{ margin: "12px 0 0" }}>
        Pastikan buku telah diperiksa langsung sebelum menyelesaikan permintaan.
      </p>
    </form>
  );
}
