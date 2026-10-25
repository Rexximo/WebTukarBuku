import type { Metadata } from "next";
import Link from "next/link";
import { AdminTopbar } from "@/components/admin-topbar";
import { Alert } from "@/components/alert";
import { Badge } from "@/components/badge";
import { SelectField, TextField } from "@/components/form";
import { MemberActiveButton } from "@/components/member-active-button";
import { PageHeading } from "@/components/page-heading";
import { Pagination } from "@/components/pagination";
import { ResetPasswordPanel } from "@/components/reset-password-panel";
import { serverGet } from "@/lib/api-server";
import { formatDate } from "@/lib/format";
import { buildQuery } from "@/lib/query";
import { first, firstNumber, type SearchParamsPromise } from "@/lib/search-params";
import type { Paginated, User, UserResponse } from "@/lib/types";

export const metadata: Metadata = {
  title: "Kelola Anggota",
};

const statusOptions = [
  { value: "aktif", label: "Aktif" },
  { value: "nonaktif", label: "Nonaktif" },
];

export default async function AdminAnggotaPage({
  searchParams,
}: {
  searchParams: SearchParamsPromise;
}) {
  const params = await searchParams;
  const q = first(params.q);
  const status = first(params.status);
  const page = firstNumber(params.page);
  const resetUsername = first(params.reset);

  let data: Paginated<User> = {
    items: [],
    page,
    limit: 20,
    total: 0,
    totalPages: 1,
  };
  let failed = false;

  try {
    data = await serverGet<Paginated<User>>(
      `/users${buildQuery({ q, status, page, limit: 20 })}`
    );
  } catch {
    failed = true;
  }

  let resetMember: User | null = null;
  if (resetUsername) {
    try {
      resetMember = (
        await serverGet<UserResponse>(`/users/${resetUsername}`)
      ).user;
    } catch {
      resetMember = null;
    }
  }

  const makeHref = (nextPage: number) =>
    `/admin/anggota${buildQuery({ q, status, page: nextPage })}`;

  return (
    <>
      <AdminTopbar
        crumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Kelola Anggota" },
        ]}
      />
      <main className="admin-main">
        <PageHeading
          eyebrow="Komunitas pembaca"
          title="Kelola Anggota"
          subtitle="Buat akun anggota setelah mendaftar langsung melalui admin."
          actions={
            <Link className="button button-primary" href="/admin/anggota/baru">
              + Tambah Anggota
            </Link>
          }
        />
        <Alert variant="info" className="section-gap-sm">
          Anggota tidak dapat mendaftar sendiri. Berikan nama pengguna dan kata
          sandi sementara setelah akun dibuat.
        </Alert>
        {failed ? (
          <Alert variant="danger" className="section-gap-sm">
            Gagal memuat data anggota. Pastikan server API berjalan, lalu muat
            ulang halaman ini.
          </Alert>
        ) : null}
        <section className="card content-card">
          <div className="table-toolbar">
            <form className="filter-row" action="/admin/anggota" method="get">
              <TextField
                id="member-search"
                name="q"
                label="Cari anggota"
                placeholder="Nama atau nama pengguna"
                defaultValue={q}
              />
              <SelectField
                id="member-status"
                name="status"
                label="Status akun"
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
                  <th>Anggota</th>
                  <th>Nama Pengguna</th>
                  <th>Telepon</th>
                  <th>Bergabung</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((member) => (
                  <tr key={member.id}>
                    <td data-label="Anggota">
                      <strong>{member.name}</strong>
                      <span className="subline">
                        {member.address || "—"}
                      </span>
                    </td>
                    <td data-label="Nama pengguna">{member.username}</td>
                    <td data-label="Telepon">{member.phone}</td>
                    <td data-label="Bergabung">
                      {formatDate(member.createdAt)}
                    </td>
                    <td data-label="Status">
                      <Badge variant={member.isActive ? "success" : "neutral"}>
                        {member.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </td>
                    <td data-label="Aksi">
                      <span className="table-actions">
                        <Link
                          className="button button-secondary button-small"
                          href={`/admin/anggota/${member.id}/ubah`}
                        >
                          Ubah
                        </Link>
                        {member.isActive ? (
                          <Link
                            className="text-button"
                            href={`/admin/anggota${buildQuery({
                              q,
                              status,
                              reset: member.id,
                            })}#atur-ulang`}
                          >
                            Atur Ulang Kata Sandi
                          </Link>
                        ) : (
                          <MemberActiveButton
                            username={member.username}
                            name={member.name}
                          />
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.total > 0 ? (
            <Pagination
              page={data.page}
              totalPages={data.totalPages}
              total={data.total}
              label="anggota"
              firstItem={(data.page - 1) * data.limit + 1}
              lastItem={(data.page - 1) * data.limit + data.items.length}
              makeHref={makeHref}
            />
          ) : null}
        </section>
        {resetMember ? (
          <ResetPasswordPanel
            username={resetMember.username}
            name={resetMember.name}
          />
        ) : null}
      </main>
    </>
  );
}
