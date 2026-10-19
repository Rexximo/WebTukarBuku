import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminTopbar } from "@/components/admin-topbar";
import { Badge } from "@/components/badge";
import { BookForm } from "@/components/book-form";
import { PageHeading } from "@/components/page-heading";
import { serverGet } from "@/lib/api-server";
import { bookStatusMeta } from "@/lib/status";
import type { Book, BookResponse } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const { book } = await serverGet<BookResponse>(`/books/${id}`);
    return { title: `Ubah ${book.title}` };
  } catch {
    return { title: "Ubah Buku" };
  }
}

export default async function AdminBukuUbahPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let book: Book;
  try {
    book = (await serverGet<BookResponse>(`/books/${id}`)).book;
  } catch {
    notFound();
  }

  const status = bookStatusMeta[book.status];

  return (
    <>
      <AdminTopbar
        crumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Kelola Buku", href: "/admin/buku" },
          { label: "Ubah Buku" },
        ]}
      />
      <main className="admin-main">
        <PageHeading
          eyebrow="Perbarui informasi"
          title="Ubah Buku"
          subtitle="Perubahan akan terlihat pada katalog anggota."
          actions={<Badge variant={status.variant}>{status.label}</Badge>}
        />
        <BookForm book={book} />
      </main>
    </>
  );
}
