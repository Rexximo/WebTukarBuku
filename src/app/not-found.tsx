import Link from "next/link";
import { EmptyState } from "@/components/empty-state";

export default function NotFound() {
  return (
    <main className="member-main">
      <EmptyState
        icon="?"
        title="Halaman tidak ditemukan"
        description="Halaman yang Anda cari tidak tersedia atau sudah dipindahkan."
      >
        <Link className="button button-primary" href="/">
          Kembali ke beranda
        </Link>
      </EmptyState>
    </main>
  );
}
