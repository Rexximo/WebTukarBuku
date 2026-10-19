import type { Metadata } from "next";
import Link from "next/link";
import { AdminTopbar } from "@/components/admin-topbar";
import { Alert } from "@/components/alert";
import { Badge } from "@/components/badge";
import { SelectField, TextField } from "@/components/form";
import { PageHeading } from "@/components/page-heading";
import { Pagination } from "@/components/pagination";
import { serverGet } from "@/lib/api-server";
import { formatDate } from "@/lib/format";
import { buildQuery } from "@/lib/query";
import { first, firstNumber, type SearchParamsPromise } from "@/lib/search-params";
import { requestStatusMeta } from "@/lib/status";
import type { DashboardStats, Paginated, SwapRequest } from "@/lib/types";

export const metadata: Metadata = {
  title: "Permintaan Penukaran",
};

const statusOptions = [
  { value: "menunggu", label: "Menunggu" },
  { value: "selesai", label: "Selesai" },
  { value: "ditolak", label: "Ditolak" },
  { value: "dibatalkan", label: "Dibatalkan" },
  { value: "kedaluwarsa", label: "Kedaluwarsa" },
];

export default async function AdminPermintaanPage({
  searchParams,
}: {
  searchParams: SearchParamsPromise;
}) {
  const params = await searchParams;
  const q = first(params.q);
  const status = first(params.status);
  const page = firstNumber(params.page);

  let data: Paginated<SwapRequest> = {
    items: [],
    page,
    limit: 20,
    total: 0,
    totalPages: 1,
  };
  let stats: DashboardStats | null = null;
  let failed = false;

  try {
    const [requestsResponse, statsResponse] = await Promise.all([
      serverGet<Paginated<SwapRequest>>(
        `/swap-requests${buildQuery({ q, status, page, limit: 20 })}`
      ),
      serverGet<DashboardStats>("/admin/stats"),
    ]);
    data = requestsResponse;
    stats = statsResponse;
  } catch {
    failed = true;
  }

  const tabs = [
    { value: "", label: `Semua (${stats?.totalRequests ?? 0})` },
    { value: "menunggu", label: `Menunggu (${stats?.pendingRequests ?? 0})` },
    { value: "selesai", label: "Selesai" },
    { value: "ditolak", label: "Ditolak" },
    { value: "kedaluwarsa", label: "Kedaluwarsa" },
  ];

  const makeHref = (nextPage: number) =>
    `/admin/permintaan${buildQuery({ q, status, page: nextPage })}`;

  return (
    <>
      <AdminTopbar
        crumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Permintaan Penukaran" },
        ]}
      />
      <main className="admin-main">
        <PageHeading
          eyebrow="Periksa dan proses"
          title="Permintaan Penukaran"
          subtitle="Pastikan buku fisik sesuai dengan informasi sebelum menyetujui."
        />
        <nav className="page-heading-actions tab-row" aria-label="Filter status">
          {tabs.map((tab) => {
            const href = `/admin/permintaan${buildQuery({
              q,
              status: tab.value,
            })}`;
            const isActive = status === tab.value;
            return (
              <Link
                key={tab.label}
                className={`button button-small ${
                  isActive ? "button-primary" : "button-secondary"
                }`}
                href={href}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
        {failed ? (
          <Alert variant="danger" className="section-gap-sm">
            Gagal memuat data permintaan. Pastikan server API berjalan, lalu
            muat ulang halaman ini.
          </Alert>
        ) : null}
        <section className="card content-card">
          <div className="table-toolbar">
            <form className="filter-row" action="/admin/permintaan" method="get">
              <TextField
                id="request-search"
                name="q"
                label="Cari permintaan"
                placeholder="Nama anggota atau judul buku"
                defaultValue={q}
              />
              <SelectField
                id="request-status"
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
                  <th>ID / Anggota</th>
                  <th>Buku yang dipilih</th>
                  <th>Buku yang ditawarkan</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((request) => {
                  const statusMeta = requestStatusMeta[request.status];
                  return (
                    <tr key={request.id}>
                      <td data-label="ID / Anggota">
                        <strong>{request.id}</strong>
                        <span className="subline">{request.member.name}</span>
                      </td>
                      <td data-label="Dipilih">
                        {request.requestedBook.title}
                        <span className="subline">
                          {request.requestedBook.author}
                        </span>
                      </td>
                      <td data-label="Ditawarkan">
                        {request.offeredBook.title}
                        <span className="subline">
                          {request.offeredBook.author}
                        </span>
                      </td>
                      <td data-label="Tanggal">
                        {formatDate(request.createdAt)}
                      </td>
                      <td data-label="Status">
                        <Badge variant={statusMeta.variant}>
                          {statusMeta.label}
                        </Badge>
                      </td>
                      <td data-label="Aksi">
                        <Link
                          className={`button button-small ${
                            request.status === "menunggu"
                              ? "button-primary"
                              : "button-secondary"
                          }`}
                          href={`/admin/permintaan/${request.id}`}
                        >
                          {request.status === "menunggu" ? "Proses" : "Detail"}
                        </Link>
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
              label="permintaan"
              firstItem={(data.page - 1) * data.limit + 1}
              lastItem={(data.page - 1) * data.limit + data.items.length}
              makeHref={makeHref}
            />
          ) : null}
        </section>
      </main>
    </>
  );
}
