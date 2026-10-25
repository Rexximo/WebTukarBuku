"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { TextField } from "@/components/form";
import { useToast } from "@/components/toast";
import { apiPost, getErrorMessage } from "@/lib/api-client";
import type { AuthResponse } from "@/lib/types";

export function LoginForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPending(true);

    try {
      const response = await apiPost<AuthResponse>("/auth/login", {
        username: String(data.get("username") ?? ""),
        password: String(data.get("password") ?? ""),
      });

      if (response.user.mustChangePassword) {
        showToast("Silakan ganti kata sandi sementara Anda terlebih dahulu.");
        router.replace("/profil/kata-sandi");
      } else {
        router.replace(response.user.role === "admin" ? "/admin" : "/katalog");
      }
      router.refresh();
    } catch (error) {
      showToast(getErrorMessage(error), "error");
      setPending(false);
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <TextField
        id="username"
        name="username"
        label="Nama Pengguna"
        autoComplete="username"
        placeholder="Masukkan nama pengguna"
        required
      />
      <TextField
        id="password"
        name="password"
        type="password"
        label="Kata Sandi"
        autoComplete="current-password"
        placeholder="Masukkan kata sandi"
        required
      />
      <button className="button button-primary" type="submit" disabled={pending}>
        Masuk <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
