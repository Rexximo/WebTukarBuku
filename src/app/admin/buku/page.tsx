import type { Metadata } from "next";
import Link from "next/link";
import { AdminTopbar } from "@/components/admin-topbar";
import { Alert } from "@/components/alert";
import { Badge } from "@/components/badge";
import { coverToneFor, tableCoverStyle } from "@/components/book-cover";
import { DeleteBookButton } from "@/components/delete-book-button";
import { SelectField, TextField } from "@/components/form";
import { PageHeading } from "@/components/page-heading";
import { Pagination } from "@/components/pagination";
import { serverGet } from "@/lib/api-server";
import { formatDate } from "@/lib/format";
import { buildQuery } from "@/lib/query";
import { first, firstNumber, type SearchParamsPromise } from "@/lib/search-params";
import { bookStatusMeta, conditionLabel } from "@/lib/status";
import type { Book, BookResponse, Paginated } from "@/lib/types";

export const metadata: Metadata = {
  title: "Kelola Buku",
};

const statusOptions = [
  { value: "tersedia", label: "Tersedia" },
  { value: "dipesan", label: "Dipesan" },
  { value: "sudah_ditukar", label: "Sudah Ditukar" },
];

export default async function AdminBukuPage({
  searchParams,
}: {
  searchParams: SearchParamsPromise;
}) {
  const params = await searchParams;
  const q = first(params.q);
  const status = first(params.status);
  const page = firstNumber(params.page);
  const hapusId = first(params.hapus);

  let data: Paginated<Book> = {
    items: [],
    page,
    limit: 20,
    total: 0,
    totalPages: 1,
  };
  let failed = false;

  try {
    data = await serverGet<Paginated<Book>>(
      `/books${buildQuery({ q, status, page, limit: 20 })}`
    );
  } catch {
    failed = true;
  }

  let hapusBook: Book | null = null;
  if (hapusId) {
    try {
      hapusBook = (await serverGet<BookResponse>(`/books/${hapusId}`)).book;
    } catch {
      hapusBook = null;
    }
  }

  const makeHref = (nextPage: number) =>
    `/admin/buku${buildQuery({ q, status, page: nextPage })}`;

  return (
    <>
      <AdminTopbar
        crumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Kelola Buku" },
        ]}
      />
      <main className="admin-main">
        <PageHeading
          eyebrow="Koleksi komunitas"
          title="Kelola Buku"
          subtitle="Tambah dan perbarui buku yang tersedia untuk ditukar."
          actions={
            <Link className="button button-primary" href="/admin/buku/baru">
              + Tambah Buku
            </Link>
          }
        />
        {failed ? (
          <Alert variant="danger" className="section-gap-sm">
            Gagal memuat data buku. Pastikan server API berjalan, lalu muat
            ulang halaman ini.
          </Alert>
        ) : null}
        <section className="card content-card">
          <div className="table-toolbar">
            <form className="filter-row" action="/admin/buku" method="get">
              <TextField
                id="book-search"
                name="q"
                label="Cari buku"
                placeholder="Judul atau penulis"
                defaultValue={q}
              />
              <SelectField
                id="book-status"
                name="status"
                label="Status"
                placeholder="Semua Status"
                options={statusOptions}
                defaultValue={status}
              />
              <button className="button button-secondary" type="submit">
                Cari
              </button>
            </form>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Buku</th>
                  <th>Genre</th>
                  <th>Kondisi</th>
                  <th>Status</th>
                  <th>Ditambahkan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((book) => {
                  const statusMeta = bookStatusMeta[book.status];
                  return (
                    <tr key={book.id}>
                      <td data-label="Buku">
                        <span className="table-book">
                          <span
                            className={`table-book-cover cover-${coverToneFor(book.id)}`}
                            style={tableCoverStyle(book)}
                          ></span>
                          <span>
                            <strong>{book.title}</strong>
                            <small>{book.author}</small>
                          </span>
                        </span>
                      </td>
                      <td data-label="Genre">{book.genre}</td>
                      <td data-label="Kondisi">
                        {conditionLabel[book.condition]}
                      </td>
                      <td data-label="Status">
                        <Badge variant={statusMeta.variant}>
                          {statusMeta.label}
                        </Badge>
                      </td>
                      <td data-label="Ditambahkan">
                        {formatDate(book.createdAt)}
                      </td>
                      <td data-label="Aksi">
                        <span className="table-actions">
                          <Link
                            className="button button-secondary button-small"
                            href={`/admin/buku/${book.id}/ubah`}
                          >
                            Ubah
                          </Link>
                          {book.status === "tersedia" ? (
                            <Link
                              className="button button-danger button-small"
                              href={`/admin/buku${buildQuery({
                                q,
                                status,
                                hapus: book.id,
                              })}#hapus-buku`}
                            >
                              Hapus
                            </Link>
                          ) : (
                            <span className="condition">
                              {book.status === "dipesan"
                                ? "Tidak dapat dihapus"
                                : "Arsip"}
                            </span>
                          )}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
        </section>
        {hapusBook ? (
          <section className="card empty-state confirm-panel" id="hapus-buku">
            <span className="empty-icon" aria-hidden="true">
              !
            </span>
            <h2>Konfirmasi penghapusan buku</h2>
            <p>
              Buku <strong>{hapusBook.title}</strong> akan dihapus. Buku yang
              memiliki riwayat penukaran tidak dihapus permanen, melainkan
              diarsipkan dari katalog.
            </p>
            <div className="page-heading-actions">
              <Link className="button button-secondary" href="/admin/buku">
                Batal
              </Link>
              <DeleteBookButton bookId={hapusBook.id} />
            </div>
          </section>
        ) : null}
      </main>
    </>
  );
}
