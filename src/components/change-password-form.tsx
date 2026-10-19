"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { TextField } from "@/components/form";
import { useToast } from "@/components/toast";
import { apiPost, getErrorMessage } from "@/lib/api-client";
import type { AuthResponse } from "@/lib/types";

export function ChangePasswordForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newPassword = String(data.get("newPassword") ?? "");
    const confirmPassword = String(data.get("confirmPassword") ?? "");

    if (newPassword !== confirmPassword) {
      showToast("Kata sandi baru dan ulangannya tidak sama.", "error");
      return;
    }

    setPending(true);
    try {
      await apiPost<AuthResponse>("/auth/change-password", {
        currentPassword: String(data.get("currentPassword") ?? ""),
        newPassword,
      });
      showToast("Kata sandi berhasil diperbarui.");
      router.replace("/katalog");
      router.refresh();
    } catch (error) {
      showToast(getErrorMessage(error), "error");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-stack">
        <TextField
          id="current-password"
          name="currentPassword"
          type="password"
          label="Kata Sandi Saat Ini"
          autoComplete="current-password"
          required
        />
        <TextField
          id="new-password"
          name="newPassword"
          type="password"
          label="Kata Sandi Baru"
          autoComplete="new-password"
          minLength={8}
          hint="Minimal 8 karakter."
          required
        />
        <TextField
          id="confirm-password"
          name="confirmPassword"
          type="password"
          label="Ulangi Kata Sandi Baru"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>
      <div className="form-actions">
        <Link className="button button-secondary" href="/profil">
          Batal
        </Link>
        <button className="button button-primary" type="submit" disabled={pending}>
          Simpan Kata Sandi
        </button>
      </div>
    </form>
  );
}
