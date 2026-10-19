import type { Metadata } from "next";
import Link from "next/link";
import { Alert } from "@/components/alert";
import { Badge } from "@/components/badge";
import { BookCover } from "@/components/book-cover";
import { PageHeading } from "@/components/page-heading";
import { serverGet } from "@/lib/api-server";
import { formatDate } from "@/lib/format";
import { MAX_ACTIVE_REQUESTS } from "@/lib/session";
import { requestStatusMeta } from "@/lib/status";
import type { SwapRequest } from "@/lib/types";

export const metadata: Metadata = {
  title: "Permintaan Saya",
};

function statusNote(request: SwapRequest): string {
  switch (request.status) {
    case "menunggu":
      return request.expiresAt
        ? `Berlaku hingga ${formatDate(request.expiresAt)}`
        : "Menunggu diproses admin";
    case "selesai":
      return "Penukaran telah dicatat admin";
    case "ditolak":
      return request.rejectReason ?? "Permintaan ditolak admin";
    case "dibatalkan":
      return "Permintaan dibatalkan";
    case "kedaluwarsa":
      return "Permintaan kedaluwarsa";
  }
}

export default async function PermintaanPage() {
  let requests: SwapRequest[] = [];
  let failed = false;

  try {
    const response = await serverGet<{ items: SwapRequest[] }>(
      "/swap-requests/mine"
    );
    requests = response.items;
  } catch {
    failed = true;
  }

  const activeCount = requests.filter(
    (request) => request.status === "menunggu"
  ).length;

  return (
    <main className="member-main">
      <PageHeading
        eyebrow="Perjalanan buku Anda"
        title="Permintaan Saya"
        subtitle="Pantau status penukaran dan langkah berikutnya."
        actions={
          <Link className="button button-primary" href="/katalog">
            Cari Buku <span aria-hidden="true">→</span>
          </Link>
        }
      />
      <Alert variant="info" className="section-gap-sm">
        Permintaan yang menunggu berlaku selama 3 hari. Bawa buku yang
        ditawarkan dan temui admin untuk menyelesaikan penukaran.
      </Alert>
      <div className="helper-box section-gap-sm">
        <strong>
          Permintaan aktif: {activeCount} dari {MAX_ACTIVE_REQUESTS}.
        </strong>{" "}
        {activeCount < MAX_ACTIVE_REQUESTS
          ? `Anda masih dapat mengajukan ${
              MAX_ACTIVE_REQUESTS - activeCount
            } permintaan lagi.`
          : "Batas permintaan aktif tercapai."}
      </div>
      {failed ? (
        <Alert variant="danger">
          Gagal memuat permintaan. Pastikan server API berjalan, lalu muat ulang
          halaman ini.
        </Alert>
      ) : null}
      {!failed && requests.length === 0 ? (
        <div className="card empty-state">
          <span className="empty-icon" aria-hidden="true">
            ↔
          </span>
          <h2>Belum ada permintaan</h2>
          <p>
            Jelajahi katalog dan ajukan penukaran untuk buku yang Anda minati.
          </p>
          <Link className="button button-primary" href="/katalog">
            Jelajahi Katalog
          </Link>
        </div>
      ) : null}
      <div className="request-list">
        {requests.map((request) => {
          const book = request.requestedBook;
          const status = requestStatusMeta[request.status];
          return (
            <article className="card request-item" key={request.id}>
              <div className="request-thumb">
                <BookCover book={book} orb={false} />
              </div>
              <div className="request-info">
                <h2>{book.title}</h2>
                <p>
                  Ditukar dengan: {request.offeredBook.title} ·{" "}
                  {request.offeredBook.author}
                </p>
                <span className="request-id">
                  ID permintaan {request.id} · Dikirim{" "}
                  {formatDate(request.createdAt)}
                </span>
              </div>
              <div className="request-status">
                <Badge variant={status.variant}>{status.label}</Badge>
                <small>{statusNote(request)}</small>
                {request.status === "menunggu" ? (
                  <Link
                    className="button button-danger button-small"
                    href={`/permintaan/${request.id}/batalkan`}
                  >
                    Batalkan Permintaan
                  </Link>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
