"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/toast";
import { apiPost, getErrorMessage } from "@/lib/api-client";
import type { TemporaryPasswordResponse } from "@/lib/types";

export function ResetPasswordPanel({
  username,
  name,
}: {
  username: string;
  name: string;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [temporaryPassword, setTemporaryPassword] = useState<string | null>(
    null
  );
  const [pending, setPending] = useState(false);

  async function handleReset() {
    setPending(true);
    try {
      const result = await apiPost<TemporaryPasswordResponse>(
        `/users/${username}/reset-password`
      );
      setTemporaryPassword(result.temporaryPassword);
      showToast(`Kata sandi sementara untuk ${name} berhasil dibuat.`);
      router.refresh();
    } catch (error) {
      showToast(getErrorMessage(error), "error");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="card empty-state confirm-panel" id="atur-ulang">
      <span className="empty-icon" aria-hidden="true">
        ⌁
      </span>
      <h2>Atur ulang kata sandi</h2>
      <p>
        Kata sandi sementara baru akan dibuat untuk <strong>{name}</strong>.
        Sampaikan secara langsung dan minta anggota menggantinya setelah masuk.
      </p>
      {temporaryPassword ? (
        <div className="alert alert-success">
          <span aria-hidden="true">✓</span>
          <span>
            Kata sandi sementara: <strong>{temporaryPassword}</strong>
          </span>
        </div>
      ) : null}
      <div className="page-heading-actions">
        <Link className="button button-secondary" href="/admin/anggota">
          Batal
        </Link>
        <button
          className="button button-primary"
          type="button"
          onClick={handleReset}
          disabled={pending}
        >
          Buat Kata Sandi Sementara
        </button>
      </div>
    </section>
  );
}
