"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { CheckboxField, TextAreaField, TextField } from "@/components/form";
import { useToast } from "@/components/toast";
import { apiPatch, apiPost, getErrorMessage } from "@/lib/api-client";
import type { User, UserResponse } from "@/lib/types";

export function MemberForm({ member }: { member?: User }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPending(true);

    const payload: Record<string, string | boolean> = {
      name: String(data.get("name") ?? ""),
      username: String(data.get("username") ?? ""),
      phone: String(data.get("phone") ?? ""),
      address: String(data.get("address") ?? ""),
    };

    try {
      if (member) {
        payload.isActive = data.get("isActive") === "on";
        await apiPatch<UserResponse>(`/users/${member.id}`, payload);
        showToast("Perubahan data anggota berhasil disimpan.");
      } else {
        payload.password = String(data.get("password") ?? "");
        await apiPost<UserResponse>("/users", payload);
        showToast("Akun anggota berhasil dibuat.");
      }
      router.push("/admin/anggota");
      router.refresh();
    } catch (error) {
      showToast(getErrorMessage(error), "error");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <TextField
          id="name"
          name="name"
          label="Nama Lengkap *"
          span
          required
          autoComplete="name"
          placeholder="Nama sesuai identitas"
          defaultValue={member?.name}
        />
        <TextField
          id="username"
          name="username"
          label="Nama Pengguna *"
          required
          autoComplete="username"
          placeholder="Contoh: siti.rahma"
          hint="Harus unik dan digunakan untuk masuk."
          defaultValue={member?.username}
        />
        <TextField
          id="phone"
          name="phone"
          type="tel"
          label="Nomor Telepon *"
          required
          autoComplete="tel"
          placeholder="08xx xxxx xxxx"
          defaultValue={member?.phone}
        />
        <TextAreaField
          id="address"
          name="address"
          label="Alamat"
          optional
          span
          autoComplete="street-address"
          placeholder="Alamat tempat tinggal anggota"
          defaultValue={member?.address}
        />
        {member ? (
          <CheckboxField
            id="is-active"
            name="isActive"
            span
            defaultChecked={member.isActive}
            label="Akun anggota aktif dan dapat masuk ke situs"
            hint="Menonaktifkan akun akan membatalkan permintaan yang masih menunggu."
          />
        ) : (
          <>
            <TextField
              id="password"
              name="password"
              type="password"
              label="Kata Sandi Sementara *"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="Minimal 8 karakter"
            />
            <TextField
              id="password-confirm"
              name="passwordConfirm"
              type="password"
              label="Ulangi Kata Sandi *"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="Masukkan kembali kata sandi"
            />
          </>
        )}
      </div>
      <div className="form-actions">
        <Link className="button button-secondary" href="/admin/anggota">
          Batal
        </Link>
        <button className="button button-primary" type="submit" disabled={pending}>
          {member ? "Simpan Perubahan" : "Buat Akun Anggota"}
        </button>
      </div>
    </form>
  );
}
