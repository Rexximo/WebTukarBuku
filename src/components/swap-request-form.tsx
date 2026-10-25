"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Alert } from "@/components/alert";
import {
  SelectField,
  TextAreaField,
  TextField,
  UploadBoxField,
} from "@/components/form";
import { useToast } from "@/components/toast";
import { apiPost, getErrorMessage } from "@/lib/api-client";
import { conditionOptions } from "@/lib/status";
import type { RequestResponse } from "@/lib/types";

export function SwapRequestForm({
  bookId,
  limitReached,
}: {
  bookId: string;
  limitReached: boolean;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setPending(true);

    try {
      await apiPost<RequestResponse>("/swap-requests", formData);
      showToast("Permintaan penukaran berhasil dikirim.");
      router.push("/permintaan");
      router.refresh();
    } catch (error) {
      showToast(getErrorMessage(error), "error");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="bookId" value={bookId} />
      <div className="form-stack">
        <TextField
          id="offered-title"
          name="title"
          label="Judul buku yang Anda bawa"
          placeholder="Contoh: Perempuan di Titik Nol"
          required
        />
        <TextField
          id="offered-author"
          name="author"
          label="Nama penulis"
          placeholder="Nama penulis buku"
          required
        />
        <SelectField
          id="offered-condition"
          name="condition"
          label="Kondisi buku"
          placeholder="Pilih kondisi"
          options={conditionOptions}
          required
        />
        <TextAreaField
          id="notes"
          name="notes"
          label="Catatan"
          optional
          placeholder="Ceritakan kondisi khusus buku atau informasi lain."
        />
        <UploadBoxField
          id="book-photo"
          title="Tambahkan foto buku"
          description="JPG, PNG, atau WebP. Maksimal 2 MB."
        />
        <Alert variant="info">
          Setelah dikirim, buku pilihan Anda akan dipesan selama 3 hari. Bawa
          buku yang ditawarkan dan temui admin untuk menyelesaikan penukaran.
        </Alert>
        {limitReached ? (
          <Alert variant="warning">Batas permintaan aktif tercapai.</Alert>
        ) : null}
        <div className="form-actions">
          <Link className="button button-secondary" href={`/katalog/${bookId}`}>
            Kembali
          </Link>
          <button
            className="button button-primary"
            type="submit"
            disabled={pending || limitReached}
          >
            Kirim Permintaan <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </form>
  );
}
