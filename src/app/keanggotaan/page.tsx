import type { Metadata } from "next";
import Link from "next/link";
import { BrandIcon, BrandName } from "@/components/brand";
import { MembershipForm } from "@/components/membership-form";
import "../landing.css";
import "./membership.css";

const organizationAddress =
  "Jl. Soekarno-Hatta No.378, Kb. Lega, Kec. Bojongloa Kidul, Kota Bandung, Jawa Barat 40235";
const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(organizationAddress)}&output=embed`;

export const metadata: Metadata = {
  title: "Keanggotaan",
  description:
    "Daftar menjadi anggota komunitas FestivalTukarBuku melalui WhatsApp atau datang langsung ke admin.",
};

export default function KeanggotaanPage() {
  return (
    <div className="landing membership-site">
      <header className="site-header">
        <nav className="nav shell" aria-label="Navigasi utama">
          <Link className="brand" href="/" aria-label="FestivalTukarBuku, beranda">
            <BrandIcon className="brand-mark" />
            <span>
              <BrandName />
            </span>
          </Link>
          <div className="nav-links">
            <Link className="nav-link" href="/">
              Beranda
            </Link>
            <Link className="nav-link" href="/tentang">
              Tentang
            </Link>
            <Link className="nav-link active" href="/keanggotaan">
              Keanggotaan
            </Link>
          </div>
          <Link className="button button-small button-outline" href="/masuk">
            Masuk <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </header>

      <main className="membership-main">
        <section className="membership-hero shell">
          <p className="eyebrow">
            <span className="eyebrow-dot" /> JADI BAGIAN DARI KOMUNITAS
          </p>
          <h1>
            Cerita baru dimulai
            <br />
            <span>dengan berbagi.</span>
          </h1>
          <p>
            Daftar sebagai anggota lewat WhatsApp dengan formulir di bawah,
            atau datang langsung ke admin. Kami senang menyambut pembaca baru.
          </p>
        </section>

        <section className="membership-content shell">
          <div className="membership-form-card">
            <MembershipForm />
          </div>

          <aside className="membership-aside">
            <section className="membership-contact-card">
              <p className="eyebrow">PILIH CARA MENDAFTAR</p>
              <h2>Daftar lewat WhatsApp</h2>
              <p>
                Isi formulir, lalu periksa dan kirim pesan pendaftaran ke admin.
              </p>
              <a
                className="membership-contact-link"
                href="https://wa.me/62881022188667"
                target="_blank"
                rel="noreferrer"
              >
                <span className="membership-contact-icon" aria-hidden="true">◉</span>
                <span>
                  <small>WHATSAPP ADMIN</small>
                  <strong>+62 881-0221-88667</strong>
                </span>
                <span className="membership-external" aria-hidden="true">↗</span>
              </a>
              <div className="membership-divider" />
              <h3>Atau datang langsung</h3>
              <p className="membership-address">{organizationAddress}</p>
              <a
                className="button button-secondary membership-map-link"
                href="https://maps.app.goo.gl/SU74bu3fnihELwbY9"
                target="_blank"
                rel="noreferrer"
              >
                Buka lokasi di Google Maps <span aria-hidden="true">↗</span>
              </a>
              <div className="membership-map-frame">
                <iframe
                  title="Peta lokasi admin FestivalTukarBuku di Bandung"
                  src={mapEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </section>

            <section className="membership-social-card">
              <p className="eyebrow">IKUTI CERITA KAMI</p>
              <div className="membership-social-item">
                <span className="membership-social-icon" aria-hidden="true">◎</span>
                <span>
                  <strong>Instagram</strong>
                  <small>Akun dummy · tautan resmi menyusul</small>
                </span>
                <span className="membership-social-badge">SEGERA</span>
              </div>
              <p className="membership-social-note">
                Media sosial resmi lainnya akan ditambahkan setelah tersedia.
              </p>
            </section>
          </aside>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell footer-main">
          <div className="footer-brand-block">
            <Link className="brand footer-brand" href="/">
              <BrandIcon className="brand-mark" />
              <span>
                <BrandName />
              </span>
            </Link>
            <p>
              Lebih sedikit buku yang berdebu.
              <br />
              Lebih banyak cerita yang hidup.
            </p>
          </div>
          <div className="footer-links">
            <span className="footer-label">JELAJAHI</span>
            <Link href="/">Beranda</Link>
            <Link href="/tentang">Tentang Kami</Link>
            <Link href="/keanggotaan">Keanggotaan</Link>
          </div>
          <div className="footer-note">
            <span className="footer-label">PENDAFTARAN</span>
            <p>
              Bergabung melalui WhatsApp atau datang langsung ke admin di
              Bandung.
            </p>
          </div>
        </div>
        <div className="shell footer-bottom">
          <span>FestivalTukarBuku. Saling berbagi, saling membaca.</span>
          <Link href="/">Kembali ke beranda ↑</Link>
        </div>
      </footer>
    </div>
  );
}
