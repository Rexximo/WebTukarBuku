import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminTopbar } from "@/components/admin-topbar";
import { Alert } from "@/components/alert";
import { Badge } from "@/components/badge";
import { PageHeading } from "@/components/page-heading";
import { RequestDecisionForm } from "@/components/request-decision-form";
import { serverGet } from "@/lib/api-server";
import { formatDate } from "@/lib/format";
import { bookStatusMeta, conditionLabel, requestStatusMeta } from "@/lib/status";
import type { RequestResponse, SwapRequest } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return { title: `Detail Permintaan ${id}` };
}

export default async function AdminPermintaanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let request: SwapRequest;
  try {
    request = (await serverGet<RequestResponse>(`/swap-requests/${id}`))
      .request;
  } catch {
    notFound();
  }

  const status = requestStatusMeta[request.status];
  const bookStatus = bookStatusMeta[request.requestedBook.status];

  return (
    <>
      <AdminTopbar
        crumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Permintaan Penukaran", href: "/admin/permintaan" },
          { label: request.id },
        ]}
      />
      <main className="admin-main">
        <PageHeading
          eyebrow="Tinjau penukaran"
          title={`Permintaan ${request.id}`}
          subtitle={`Diajukan ${formatDate(request.createdAt)}${
            request.expiresAt
              ? ` · Kedaluwarsa ${formatDate(request.expiresAt)}`
              : ""
          }`}
          actions={<Badge variant={status.variant}>{status.label}</Badge>}
        />
        {request.status === "menunggu" ? (
          <Alert variant="warning" className="section-gap-sm">
            Sebelum memproses, periksa buku fisik yang dibawa anggota dan
            pastikan kondisinya sesuai.
          </Alert>
        ) : null}
        <div className="detail-columns">
          <section className="card content-card">
            <div className="section-card-heading">
              <div>
                <h2>Buku yang dipilih anggota</h2>
                <p>Buku katalog yang ingin ditukar.</p>
              </div>
              <Badge variant={bookStatus.variant}>{bookStatus.label}</Badge>
            </div>
            <div className="admin-request-book">
              <span
                className="table-book-cover"
                style={
                  request.requestedBook.coverUrl
                    ? {
                        backgroundImage: `url(${request.requestedBook.coverUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : undefined
                }
              ></span>
              <div>
                <h3>{request.requestedBook.title}</h3>
                <p>
                  {request.requestedBook.author} ·{" "}
                  {request.requestedBook.genre}
                </p>
                <Badge variant="neutral">
                  Kondisi: {conditionLabel[request.requestedBook.condition]}
                </Badge>
              </div>
            </div>
            <div className="section-card-heading request-offer-heading">
              <div>
                <h2>Buku yang ditawarkan</h2>
                <p>Buku yang akan dibawa anggota ke lokasi admin.</p>
              </div>
            </div>
            <div className="admin-request-book">
              <span
                className="table-book-cover"
                style={
                  request.offeredBook.photoUrl
                    ? {
                        backgroundImage: `url(${request.offeredBook.photoUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : undefined
                }
              ></span>
              <div>
                <h3>{request.offeredBook.title}</h3>
                <p>{request.offeredBook.author}</p>
                <Badge variant="neutral">
                  Kondisi: {conditionLabel[request.offeredBook.condition]}
                </Badge>
              </div>
            </div>
            <dl className="info-list request-info-list">
              {request.offeredBook.notes ? (
                <>
                  <dt>Catatan anggota</dt>
                  <dd>{request.offeredBook.notes}</dd>
                </>
              ) : null}
              <dt>Nama anggota</dt>
              <dd>
                <Link
                  className="text-button"
                  href={`/admin/anggota/${request.member.id}/ubah`}
                >
                  {request.member.name}
                </Link>
              </dd>
              <dt>Nama pengguna</dt>
              <dd>{request.member.username}</dd>
              <dt>Nomor telepon</dt>
              <dd>{request.member.phone}</dd>
              <dt>Lokasi pertemuan</dt>
              <dd>Datang langsung ke admin</dd>
              {request.rejectReason ? (
                <>
                  <dt>Alasan ditolak</dt>
                  <dd>{request.rejectReason}</dd>
                </>
              ) : null}
            </dl>
          </section>
          <aside className="card content-card">
            <div className="section-card-heading">
              <div>
                <h2>Proses Permintaan</h2>
                <p>Keputusan hanya dapat dilakukan admin.</p>
              </div>
            </div>
            {request.status === "menunggu" ? (
              <RequestDecisionForm requestId={request.id} />
            ) : (
              <Alert variant="info">
                Permintaan ini sudah berstatus <strong>{status.label}</strong>.
                Tidak ada tindakan yang diperlukan.
              </Alert>
            )}
          </aside>
        </div>
        <div className="page-heading-actions request-back-row">
          <Link className="button button-secondary" href="/admin/permintaan">
            ← Kembali ke permintaan
          </Link>
        </div>
      </main>
    </>
  );
}
