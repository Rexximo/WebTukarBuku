import type { Metadata } from "next";
import Link from "next/link";
import { Alert } from "@/components/alert";
import { Badge } from "@/components/badge";
import { PageHeading } from "@/components/page-heading";
import { serverGet } from "@/lib/api-server";
import { formatDate } from "@/lib/format";
import { requestStatusMeta } from "@/lib/status";
import type { SwapRequest } from "@/lib/types";

export const metadata: Metadata = {
  title: "Riwayat Penukaran",
};

const countWords = ["nol", "satu", "dua", "tiga", "empat", "lima"];

export default async function RiwayatPage() {
  let history: SwapRequest[] = [];
  let failed = false;

  try {
    const response = await serverGet<{ items: SwapRequest[] }>(
      "/swap-requests/mine?status=selesai"
    );
    history = response.items;
  } catch {
    failed = true;
  }

  const word = countWords[history.length] ?? String(history.length);
  const countLabel = word.charAt(0).toUpperCase() + word.slice(1);
  const finished = requestStatusMeta.selesai;

  return (
    <main className="member-main">
      <PageHeading
        eyebrow="Cerita yang pernah singgah"
        title="Riwayat Penukaran"
        subtitle="Buku-buku yang telah bertukar tangan melalui komunitas."
        actions={
          <Link className="button button-primary" href="/katalog">
            Jelajahi Katalog <span aria-hidden="true">→</span>
          </Link>
        }
      />
      <div className="card history-summary">
        <span className="history-count">{history.length}</span>
        <div>
          <strong>{countLabel} cerita baru telah Anda temukan</strong>
          <p>Terima kasih sudah berbagi bacaan dengan anggota lain.</p>
        </div>
      </div>
      {failed ? (
        <Alert variant="danger">
          Gagal memuat riwayat. Pastikan server API berjalan, lalu muat ulang
          halaman ini.
        </Alert>
      ) : null}
      {!failed && history.length === 0 ? (
        <div className="card empty-state">
          <span className="empty-icon" aria-hidden="true">
            ✦
          </span>
          <h2>Belum ada riwayat penukaran</h2>
          <p>Riwayat akan muncul setelah penukaran pertama Anda selesai.</p>
        </div>
      ) : null}
      {history.length > 0 ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Buku yang diterima</th>
                <th>Buku yang diberikan</th>
                <th>Tanggal selesai</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((request) => (
                <tr key={request.id}>
                  <td data-label="Buku diterima">
                    <strong>{request.requestedBook.title}</strong>
                    <span className="subline">
                      {request.requestedBook.author}
                    </span>
                  </td>
                  <td data-label="Buku diberikan">
                    {request.offeredBook.title}
                    <span className="subline">
                      {request.offeredBook.author}
                    </span>
                  </td>
                  <td data-label="Tanggal">
                    {formatDate(request.completedAt ?? request.createdAt)}
                  </td>
                  <td data-label="Status">
                    <Badge variant={finished.variant}>{finished.label}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      <nav className="pagination" aria-label="Halaman riwayat">
        <span>
          Menampilkan {history.length > 0 ? 1 : 0}–{history.length} dari{" "}
          {history.length} penukaran
        </span>
        <span className="pagination-links">
          <span aria-current="page" className="pagination-current">
            1
          </span>
        </span>
      </nav>
    </main>
  );
}
