import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/badge";
import { BookCover } from "@/components/book-cover";
import { serverGet } from "@/lib/api-server";
import { bookStatusMeta, conditionLabel } from "@/lib/status";
import type { Book, BookResponse } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const { book } = await serverGet<BookResponse>(`/books/${id}`);
    return { title: book.title };
  } catch {
    return { title: "Buku tidak ditemukan" };
  }
}

async function getBook(id: string): Promise<Book | null> {
  try {
    const { book } = await serverGet<BookResponse>(`/books/${id}`);
    return book;
  } catch {
    return null;
  }
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await getBook(id);

  if (!book) {
    notFound();
  }

  const status = bookStatusMeta[book.status];
  const available = book.status === "tersedia";

  return (
    <main className="member-main">
      <p className="eyebrow">
        <Link href="/katalog">Katalog Buku</Link> &nbsp; / &nbsp; Detail Buku
      </p>
      <div className="book-detail-grid">
        <div className="detail-cover-wrap">
          <BookCover book={book} className="detail-cover" />
        </div>
        <section className="book-detail-info" aria-labelledby="book-title">
          <Badge variant={status.variant}>{status.label}</Badge>
          <h1 id="book-title">{book.title}</h1>
          <p className="book-author">oleh {book.author}</p>
          <div className="detail-badges">
            <Badge variant="blue">{book.genre}</Badge>
            <Badge variant="neutral">
              Kondisi: {conditionLabel[book.condition]}
            </Badge>
          </div>
          <dl className="detail-table">
            <dt>Penulis</dt>
            <dd>{book.author}</dd>
            <dt>Genre</dt>
            <dd>{book.genre}</dd>
            <dt>Kondisi buku</dt>
            <dd>{conditionLabel[book.condition]}</dd>
            <dt>Penerbit</dt>
            <dd>{book.publisher || "—"}</dd>
            <dt>Tahun terbit</dt>
            <dd>{book.year ?? "—"}</dd>
            <dt>Status</dt>
            <dd>
              <Badge variant={status.variant}>{status.label}</Badge>
            </dd>
          </dl>
          <p className="book-description">{book.description}</p>
          <div className="detail-actions">
            {available ? (
              <Link
                className="button button-primary"
                href={`/katalog/${book.id}/tukar`}
              >
                Ajukan Penukaran <span aria-hidden="true">→</span>
              </Link>
            ) : (
              <button className="button button-primary" type="button" disabled>
                Ajukan Penukaran
              </button>
            )}
            <Link className="button button-secondary" href="/katalog">
              Kembali ke katalog
            </Link>
          </div>
          <p className="detail-note">
            {available
              ? "Penukaran dilakukan langsung melalui admin. Tidak ada biaya."
              : "Buku ini sedang tidak tersedia untuk ditukar."}
          </p>
        </section>
      </div>
    </main>
  );
}
