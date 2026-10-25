import type { Metadata } from "next";
import Link from "next/link";
import { AppBrand } from "@/components/brand";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Masuk",
};

export default function MasukPage() {
  return (
    <main className="login-page">
      <section className="login-art" aria-label="Tentang FestivalTukarBuku">
        <AppBrand />
        <div className="login-art-copy">
          <p className="eyebrow">Komunitas pembaca</p>
          <h1>
            Satu cerita selesai.
            <br />
            Cerita lain menunggu.
          </h1>
          <p>
            Temukan bacaan berikutnya dengan bertukar buku bersama komunitas.
            Tanpa biaya, cukup berbagi cerita.
          </p>
          <div className="login-book-stack" aria-hidden="true">
            <span className="login-book"></span>
            <span className="login-book"></span>
            <span className="login-book"></span>
          </div>
        </div>
        <p className="login-art-foot">
          Baca lebih banyak. Berbagi lebih jauh.
        </p>
      </section>
      <section className="login-panel" aria-labelledby="login-title">
        <div className="login-form-wrap">
          <AppBrand />
          <p className="eyebrow">Selamat datang kembali</p>
          <h2 id="login-title">Masuk ke akun Anda</h2>
          <p className="login-intro">
            Gunakan nama pengguna dan kata sandi dari admin.
          </p>
          <LoginForm />
          <p className="login-help">
            Belum memiliki akun? Datang langsung ke admin untuk mendaftar
            sebagai anggota.
          </p>
          <div className="demo-links">
            <span>Pratinjau halaman:</span>
            <Link href="/katalog">Anggota</Link>
            <span aria-hidden="true">·</span>
            <Link href="/admin">Admin</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
