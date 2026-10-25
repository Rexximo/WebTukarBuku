import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CancelRequestForm } from "@/components/cancel-request-form";
import { serverGet } from "@/lib/api-server";
import type { RequestResponse } from "@/lib/types";

export const metadata: Metadata = {
  title: "Batalkan Permintaan",
};

export default async function BatalkanPermintaanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let request;
  try {
    const response = await serverGet<RequestResponse>(`/swap-requests/${id}`);
    request = response.request;
  } catch {
    notFound();
  }

  if (request.status !== "menunggu") {
    notFound();
  }

  return (
    <main className="member-main">
      <p className="eyebrow">
        <Link href="/permintaan">Permintaan Saya</Link> &nbsp; / &nbsp;
        Konfirmasi
      </p>
      <section className="card empty-state confirm-box">
        <span className="empty-icon" aria-hidden="true">
          ↶
        </span>
        <p className="eyebrow">Konfirmasi tindakan</p>
        <h1 className="page-title">Batalkan permintaan?</h1>
        <p>
          Permintaan untuk <strong>{request.requestedBook.title}</strong> akan
          dibatalkan. Buku tersebut akan kembali tersedia di katalog dan tidak
          dapat dikembalikan ke status menunggu.
        </p>
        <div className="page-heading-actions">
          <Link className="button button-secondary" href="/permintaan">
            Kembali
          </Link>
          <CancelRequestForm
            requestId={request.id}
            bookTitle={request.requestedBook.title}
          />
        </div>
      </section>
    </main>
  );
}
