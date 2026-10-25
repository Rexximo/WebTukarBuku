import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminTopbar } from "@/components/admin-topbar";
import { Badge } from "@/components/badge";
import { MemberForm } from "@/components/member-form";
import { PageHeading } from "@/components/page-heading";
import { serverGet } from "@/lib/api-server";
import type { User, UserResponse } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const { user } = await serverGet<UserResponse>(`/users/${id}`);
    return { title: `Ubah ${user.name}` };
  } catch {
    return { title: "Ubah Data Anggota" };
  }
}

export default async function AdminAnggotaUbahPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let member: User;
  try {
    member = (await serverGet<UserResponse>(`/users/${id}`)).user;
  } catch {
    notFound();
  }

  return (
    <>
      <AdminTopbar
        crumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Kelola Anggota", href: "/admin/anggota" },
          { label: "Ubah Data" },
        ]}
      />
      <main className="admin-main">
        <PageHeading
          eyebrow="Data akun anggota"
          title="Ubah Data Anggota"
          subtitle="Perbarui informasi atau status akun anggota."
          actions={
            <Badge variant={member.isActive ? "success" : "neutral"}>
              {member.isActive ? "Aktif" : "Nonaktif"}
            </Badge>
          }
        />
        <section className="card content-card card-wide">
          <div className="section-card-heading">
            <div>
              <h2>{member.name}</h2>
              <p>Nama pengguna: {member.username}</p>
            </div>
          </div>
          <MemberForm member={member} />
        </section>
      </main>
    </>
  );
}
