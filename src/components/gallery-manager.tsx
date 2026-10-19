"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useToast } from "@/components/toast";
import { apiDelete, apiPost, getErrorMessage } from "@/lib/api-client";
import type {
  GalleryPhoto,
  GalleryPhotoResponse,
} from "@/lib/types";

function formatEventDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function GalleryManager({ initialPhotos }: { initialPhotos: GalleryPhoto[] }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setPending(true);

    try {
      await apiPost<GalleryPhotoResponse>("/gallery", formData);
      form.reset();
      showToast("Foto kegiatan berhasil disimpan di galeri.");
      router.refresh();
    } catch (error) {
      showToast(getErrorMessage(error), "error");
    } finally {
      setPending(false);
    }
  }

  async function handleDelete(photo: GalleryPhoto) {
    if (!window.confirm(`Hapus foto “${photo.title}” dari galeri?`)) return;

    setPending(true);
    try {
      const result = await apiDelete<{ message: string }>(`/gallery/${photo.id}`);
      showToast(result.message);
      router.refresh();
    } catch (error) {
      showToast(getErrorMessage(error), "error");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="gallery-admin-layout">
      <section className="card content-card gallery-upload-card">
        <div className="section-card-heading">
          <div>
            <h2>Tambah dokumentasi</h2>
            <p>Unggah foto kegiatan agar dapat dilihat di halaman Galeri.</p>
          </div>
        </div>
        <form className="gallery-upload-form" onSubmit={handleSubmit}>
          <label className="field" htmlFor="gallery-title">
            <span className="field-label">Judul foto *</span>
            <input
              className="control"
              id="gallery-title"
              name="title"
              minLength={3}
              maxLength={90}
              placeholder="Contoh: Pertemuan FestivalTukarBuku"
              required
            />
          </label>
          <label className="field" htmlFor="gallery-date">
            <span className="field-label">Tanggal kegiatan</span>
            <input className="control" id="gallery-date" name="eventDate" type="date" />
          </label>
          <label className="field" htmlFor="gallery-caption">
            <span className="field-label">Keterangan</span>
            <textarea
              className="control"
              id="gallery-caption"
              name="caption"
              maxLength={320}
              placeholder="Ceritakan momen di dalam foto (opsional)"
              rows={4}
            />
          </label>
          <label className="field" htmlFor="gallery-photo">
            <span className="field-label">Foto kegiatan *</span>
            <input
              className="control gallery-file-input"
              id="gallery-photo"
              name="photo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              required
            />
            <span className="field-hint">JPG, PNG, atau WebP · Maksimal 2 MB</span>
          </label>
          <button className="button button-primary" type="submit" disabled={pending}>
            {pending ? "Menyimpan…" : "Simpan foto ke galeri"}
          </button>
        </form>
      </section>

      <section className="gallery-admin-list">
        <div className="section-card-heading gallery-admin-heading">
          <div>
            <h2>Foto tersimpan</h2>
            <p>{initialPhotos.length} dokumentasi kegiatan</p>
          </div>
        </div>
        {initialPhotos.length === 0 ? (
          <div className="card gallery-admin-empty">
            <span aria-hidden="true">▧</span>
            <strong>Belum ada foto di galeri</strong>
            <p>Foto yang disimpan melalui formulir akan muncul di sini.</p>
          </div>
        ) : (
          <div className="gallery-admin-grid">
            {initialPhotos.map((photo) => (
              <article className="card gallery-admin-card" key={photo.id}>
                <div className="gallery-admin-image">
                  <Image
                    src={photo.imageUrl}
                    alt={photo.title}
                    width={700}
                    height={500}
                    unoptimized
                  />
                </div>
                <div className="gallery-admin-card-body">
                  <time dateTime={photo.eventDate}>{formatEventDate(photo.eventDate)}</time>
                  <h3>{photo.title}</h3>
                  {photo.caption ? <p>{photo.caption}</p> : null}
                  <button
                    className="button button-danger button-small"
                    type="button"
                    onClick={() => void handleDelete(photo)}
                    disabled={pending}
                  >
                    Hapus foto
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
