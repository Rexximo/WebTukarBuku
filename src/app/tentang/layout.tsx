import type { ReactNode } from "react";
import Link from "next/link";
import { BrandIcon, BrandName } from "@/components/brand";
import "../landing.css";
import "./about.css";

const footerLinks = [
  { href: "#profil", label: "Tentang" },
  { href: "#visi-misi", label: "Visi & Misi" },
  { href: "#kegiatan", label: "Kegiatan" },
  { href: "#galeri", label: "Galeri" },
];

export default function AboutLayout({ children }: { children: ReactNode }) {
  return (
    <div className="landing about-site">
      <header className="site-header">
        <nav className="nav shell" aria-label="Navigasi FestivalTukarBuku">
          <Link className="brand" href="/" aria-label="FestivalTukarBuku, beranda">
            <BrandIcon className="brand-mark" />
            <span>
              <BrandName />
            </span>
          </Link>
          <div className="nav-links about-nav-links">
            <Link className="nav-link" href="/">
              Beranda
            </Link>
            <a className="nav-link active" href="#profil">
              Tentang
            </a>
            <Link className="nav-link" href="/keanggotaan">
              Keanggotaan
            </Link>
          </div>
          <Link className="button button-small button-outline" href="/masuk">
            Masuk <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </header>

      {children}

      <footer className="site-footer about-footer">
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
            <span className="footer-label">TENTANG KAMI</span>
            {footerLinks.map((link) => (
              <Link href={`/tentang${link.href}`} key={link.href}>
                {link.label}
              </Link>
            ))}
            <Link href="/keanggotaan">Keanggotaan</Link>
          </div>
          <div className="footer-note">
            <span className="footer-label">BERBAGI CERITA</span>
            <p>
              FestivalTukarBuku mempertemukan pembaca agar buku yang telah selesai
              dibaca bisa menemukan pemilik dan cerita baru.
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
