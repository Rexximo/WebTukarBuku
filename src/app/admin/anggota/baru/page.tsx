import type { Metadata } from "next";
import { AdminTopbar } from "@/components/admin-topbar";
import { Alert } from "@/components/alert";
import { MemberForm } from "@/components/member-form";
import { PageHeading } from "@/components/page-heading";

export const metadata: Metadata = {
  title: "Tambah Anggota",
};

export default function AdminAnggotaBaruPage() {
  return (
    <>
      <AdminTopbar
        crumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Kelola Anggota", href: "/admin/anggota" },
          { label: "Tambah Anggota" },
        ]}
      />
      <main className="admin-main">
        <PageHeading
          eyebrow="Anggota baru"
          title="Tambah Anggota"
          subtitle="Buat akun untuk calon anggota yang sudah datang langsung."
        />
        <Alert variant="info" className="card-wide-note">
          Setelah akun dibuat, sampaikan nama pengguna dan kata sandi sementara
          secara langsung. Anggota wajib mengganti kata sandi saat pertama kali
          masuk.
        </Alert>
        <section className="card content-card card-wide">
          <div className="section-card-heading">
            <div>
              <h2>Informasi Anggota</h2>
              <p>Kolom bertanda * wajib diisi.</p>
            </div>
          </div>
          <MemberForm />
        </section>
      </main>
    </>
  );
}
