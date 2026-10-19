import type { Metadata } from "next";
import Link from "next/link";
import { AdminTopbar } from "@/components/admin-topbar";
import { Alert } from "@/components/alert";
import { Badge } from "@/components/badge";
import { PageHeading } from "@/components/page-heading";
import { serverGet } from "@/lib/api-server";
import { formatDate } from "@/lib/format";
import { requestStatusMeta } from "@/lib/status";
import type { DashboardStats } from "@/lib/types";

export const metadata: Metadata = {
  title: "Dashboard Admin",
};

export default async function AdminDashboardPage() {
  let stats: DashboardStats | null = null;

  try {
    stats = await serverGet<DashboardStats>("/admin/stats");
  } catch {
    stats = null;
  }

  if (!stats) {
    return (
      <>
        <AdminTopbar crumbs={[{ label: "Dashboard" }]} />
        <main className="admin-main">
          <Alert variant="danger">
            Gagal memuat dashboard. Pastikan server API berjalan, lalu muat
            ulang halaman ini.
          </Alert>
        </main>
      </>
    );
  }

  const statCards = [
    {
      label: "Total Buku",
      value: stats.totalBooks,
      trend: "Seluruh koleksi katalog",
      icon: "▤",
    },
    {
      label: "Buku Tersedia",
      value: stats.availableBooks,
      trend: "Siap diajukan untuk ditukar",
      icon: "✓",
    },
    {
      label: "Total Anggota",
      value: stats.totalMembers,
      trend: "Anggota aktif komunitas",
      icon: "♙",
    },
    {
      label: "Permintaan Menunggu",
      value: stats.pendingRequests,
      trend: "Perlu ditinjau admin",
      icon: "◷",
    },
  ];

  return (
    <>
      <AdminTopbar crumbs={[{ label: "Dashboard" }]} />
      <main className="admin-main">
        <PageHeading
          eyebrow="Ringkasan aktivitas"
          title="Dashboard"
          subtitle="Pantau koleksi dan aktivitas penukaran hari ini."
          actions={
            <Link className="button button-primary" href="/admin/buku/baru">
              + Tambah Buku
            </Link>
          }
        />
        <div className="stats-grid">
          {statCards.map((card) => (
            <article className="card stat-card" key={card.label}>
              <span className="stat-label">{card.label}</span>
              <strong className="stat-value">{card.value}</strong>
              <span className="stat-trend">{card.trend}</span>
              <span className="stat-icon" aria-hidden="true">
                {card.icon}
              </span>
            </article>
          ))}
        </div>
        <div className="admin-dashboard-grid">
          <section className="card content-card">
            <div className="section-card-heading">
              <div>
                <h2>Permintaan Terbaru</h2>
                <p>Permintaan yang membutuhkan tindak lanjut.</p>
              </div>
              <Link className="text-button" href="/admin/permintaan">
                Lihat semua →
              </Link>
            </div>
            <div className="table-wrap">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Anggota</th>
                    <th>Buku dipilih</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.latestRequests.map((request) => {
                    const status = requestStatusMeta[request.status];
                    return (
                      <tr key={request.id}>
                        <td data-label="Anggota">
                          <strong>{request.member.name}</strong>
                          <span className="subline">{request.id}</span>
                        </td>
                        <td data-label="Buku">
                          {request.requestedBook.title}
                          <span className="subline">
                            Tukar: {request.offeredBook.title}
                          </span>
                        </td>
                        <td data-label="Tanggal">
                          {formatDate(request.createdAt)}
                        </td>
                        <td data-label="Status">
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </td>
                        <td data-label="Aksi">
                          <Link
                            className="text-button"
                            href={`/admin/permintaan/${request.id}`}
                          >
                            {request.status === "menunggu" ? "Tinjau" : "Detail"}
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
          <aside className="card content-card">
            <div className="section-card-heading">
              <div>
                <h2>Akses Cepat</h2>
                <p>Kelola aktivitas utama.</p>
              </div>
            </div>
            <nav className="admin-action-list">
              <Link href="/admin/buku/baru">
                <span className="nav-glyph">+</span>Tambah buku baru
              </Link>
              <Link href="/admin/anggota/baru">
                <span className="nav-glyph">♙</span>Tambah anggota
              </Link>
              <Link href="/admin/permintaan">
                <span className="nav-glyph">↔</span>Proses permintaan
              </Link>
              <Link href="/katalog">
                <span className="nav-glyph">◎</span>Lihat katalog anggota
              </Link>
            </nav>
            <Alert variant="info" className="alert-cover-note">
              Permintaan menunggu akan kedaluwarsa otomatis setelah 3 hari.
            </Alert>
          </aside>
        </div>
      </main>
    </>
  );
}
