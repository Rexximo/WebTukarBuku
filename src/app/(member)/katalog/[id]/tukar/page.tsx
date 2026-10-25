import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Alert } from "@/components/alert";
import { Badge } from "@/components/badge";
import { BookCover } from "@/components/book-cover";
import { PageHeading } from "@/components/page-heading";
import { SwapRequestForm } from "@/components/swap-request-form";
import { serverGet } from "@/lib/api-server";
import { MAX_ACTIVE_REQUESTS, requireUser } from "@/lib/session";
import { bookStatusMeta } from "@/lib/status";
import type { Book, BookResponse, SwapRequest } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const { book } = await serverGet<BookResponse>(`/books/${id}`);
    return { title: `Ajukan Penukaran ${book.title}` };
  } catch {
    return { title: "Ajukan Penukaran" };
  }
}

export default async function TukarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireUser();

  let book: Book | null = null;
  let activeRequests = 0;

  try {
    const [bookResponse, mineResponse] = await Promise.all([
      serverGet<BookResponse>(`/books/${id}`),
      serverGet<{ items: SwapRequest[] }>(
        "/swap-requests/mine?status=menunggu"
      ),
    ]);
    book = bookResponse.book;
    activeRequests = mineResponse.items.length;
  } catch {
    notFound();
  }

  if (!book || book.status !== "tersedia") {
    notFound();
  }

  const status = bookStatusMeta[book.status];
  const limitReached = activeRequests >= MAX_ACTIVE_REQUESTS;

  return (
    <main className="member-main">
      <PageHeading
        eyebrow="Satu cerita berlanjut ke cerita lain"
        title="Ajukan Penukaran"
        subtitle="Ceritakan buku yang akan Anda bawa untuk ditukar."
      />
      {limitReached ? (
        <Alert variant="warning" className="section-gap-sm">
          Batas permintaan aktif tercapai. Selesaikan atau batalkan salah satu
          permintaan terlebih dahulu.
        </Alert>
      ) : null}
      <div className="request-layout">
        <section className="card card-pad">
          <div className="request-book">
            <BookCover book={book} orb={false} />
            <div>
              <h2>Buku yang ingin Anda tukar</h2>
              <p>
                {book.title} · {book.author}
              </p>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
          </div>
          <SwapRequestForm bookId={book.id} limitReached={limitReached} />
        </section>
        <aside className="card card-pad request-aside">
          <BookCover book={book} />
          <h2>{book.title}</h2>
          <p>
            {book.author} · {book.genre}
          </p>
          <Alert variant="warning">
            Anda dapat memiliki maksimal {MAX_ACTIVE_REQUESTS} permintaan
            penukaran aktif sekaligus.
          </Alert>
        </aside>
      </div>
    </main>
  );
}
