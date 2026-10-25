import type { Metadata } from "next";
import { AdminTopbar } from "@/components/admin-topbar";
import { BookForm } from "@/components/book-form";
import { PageHeading } from "@/components/page-heading";

export const metadata: Metadata = {
  title: "Tambah Buku",
};

export default function AdminBukuBaruPage() {
  return (
    <>
      <AdminTopbar
        crumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Kelola Buku", href: "/admin/buku" },
          { label: "Tambah Buku" },
        ]}
      />
      <main className="admin-main">
        <PageHeading
          eyebrow="Koleksi baru"
          title="Tambah Buku"
          subtitle="Lengkapi informasi buku agar anggota mudah menemukannya."
        />
        <BookForm />
      </main>
    </>
  );
}
