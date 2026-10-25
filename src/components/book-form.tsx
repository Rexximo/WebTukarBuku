"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Alert } from "@/components/alert";
import { BookCover } from "@/components/book-cover";
import { SelectField, TextAreaField, TextField } from "@/components/form";
import { useToast } from "@/components/toast";
import { apiPatch, apiPost, getErrorMessage } from "@/lib/api-client";
import { conditionOptions } from "@/lib/status";
import type { Book, BookResponse } from "@/lib/types";

const genreOptions = [
  "Fiksi",
  "Puisi",
  "Sejarah",
  "Pengembangan diri",
  "Esai",
  "Perjalanan",
  "Lainnya",
].map((genre) => ({ value: genre, label: genre }));

export function BookForm({ book }: { book?: Book }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setPending(true);

    try {
      if (book) {
        await apiPatch<BookResponse>(`/books/${book.id}`, formData);
        showToast("Perubahan buku berhasil disimpan.");
      } else {
        await apiPost<BookResponse>("/books", formData);
        showToast("Buku berhasil ditambahkan.");
      }
      router.push("/admin/buku");
      router.refresh();
    } catch (error) {
      showToast(getErrorMessage(error), "error");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <div className="detail-columns">
        <section className="card content-card">
          <div className="section-card-heading">
            <div>
              <h2>Informasi Buku</h2>
              <p>Kolom bertanda * wajib diisi.</p>
            </div>
          </div>
          <div className="form-grid">
            <TextField
              id="title"
              name="title"
              label="Judul Buku *"
              span
              required
              placeholder="Masukkan judul buku"
              defaultValue={book?.title}
            />
            <TextField
              id="author"
              name="author"
              label="Penulis *"
              required
              placeholder="Nama penulis"
              defaultValue={book?.author}
            />
            <SelectField
              id="genre"
              name="genre"
              label="Genre *"
              required
              placeholder="Pilih genre"
              options={genreOptions}
              defaultValue={book?.genre ?? ""}
            />
            <SelectField
              id="condition"
              name="condition"
              label="Kondisi Buku *"
              required
              placeholder="Pilih kondisi"
              options={conditionOptions}
              defaultValue={book?.condition ?? ""}
            />
            <TextField
              id="publisher"
              name="publisher"
              label="Penerbit"
              optional
              placeholder="Nama penerbit"
              defaultValue={book?.publisher}
            />
            <TextField
              id="year"
              name="year"
              label="Tahun Terbit"
              optional
              type="number"
              min={1000}
              max={2100}
              placeholder="Contoh: 2022"
              defaultValue={book?.year ?? undefined}
            />
            <TextAreaField
              id="description"
              name="description"
              label="Deskripsi *"
              span
              required
              placeholder="Tuliskan ringkasan atau informasi tentang buku"
              defaultValue={book?.description}
            />
          </div>
          <div className="form-actions">
            <Link className="button button-secondary" href="/admin/buku">
              Batal
            </Link>
            <button className="button button-primary" type="submit" disabled={pending}>
              {book ? "Simpan Perubahan" : "Simpan Buku"}
            </button>
          </div>
        </section>
        <aside className="card content-card">
          <div className="section-card-heading">
            <div>
              <h2>{book ? "Sampul Buku" : "Sampul Buku *"}</h2>
              <p>
                {book
                  ? "Unggah sampul baru untuk mengganti."
                  : "Rasio sampul 2:3 agar tampil optimal."}
              </p>
            </div>
          </div>
          {book ? (
            <BookCover
              book={book}
              style={{ width: 145, margin: "0 auto 15px" }}
            />
          ) : null}
          {book ? (
            <label className="field" htmlFor="cover">
              <span className="field-label">Pilih sampul baru</span>
              <input
                className="control"
                id="cover"
                name="cover"
                type="file"
                accept="image/png,image/jpeg,image/webp"
              />
              <span className="field-hint">
                JPG, PNG, atau WebP · Maksimal 2 MB
              </span>
            </label>
          ) : (
            <label className="upload-cover-large" htmlFor="cover">
              <strong>Unggah foto sampul</strong>
              <span>JPG, PNG, atau WebP · Maksimal 2 MB</span>
              <input
                id="cover"
                name="cover"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                required
              />
            </label>
          )}
          {book ? (
            <Alert variant="warning" className="alert-cover-note">
              Buku yang sedang memiliki permintaan tidak dapat dihapus.
            </Alert>
          ) : (
            <Alert variant="info" className="alert-cover-note">
              Buku baru akan otomatis berstatus <strong>Tersedia</strong>{" "}
              setelah disimpan.
            </Alert>
          )}
        </aside>
      </div>
    </form>
  );
}
