import type { Metadata } from "next";
import { Alert } from "@/components/alert";
import { BookCard } from "@/components/book-card";
import { CatalogToolbar } from "@/components/catalog-toolbar";
import { EmptyState } from "@/components/empty-state";
import { PageHeading } from "@/components/page-heading";
import { Pagination } from "@/components/pagination";
import { serverGet } from "@/lib/api-server";
import { buildQuery } from "@/lib/query";
import { first, firstNumber, type SearchParamsPromise } from "@/lib/search-params";
import type { Book, Paginated } from "@/lib/types";

export const metadata: Metadata = {
  title: "Katalog Buku",
};

export default async function KatalogPage({
  searchParams,
}: {
  searchParams: SearchParamsPromise;
}) {
  const params = await searchParams;
  const q = first(params.q);
  const genre = first(params.genre);
  const condition = first(params.condition);
  const status = first(params.status);
  const page = firstNumber(params.page);
  const accessError = first(params.error) === "akses";

  let data: Paginated<Book> = {
    items: [],
    page,
    limit: 12,
    total: 0,
    totalPages: 1,
  };
  let genres: string[] = [];
  let failed = false;

  try {
    const [booksResponse, genresResponse] = await Promise.all([
      serverGet<Paginated<Book>>(
        `/books${buildQuery({ q, genre, condition, status, page })}`
      ),
      serverGet<{ genres: string[] }>("/books/genres"),
    ]);
    data = booksResponse;
    genres = genresResponse.genres;
  } catch {
    failed = true;
  }

  const makeHref = (nextPage: number) =>
    `/katalog${buildQuery({ q, genre, condition, status, page: nextPage })}`;

  return (
    <main className="member-main">
      {accessError ? (
        <Alert variant="warning" className="section-gap-sm">
          Anda tidak memiliki akses ke halaman ini.
        </Alert>
      ) : null}
      <PageHeading
        eyebrow="Bacaan untuk dibawa pulang"
        title="Katalog Buku"
        subtitle="Temukan cerita baru untuk menemani waktu luang Anda."
        actions={
          <span className="badge badge-blue">{data.total} buku di katalog</span>
        }
      />
      <CatalogToolbar
        genres={genres}
        initial={{ q, genre, condition, status }}
      />
      {failed ? (
        <Alert variant="danger" className="section-gap-sm">
          Gagal memuat katalog. Pastikan server API berjalan, lalu muat ulang
          halaman ini.
        </Alert>
      ) : null}
      {!failed && data.items.length === 0 ? (
        <EmptyState
          title="Belum ada buku yang cocok"
          description="Coba ubah kata kunci atau filter untuk menemukan buku lain di katalog."
        />
      ) : null}
      {data.items.length > 0 ? (
        <div className="book-grid" aria-label="Daftar buku">
          {data.items.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : null}
      {data.total > 0 ? (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          total={data.total}
          label="buku"
          firstItem={(data.page - 1) * data.limit + 1}
          lastItem={(data.page - 1) * data.limit + data.items.length}
          makeHref={makeHref}
        />
      ) : null}
    </main>
  );
}
