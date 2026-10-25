import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/badge";
import { ReadonlyField } from "@/components/form";
import { PageHeading } from "@/components/page-heading";
import { formatDateLong, formatMonthYear, initials } from "@/lib/format";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Profil",
};

export default async function ProfilPage() {
  const user = await requireUser();

  return (
    <main className="member-main">
      <PageHeading
        eyebrow="Informasi anggota"
        title="Profil Saya"
        subtitle="Informasi akun Anda dikelola oleh admin."
      />
      <div className="profile-layout">
        <aside className="card profile-card">
          <span className="avatar avatar-large">{initials(user.name)}</span>
          <h2>{user.name}</h2>
          <p>Anggota sejak {formatMonthYear(user.createdAt)}</p>
          <Badge variant={user.isActive ? "success" : "neutral"}>
            {user.isActive ? "Akun Aktif" : "Akun Nonaktif"}
          </Badge>
          <nav className="profile-menu" aria-label="Menu profil">
            <Link className="active" href="/profil">
              Informasi Profil
            </Link>
            <Link href="/profil/kata-sandi">Ubah Kata Sandi</Link>
            <Link href="/permintaan">Permintaan Saya</Link>
          </nav>
        </aside>
        <section className="card card-pad">
          <div className="section-card-heading">
            <div>
              <h2>Data Anggota</h2>
              <p>Data pribadi hanya dapat diubah oleh admin.</p>
            </div>
            <Badge variant="neutral">Hanya dibaca</Badge>
          </div>
          <div className="profile-data">
            <ReadonlyField label="Nama Lengkap" value={user.name} />
            <ReadonlyField label="Nama Pengguna" value={user.username} />
            <ReadonlyField label="Nomor Telepon" value={user.phone} />
            <ReadonlyField
              label="Tanggal Bergabung"
              value={formatDateLong(user.createdAt)}
            />
            <ReadonlyField
              label="Alamat"
              value={user.address || "—"}
              span
            />
          </div>
          <div className="form-actions">
            <Link className="button button-secondary" href="/profil/kata-sandi">
              Ubah Kata Sandi
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
