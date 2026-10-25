import type { Metadata } from "next";
import { Alert } from "@/components/alert";
import { ChangePasswordForm } from "@/components/change-password-form";
import { PageHeading } from "@/components/page-heading";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "Ubah Kata Sandi",
};

export default async function KataSandiPage() {
  const user = await requireUser();

  return (
    <main className="member-main">
      <PageHeading
        eyebrow="Keamanan akun"
        title="Ubah Kata Sandi"
        subtitle="Gunakan kata sandi yang kuat dan tidak mudah ditebak."
      />
      {user.mustChangePassword ? (
        <Alert variant="warning" className="card-narrow-note">
          Anda masih menggunakan kata sandi sementara. Ganti kata sandi untuk
          melanjutkan menggunakan situs.
        </Alert>
      ) : (
        <Alert variant="info" className="card-narrow-note">
          Untuk keamanan, kata sandi baru minimal 8 karakter. Jangan gunakan
          kata sandi yang sama dengan akun lain.
        </Alert>
      )}
      <section className="card card-pad card-narrow">
        <ChangePasswordForm />
      </section>
    </main>
  );
}
